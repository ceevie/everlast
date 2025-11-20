export type Tenant = {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
};

