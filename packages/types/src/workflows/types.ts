import {
  LeadSource,
  TaskCategory,
  TaskType,
  WorkflowActionType,
  WorkflowStatus,
  WorkflowTriggerEvent,
} from "../enums";

export type WorkflowConditions = {
  source?: LeadSource | LeadSource[];
  requireEmail?: boolean;
  requirePhone?: boolean;
};

export type WorkflowStepConfig = {
  actionType?: WorkflowActionType;
  title?: string;
  category?: TaskCategory;
  type?: TaskType;
  dueInHours?: number;
  subject?: string;
  body?: string;
  delayHours?: number;
  delayMinutes?: number;
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
  conditions?: WorkflowConditions | null;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
};

