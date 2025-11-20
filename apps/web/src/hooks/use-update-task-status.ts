import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskStatus, Task } from "@everlast/types";
import { apiClient } from "@/lib/api-client";

export function useUpdateTaskStatus() {
  const client = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      apiClient.updateTask(id, { status }),
    onSuccess: (task: Task) => {
      client.invalidateQueries({ queryKey: ["tasks"] });
      // Falls wir auch Einzel-Tasks cachen:
      // client.invalidateQueries({ queryKey: ["task", task.id] });
    },
  });
}
