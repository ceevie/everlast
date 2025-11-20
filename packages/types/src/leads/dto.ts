export type CreateLeadDTO = {
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  ownerId?: string;
};

