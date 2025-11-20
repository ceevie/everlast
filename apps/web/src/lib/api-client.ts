import {
  CreateLeadDTO,
  CreateTaskDTO,
  CreateWorkflowDTO,
  DashboardStatsDTO,
  Lead,
  Task,
  Workflow,
} from "@everlast/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "tenant-demo-001";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  return res.json();
}

export const apiClient = {
  // Dashboard
  getDashboardStats: () => fetchApi<DashboardStatsDTO>("/dashboard"),

  // Leads
  getLeads: () => fetchApi<Lead[]>("/leads"),
  getLead: (id: string) => fetchApi<Lead>(`/leads/${id}`),
  createLead: (data: Omit<CreateLeadDTO, 'tenantId'>) =>
    fetchApi<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify({ ...data, tenantId: TENANT_ID }),
    }),
  updateLeadStatus: (id: string, status: string) =>
    fetchApi<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  updateLeadDetails: (id: string, data: Partial<Lead>) =>
    fetchApi<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Tasks
  getTasks: (leadId?: string) => {
    const query = leadId ? `?leadId=${leadId}` : "";
    return fetchApi<Task[]>(`/tasks${query}`);
  },
  createTask: (data: Omit<CreateTaskDTO, 'tenantId'>) =>
    fetchApi<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify({ ...data, tenantId: TENANT_ID }),
    }),
  updateTask: (id: string, data: Partial<Task>) =>
    fetchApi<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Workflows
  getWorkflows: () => fetchApi<Workflow[]>("/workflows"),
  createWorkflow: (data: CreateWorkflowDTO) =>
    fetchApi<Workflow>("/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteWorkflow: (id: string) => 
    fetchApi<{ success: boolean }>(`/workflows/${id}`, {
      method: "DELETE",
    }),
};
