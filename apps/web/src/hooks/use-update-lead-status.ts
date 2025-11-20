import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadStatus } from "@everlast/types";
//import { updateLeadStatusApi } from "@/lib/mock-api";
import { apiClient } from "@/lib/api-client";

export function useUpdateLeadStatus() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      apiClient.updateLeadStatus(leadId, status), // <--- Nutzt jetzt den API Client
    onSuccess: (lead) => {
      // Cache invalidieren (damit die Liste und Details neu laden)
      client.invalidateQueries({ queryKey: ["leads"] });
      client.invalidateQueries({ queryKey: ["lead", lead.id] });
    },
  });
}
