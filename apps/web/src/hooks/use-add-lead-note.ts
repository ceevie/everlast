import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useAddLeadNote() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, body }: { leadId: string; body: string }) =>
      apiClient.addLeadNote(leadId, body),
    onSuccess: (lead) => {
      toast.success("Notiz gespeichert");
      client.invalidateQueries({ queryKey: ["lead", lead.id] });
      client.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      toast.error("Notiz konnte nicht gespeichert werden");
    },
  });
}
