import { UserRole } from "../enums";

export type User = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string | null;
  createdAt: string;
  updatedAt: string;
};

