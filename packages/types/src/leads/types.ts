import { LeadSource, LeadStatus, WorkflowEnrollmentStatus, CommunicationChannel, CommunicationStatus } from "../enums";

export type LeadEnrollment = {
  id: string;
  workflowId: string;
  status: WorkflowEnrollmentStatus;
  currentStep: number;
  nextRunAt?: string | null;
  lastError?: string | null;
  enrolledAt: string;
  workflow: {
    id: string;
    name: string;
  };
};

export type LeadCommunication = {
  id: string;
  channel: CommunicationChannel;
  status: CommunicationStatus;
  subject?: string | null;
  preview?: string | null;
  error?: string | null;
  createdAt: string;
};

export type LeadNote = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  tenantId: string;
  ownerId?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  phoneE164?: string | null;
  source: LeadSource;
  externalId?: string | null;
  campaignId?: string | null;
  adId?: string | null;
  formId?: string | null;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  status: LeadStatus;
  lastActivityAt?: string | null;
  createdAt: string;
  updatedAt: string;
  enrollments?: LeadEnrollment[];
  communications?: LeadCommunication[];
  notes?: LeadNote[];
};
