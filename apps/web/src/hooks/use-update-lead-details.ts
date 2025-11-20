import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useUpdateLeadDetails() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: any }) =>
      apiClient.updateLeadDetails(leadId, data),
    onSuccess: (lead) => {
      toast.success("Lead aktualisiert");
      // Lead Details invalidieren
      client.invalidateQueries({ queryKey: ["lead", lead.id] });
      // Liste invalidieren
      client.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      toast.error("Fehler beim Aktualisieren des Leads");
    },
  });
}
