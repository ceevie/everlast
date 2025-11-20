import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTaskDTO, TaskStatus } from "@everlast/types";
import { apiClient } from "@/lib/api-client";

// LeadId ist optional. Wenn gesetzt, filtern wir danach.
export function useTasks(leadId?: string) {
  return useQuery({
    queryKey: ["tasks", leadId],
    queryFn: () => apiClient.getTasks(leadId),
  });
}

export function useCreateTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreateTaskDTO, "tenantId">) =>
      apiClient.createTask(payload as any),
    onSuccess: () => {
      // Wir invalidieren alles, was mit Tasks zu tun hat
      client.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useToggleTaskStatus() {
  const client = useQueryClient();

  return useMutation({
    // Wir brauchen nur ID und den *neuen* Status
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => {
      // Unsere API hat "updateTask" (via PATCH)
      // Wir müssen apiClient erweitern oder fetchApi direkt nutzen.
      // Da apiClient noch kein 'updateTask' hat, fügen wir es schnell hinzu
      // oder nutzen hier fetch direkt.
      // Annahme: Wir erweitern apiClient gleich (siehe unten) oder nutzen createLead pattern

      // Da wir apiClient noch nicht erweitert haben, hier der Quick-Fix:
      return fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "cmi6auqhe0000z90fahugcswd", // Deine Tenant ID
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
