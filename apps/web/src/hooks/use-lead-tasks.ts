import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLeadTasks(leadId: string) {
  return useQuery({
    queryKey: ["tasks", leadId], // Wir nutzen den selben Key wie useTasks
    queryFn: () => apiClient.getTasks(leadId),
    enabled: !!leadId,
  });
}
