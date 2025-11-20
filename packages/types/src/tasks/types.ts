import { TaskCategory, TaskStatus, TaskType } from "../enums";

export type Task = {
  id: string;
  tenantId: string;
  leadId?: string | null;
  assignedToUserId?: string | null;
  title: string;
  category: TaskCategory;
  type: TaskType;
  status: TaskStatus;
  dueAt: string;
  createdAt: string;
  completedAt?: string | null;
};

