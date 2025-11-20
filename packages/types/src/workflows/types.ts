import {
  TaskCategory,
  TaskType,
  WorkflowActionType,
  WorkflowStatus,
  WorkflowTriggerEvent,
} from "../enums";

export type WorkflowStepConfig = {
  title: string;
  category?: TaskCategory;
  type?: TaskType;
  dueInHours?: number;
};

export type WorkflowStep = {
  id: string;
  workflowId: string;
  order: number;
  actionType: WorkflowActionType;
  config?: WorkflowStepConfig | null;
  createdAt: string;
};

export type Workflow = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  triggerEvent: WorkflowTriggerEvent;
  status: WorkflowStatus;
  conditions?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
};

