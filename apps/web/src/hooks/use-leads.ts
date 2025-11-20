import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateLeadDTO, Lead, LeadStatus } from "@everlast/types";
//import { createLead, listLeads } from "@/lib/mock-api";
import { apiClient } from "@/lib/api-client";


export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: () => apiClient.getLeads(), // <--- Neu
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createLead, // <--- Neu
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLeadStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      apiClient.updateLeadStatus(id, status),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
