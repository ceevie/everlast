import { Injectable, Logger } from "@nestjs/common";
import {
  CommunicationChannel,
  CommunicationStatus,
  LeadStatus,
  TaskCategory,
  TaskType,
  WorkflowActionType,
  WorkflowEnrollmentStatus,
} from "@everlast/prisma";
import { PrismaService } from "../prisma.service";
import { MailerService } from "./mailer.service";
import { interpolate, previewText, toHtml } from "./template";

type StepConfig = {
  title?: string;
  category?: TaskCategory;
  type?: TaskType;
  dueInHours?: number;
  subject?: string;
  body?: string;
  delayHours?: number;
  delayMinutes?: number;
};

@Injectable()
export class SequenceRunnerService {
  private readonly logger = new Logger(SequenceRunnerService.name);

  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}

  async load(enrollmentId: string) {
    const enrollment = await this.prisma.workflowEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        lead: true,
        workflow: { include: { steps: { orderBy: { order: "asc" } } } },
      },
    });
    if (!enrollment) {
      throw new Error(`Enrollment ${enrollmentId} nicht gefunden`);
    }
    return enrollment;
  }

  delaySeconds(config: unknown): number {
    const parsed = (config ?? {}) as StepConfig;
    const hours =
      typeof parsed.delayHours === "number" && parsed.delayHours > 0
        ? parsed.delayHours
        : 0;
    const minutes =
      typeof parsed.delayMinutes === "number" && parsed.delayMinutes > 0
        ? parsed.delayMinutes
        : 0;
    return hours * 3600 + minutes * 60;
  }

  async runAction(
    enrollmentId: string,
    stepId: string,
    actionType: WorkflowActionType,
    config: unknown,
  ) {
    const enrollment = await this.load(enrollmentId);
    if (enrollment.status !== WorkflowEnrollmentStatus.ACTIVE) {
      this.logger.log(`Enrollment ${enrollmentId} ist ${enrollment.status}, Step übersprungen`);
      return { skipped: true };
    }

    if (actionType === WorkflowActionType.CREATE_TASK) {
      await this.createTask(enrollment.tenantId, enrollment.leadId, config);
      return { skipped: false };
    }

    if (actionType === WorkflowActionType.SEND_EMAIL) {
      await this.sendEmail(enrollment, config);
      return { skipped: false };
    }

    if (actionType === WorkflowActionType.WAIT) {
      return { skipped: false };
    }

    this.logger.warn(`Unbekannter Step ${stepId}: ${actionType}`);
    return { skipped: true };
  }

  async markStep(enrollmentId: string, currentStep: number, nextRunAt?: Date) {
    await this.prisma.workflowEnrollment.update({
      where: { id: enrollmentId },
      data: { currentStep, nextRunAt: nextRunAt ?? null, lastError: null },
    });
  }

  async complete(enrollmentId: string) {
    await this.prisma.workflowEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: WorkflowEnrollmentStatus.COMPLETED,
        nextRunAt: null,
        lastError: null,
      },
    });
  }

  async fail(enrollmentId: string, error: string) {
    await this.prisma.workflowEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: WorkflowEnrollmentStatus.FAILED,
        lastError: error.slice(0, 500),
      },
    });
  }

  /** Ohne Inngest: Steps bis zum ersten WAIT ausführen. */
  async runUntilWait(enrollmentId: string) {
    const enrollment = await this.load(enrollmentId);
    const steps = enrollment.workflow.steps;
    const start = enrollment.currentStep;

    for (let i = start; i < steps.length; i++) {
      const step = steps[i];
      if (step.actionType === WorkflowActionType.WAIT) {
        const seconds = this.delaySeconds(step.config);
        await this.markStep(
          enrollmentId,
          i,
          new Date(Date.now() + seconds * 1000),
        );
        this.logger.warn(
          `Inngest nicht konfiguriert — Sequenz ${enrollmentId} wartet bei Step ${step.id} (${seconds}s)`,
        );
        return;
      }

      await this.runAction(enrollmentId, step.id, step.actionType, step.config);
      await this.markStep(enrollmentId, i + 1);
    }

    await this.complete(enrollmentId);
  }

  private async createTask(tenantId: string, leadId: string, rawConfig: unknown) {
    const config = (rawConfig ?? {}) as StepConfig;
    const dueInHours = typeof config.dueInHours === "number" ? config.dueInHours : 24;

    await this.prisma.task.create({
      data: {
        tenantId,
        leadId,
        title: config.title || "Follow-Up Task",
        category: config.category ?? TaskCategory.FOLLOW_UP,
        type: config.type ?? TaskType.CALL,
        dueAt: new Date(Date.now() + dueInHours * 60 * 60 * 1000),
        status: "OPEN",
      },
    });
  }

  private async sendEmail(
    enrollment: Awaited<ReturnType<SequenceRunnerService["load"]>>,
    rawConfig: unknown,
  ) {
    const config = (rawConfig ?? {}) as StepConfig;
    const lead = enrollment.lead;
    const subjectTemplate = config.subject || "Nachricht von uns";
    const bodyTemplate = config.body || "Hallo {{name}}";
    const subject = interpolate(subjectTemplate, lead);
    const body = interpolate(bodyTemplate, lead, { html: true });

    if (!lead.email) {
      await this.log(enrollment, {
        status: CommunicationStatus.SKIPPED,
        subject,
        preview: previewText(body),
        error: "Keine E-Mail-Adresse",
      });
      return;
    }

    if (!lead.emailOptIn) {
      await this.log(enrollment, {
        status: CommunicationStatus.SKIPPED,
        subject,
        preview: previewText(body),
        error: "Kein E-Mail-Opt-in",
      });
      return;
    }

    if (!this.mailer.isConfigured()) {
      await this.log(enrollment, {
        status: CommunicationStatus.SKIPPED,
        subject,
        preview: previewText(body),
        error: "Resend nicht konfiguriert",
      });
      this.logger.warn("SEND_EMAIL übersprungen: RESEND_API_KEY/RESEND_FROM fehlen");
      return;
    }

    try {
      const sent = await this.mailer.send({
        to: lead.email,
        subject,
        html: toHtml(body),
      });
      await this.log(enrollment, {
        status: CommunicationStatus.SENT,
        subject,
        preview: previewText(body),
        providerMessageId: sent.id,
      });
      await this.prisma.lead.update({
        where: { id: lead.id },
        data: {
          lastActivityAt: new Date(),
          status: lead.status === LeadStatus.NEW ? LeadStatus.CONTACTED : lead.status,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.log(enrollment, {
        status: CommunicationStatus.FAILED,
        subject,
        preview: previewText(body),
        error: message,
      });
      throw error;
    }
  }

  private async log(
    enrollment: Awaited<ReturnType<SequenceRunnerService["load"]>>,
    data: {
      status: CommunicationStatus;
      subject: string;
      preview: string;
      error?: string;
      providerMessageId?: string;
    },
  ) {
    await this.prisma.communication.create({
      data: {
        tenantId: enrollment.tenantId,
        leadId: enrollment.leadId,
        enrollmentId: enrollment.id,
        channel: CommunicationChannel.EMAIL,
        status: data.status,
        subject: data.subject,
        preview: data.preview,
        error: data.error,
        providerMessageId: data.providerMessageId,
      },
    });
  }
}
