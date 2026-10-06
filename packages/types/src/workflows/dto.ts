import { WorkflowStatus, WorkflowTriggerEvent, WorkflowActionType } from "../enums";
import { WorkflowConditions, WorkflowStepConfig } from "./types";

export type CreateWorkflowDTO = {
  tenantId?: string;
  name: string;
  description?: string;
  triggerEvent: WorkflowTriggerEvent;
  status?: WorkflowStatus;
  conditions?: WorkflowConditions | null;
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
  conditions?: WorkflowConditions | null;
  createdAt: string; 
  updatedAt: string; 
  steps: WorkflowStepResponseDTO[]; 
};