import { LeadStatus } from "../enums";

export type Lead = {
  id: string;
  tenantId: string;
  ownerId?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: LeadStatus;
  lastActivityAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

