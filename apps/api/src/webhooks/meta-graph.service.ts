import { Injectable, Logger } from "@nestjs/common";
import { parseMetaLeadFields, ParsedMetaLead } from "./parse-meta-lead";

const GRAPH_BASE = "https://graph.facebook.com/v21.0";

type GraphLeadResponse = {
  id?: string;
  field_data?: Array<{ name?: string; values?: string[] }>;
  error?: { message?: string };
};

@Injectable()
export class MetaGraphService {
  private readonly logger = new Logger(MetaGraphService.name);

  async fetchLead(
    leadgenId: string,
    accessToken: string,
  ): Promise<ParsedMetaLead> {
    const url = new URL(`${GRAPH_BASE}/${encodeURIComponent(leadgenId)}`);
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url);
    const payload = (await response.json()) as GraphLeadResponse;

    if (!response.ok || payload.error) {
      const message = payload.error?.message ?? `HTTP ${response.status}`;
      this.logger.error(`Graph API lead fetch failed for ${leadgenId}: ${message}`);
      throw new Error(message);
    }

    return parseMetaLeadFields(payload.field_data, `Meta-Lead ${leadgenId}`);
  }
}
