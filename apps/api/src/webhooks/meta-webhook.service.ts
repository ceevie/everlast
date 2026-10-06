import { createHmac, timingSafeEqual } from "crypto";
import { Injectable, Logger } from "@nestjs/common";
import { IntegrationProvider } from "@everlast/prisma";
import { LeadSource } from "@everlast/types";
import { PrismaService } from "../prisma.service";
import { LeadsService } from "../leads/leads.service";
import { MetaGraphService } from "./meta-graph.service";

export type MetaLeadgenValue = {
  leadgen_id?: string;
  page_id?: string;
  form_id?: string;
  ad_id?: string;
  adgroup_id?: string;
  campaign_id?: string;
  created_time?: number | string;
};

export type MetaWebhookPayload = {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: MetaLeadgenValue;
    }>;
  }>;
};

@Injectable()
export class MetaWebhookService {
  private readonly logger = new Logger(MetaWebhookService.name);

  constructor(
    private prisma: PrismaService,
    private leadsService: LeadsService,
    private metaGraph: MetaGraphService,
  ) {}

  isValidSignature(rawBody: Buffer | undefined, signatureHeader?: string): boolean {
    const secret = process.env.META_APP_SECRET;
    if (!secret) {
      this.logger.warn("META_APP_SECRET fehlt — Signaturprüfung übersprungen");
      return true;
    }
    if (!rawBody || !signatureHeader?.startsWith("sha256=")) return false;

    const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(signatureHeader);
    if (expectedBuf.length !== actualBuf.length) return false;
    return timingSafeEqual(expectedBuf, actualBuf);
  }

  isValidVerifyToken(token?: string): boolean {
    const expected = process.env.META_VERIFY_TOKEN;
    return Boolean(expected && token && token === expected);
  }

  async handlePayload(payload: MetaWebhookPayload): Promise<void> {
    if (payload.object && payload.object !== "page") return;

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== "leadgen" || !change.value?.leadgen_id) continue;
        try {
          await this.ingestLeadgen(change.value, entry.id);
        } catch (error) {
          this.logger.error(
            `Meta-Lead ${change.value.leadgen_id} fehlgeschlagen`,
            error instanceof Error ? error.stack : String(error),
          );
        }
      }
    }
  }

  private async ingestLeadgen(value: MetaLeadgenValue, entryPageId?: string) {
    const pageId = value.page_id || entryPageId;
    const leadgenId = value.leadgen_id;
    if (!pageId || !leadgenId) return;

    const integration = await this.prisma.integration.findFirst({
      where: {
        provider: IntegrationProvider.META,
        externalPageId: pageId,
        isActive: true,
      },
    });

    if (!integration) {
      this.logger.warn(`Keine aktive Meta-Integration für Page ${pageId}`);
      return;
    }

    if (!integration.accessToken) {
      this.logger.warn(
        `Meta-Integration ${integration.id} hat keinen Page Access Token`,
      );
      return;
    }

    const parsed = await this.metaGraph.fetchLead(
      leadgenId,
      integration.accessToken,
    );

    const result = await this.leadsService.ingest(integration.tenantId, {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      source: LeadSource.META,
      externalId: leadgenId,
      campaignId: value.campaign_id,
      adId: value.ad_id,
      formId: value.form_id,
      emailOptIn: parsed.emailOptIn,
      whatsappOptIn: parsed.whatsappOptIn,
      rawPayload: value as Record<string, unknown>,
    });

    this.logger.log(
      result.created
        ? `Meta-Lead ${leadgenId} angelegt (${result.lead.id})`
        : `Meta-Lead ${leadgenId} bereits vorhanden (${result.lead.id})`,
    );
  }
}
