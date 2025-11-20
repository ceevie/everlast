import { WorkflowStatus, WorkflowTriggerEvent, WorkflowActionType } from "../enums";
import { WorkflowStepConfig } from "./types";

export type CreateWorkflowDTO = {
  tenantId: string;
  name: string;
  description?: string;
  triggerEvent: WorkflowTriggerEvent;
  status?: WorkflowStatus;
  steps: WorkflowStepConfig[];
};

export type WorkflowStepResponseDTO = {
  id: string;
  workflowId: string;
  order: number;
  actionType: WorkflowActionType;
  config?: WorkflowStepConfig | null;
  createdAt: string; 
};

export type WorkflowResponseDTO = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  triggerEvent: WorkflowTriggerEvent;
  status: WorkflowStatus;
  conditions?: Record<string, unknown> | null;
  createdAt: string; 
  updatedAt: string; 
  steps: WorkflowStepResponseDTO[]; 
};