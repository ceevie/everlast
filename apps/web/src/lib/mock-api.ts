import {
  CreateLeadDTO,
  CreateTaskDTO,
  CreateWorkflowDTO,
  Lead,
  LeadStatus,
  Task,
  Workflow,
} from "@everlast/types";
import {
  addLead,
  addTask,
  addWorkflow,
  completeTask,
  mockDb,
  reopenTaskDb,
  simulateDelay,
  updateLeadDetails,
  updateLeadStatus,
  workflowEngineHandleLeadCreated,
} from "./mock-db";

function mapTenant<T extends { tenantId: string }>(items: T[], tenantId: string) {
  return items.filter((item) => item.tenantId === tenantId);
}

export async function listLeads(tenantId: string): Promise<Lead[]> {
  await simulateDelay();
  return structuredClone(mapTenant(mockDb.leads, tenantId));
}

export async function getLeadById(
  tenantId: string,
  leadId: string,
): Promise<Lead | undefined> {
  await simulateDelay();
  const lead = mockDb.leads.find(
    (l) => l.id === leadId && l.tenantId === tenantId,
  );
  return lead ? structuredClone(lead) : undefined;
}

export async function createLead(payload: CreateLeadDTO): Promise<Lead> {
  await simulateDelay();
  const lead = addLead(payload);
  workflowEngineHandleLeadCreated(lead);
  return structuredClone(lead);
}

export async function updateLeadStatusApi(
  tenantId: string,
  leadId: string,
  status: LeadStatus,
): Promise<Lead> {
  await simulateDelay();
  const lead = updateLeadStatus(tenantId, leadId, status);
  if (!lead) {
    throw new Error("Lead not found");
  }
  return structuredClone(lead);
}

export async function updateLeadDetailsApi(
  tenantId: string,
  leadId: string,
  data: { email?: string; phone?: string; name?: string },
): Promise<Lead> {
  await simulateDelay();
  const lead = updateLeadDetails(tenantId, leadId, data);
  if (!lead) {
    throw new Error("Lead not found");
  }
  return structuredClone(lead);
}

export async function listTasks(tenantId: string): Promise<Task[]> {
  await simulateDelay();
  return structuredClone(mapTenant(mockDb.tasks, tenantId));
}

export async function listTasksByLead(
  tenantId: string,
  leadId: string,
): Promise<Task[]> {
  await simulateDelay();
  return structuredClone(
    mapTenant(mockDb.tasks, tenantId).filter((task) => task.leadId === leadId),
  );
}

export async function createTask(payload: CreateTaskDTO): Promise<Task> {
  await simulateDelay();
  const task = addTask(payload);
  return structuredClone(task);
}

export async function markTaskDone(taskId: string, tenantId: string): Promise<Task> {
  await simulateDelay();
  const updated = completeTask({ taskId, tenantId });
  if (!updated) {
    throw new Error("Task not found");
  }
  return structuredClone(updated);
}

export async function reopenTask(
  taskId: string,
  tenantId: string,
): Promise<Task> {
  await simulateDelay();
  const updated = reopenTaskDb({ taskId, tenantId });
  if (!updated) {
    throw new Error("Task not found");
  }
  return structuredClone(updated);
}

export async function listWorkflows(tenantId: string): Promise<Workflow[]> {
  await simulateDelay();
  return structuredClone(mapTenant(mockDb.workflows, tenantId));
}

export async function createWorkflow(
  payload: CreateWorkflowDTO,
): Promise<Workflow> {
  await simulateDelay();
  const workflow = addWorkflow(payload);
  return structuredClone(workflow);
}

