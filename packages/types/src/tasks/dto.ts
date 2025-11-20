import { TaskCategory, TaskType } from "../enums";

export type CreateTaskDTO = {
  tenantId: string;
  leadId?: string;
  assignedToUserId?: string;
  title: string;
  category?: TaskCategory;
  type?: TaskType;
  dueAt: string;
};

export type CompleteTaskDTO = {
  taskId: string;
  tenantId: string;
};

