import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useDeleteWorkflow() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteWorkflow(id),
    onSuccess: () => {
      toast.success("Workflow gelöscht");
      client.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: () => {
      toast.error("Fehler beim Löschen des Workflows");
    },
  });
}

