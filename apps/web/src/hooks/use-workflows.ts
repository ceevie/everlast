import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateWorkflowDTO } from "@everlast/types";
import { apiClient } from "@/lib/api-client";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: () => apiClient.getWorkflows(),
  });
}

export function useCreateWorkflow() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkflowDTO) =>
      apiClient.createWorkflow(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}