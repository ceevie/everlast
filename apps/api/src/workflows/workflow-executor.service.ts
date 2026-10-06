import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  Lead,
  LeadSource,
  WorkflowEnrollmentStatus,
  WorkflowStatus,
  WorkflowTriggerEvent,
} from "@everlast/prisma";
import { PrismaService } from "../prisma.service";
import { LeadCreatedEvent } from "../leads/events/lead-created.event";
import { SequenceQueueService } from "../sequence/sequence-queue.service";

type WorkflowConditions = {
  source?: LeadSource | LeadSource[];
  requireEmail?: boolean;
  requirePhone?: boolean;
};

@Injectable()
export class WorkflowExecutorService {
  private readonly logger = new Logger(WorkflowExecutorService.name);

  constructor(
    private prisma: PrismaService,
    private sequenceQueue: SequenceQueueService,
  ) {}

  @OnEvent("lead.created", { async: true })
  async handleLeadCreated(event: LeadCreatedEvent) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: event.leadId, tenantId: event.tenantId },
    });
    if (!lead) {
      this.logger.warn(`Lead ${event.leadId} nicht gefunden, Workflows übersprungen`);
      return;
    }

    const workflows = await this.prisma.workflow.findMany({
      where: {
        tenantId: event.tenantId,
        status: WorkflowStatus.ACTIVE,
        triggerEvent: WorkflowTriggerEvent.LEAD_CREATED,
      },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    for (const workflow of workflows) {
      if (!this.matchesConditions(lead, workflow.conditions)) {
        continue;
      }

      const enrollment = await this.enroll(workflow.id, lead);
      if (!enrollment) continue;

      this.logger.log(
        `Lead ${lead.id} in Workflow "${workflow.name}" eingeschrieben`,
      );

      try {
        await this.sequenceQueue.enqueue(enrollment.id);
      } catch (error) {
        this.logger.error(
          `Sequenz für Workflow ${workflow.id} konnte nicht gestartet werden`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }

  private matchesConditions(lead: Lead, rawConditions: unknown): boolean {
    if (!rawConditions || typeof rawConditions !== "object") return true;

    const conditions = rawConditions as WorkflowConditions;

    if (conditions.source) {
      const sources = Array.isArray(conditions.source)
        ? conditions.source
        : [conditions.source];
      if (!sources.includes(lead.source)) return false;
    }

    if (conditions.requireEmail && !lead.email) return false;
    if (conditions.requirePhone && !(lead.phoneE164 || lead.phone)) return false;

    return true;
  }

  private async enroll(workflowId: string, lead: Lead) {
    const existing = await this.prisma.workflowEnrollment.findUnique({
      where: {
        workflowId_leadId: { workflowId, leadId: lead.id },
      },
    });
    if (existing) {
      this.logger.log(
        `Lead ${lead.id} ist bereits in Workflow ${workflowId} eingeschrieben`,
      );
      return null;
    }

    return this.prisma.workflowEnrollment.create({
      data: {
        tenantId: lead.tenantId,
        workflowId,
        leadId: lead.id,
        status: WorkflowEnrollmentStatus.ACTIVE,
        currentStep: 0,
      },
    });
  }
}
