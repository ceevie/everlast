import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { LeadSource, Prisma } from "@everlast/prisma";
import { CreateLeadDTO } from "@everlast/types";
import { PrismaService } from "../prisma.service";
import { toE164 } from "../common/phone";
import { LeadCreatedEvent } from "./events/lead-created.event";

const leadWithEnrollments = {
  enrollments: {
    include: {
      workflow: {
        select: { id: true, name: true },
      },
    },
    orderBy: { enrolledAt: "desc" as const },
  },
  communications: {
    orderBy: { createdAt: "desc" as const },
    take: 50,
  },
  notes: {
    orderBy: { createdAt: "desc" as const },
    take: 50,
  },
};

export type IngestLeadInput = Omit<CreateLeadDTO, "tenantId"> & {
  rawPayload?: Record<string, unknown>;
};

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.lead.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: leadWithEnrollments,
    });
  }

  async create(tenantId: string, data: Omit<CreateLeadDTO, "tenantId">) {
    const lead = await this.prisma.lead.create({
      data: this.toLeadData(tenantId, data),
    });

    this.emitCreated(lead.tenantId, lead.id, lead.email);
    return lead;
  }

  async ingest(tenantId: string, data: IngestLeadInput) {
    const source = data.source ?? LeadSource.MANUAL;
    const externalId = data.externalId;

    if (externalId) {
      const existing = await this.prisma.lead.findFirst({
        where: { tenantId, source, externalId },
      });
      if (existing) return { lead: existing, created: false };
    }

    try {
      const lead = await this.prisma.lead.create({
        data: {
          ...this.toLeadData(tenantId, data),
          rawPayload: (data.rawPayload as Prisma.InputJsonValue) ?? undefined,
          lastActivityAt: new Date(),
        },
      });

      this.emitCreated(lead.tenantId, lead.id, lead.email);
      return { lead, created: true };
    } catch (error) {
      if (
        externalId &&
        typeof error === "object" &&
        error &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        const existing = await this.prisma.lead.findFirst({
          where: { tenantId, source, externalId },
        });
        if (existing) return { lead: existing, created: false };
      }
      throw error;
    }
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    const existing = await this.findOne(tenantId, id);
    if (!existing) return null;

    const phone =
      typeof data.phone === "string" ? data.phone : existing.phone;
    const {
      rawPayload: _rawPayload,
      enrollments: _enrollments,
      communications: _communications,
      notes: _notes,
      id: _id,
      tenantId: _tenantId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...safeData
    } = data;

    return this.prisma.lead.update({
      where: { id },
      data: {
        ...safeData,
        phoneE164:
          typeof data.phone === "string" ? toE164(phone) ?? null : undefined,
      },
      include: leadWithEnrollments,
    });
  }

  async addNote(tenantId: string, leadId: string, body: string, author?: string) {
    const existing = await this.findOne(tenantId, leadId);
    if (!existing) return null;

    await this.prisma.note.create({
      data: {
        tenantId,
        leadId,
        body: body.trim(),
        author: author?.trim() || "Team",
      },
    });

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { lastActivityAt: new Date() },
    });

    return this.findOne(tenantId, leadId);
  }

  private toLeadData(tenantId: string, data: Omit<CreateLeadDTO, "tenantId">) {
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      phoneE164: toE164(data.phone) ?? null,
      ownerId: data.ownerId,
      tenantId,
      source: data.source ?? LeadSource.MANUAL,
      externalId: data.externalId,
      campaignId: data.campaignId,
      adId: data.adId,
      formId: data.formId,
      emailOptIn: data.emailOptIn ?? true,
      whatsappOptIn: data.whatsappOptIn ?? false,
    };
  }

  private emitCreated(tenantId: string, leadId: string, email?: string | null) {
    this.eventEmitter.emit(
      "lead.created",
      new LeadCreatedEvent(tenantId, leadId, email || undefined),
    );
  }
}
