import { LeadSource } from "../enums";

export type CreateLeadDTO = {
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  ownerId?: string;
  source?: LeadSource;
  externalId?: string;
  campaignId?: string;
  adId?: string;
  formId?: string;
  emailOptIn?: boolean;
  whatsappOptIn?: boolean;
};

export type CreateLeadNoteDTO = {
  body: string;
  author?: string;
};
