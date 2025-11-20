import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => apiClient.getLead(id),
    enabled: !!id,
  });
}

