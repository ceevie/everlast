"use client";

import { Task, TaskStatus } from "@everlast/types";
import { Button } from "@/components/ui/button";
import { useUpdateTaskStatus } from "@/hooks/use-update-task-status";

type TaskActionCellProps = {
  task: Task;
};

export function TaskActionCell({ task }: TaskActionCellProps) {
  const mutation = useUpdateTaskStatus();

  const handleToggle = () => {
    const newStatus = task.status === TaskStatus.DONE 
      ? TaskStatus.OPEN 
      : TaskStatus.DONE;
    
    mutation.mutate({ id: task.id, status: newStatus });
  };

  return (
    <Button
      size="sm"
      variant={task.status === "DONE" ? "default" : "outline"}
      onClick={handleToggle}
      disabled={mutation.isPending}
    >
      {task.status === "DONE" ? "Reaktivieren" : "Erledigt"}
    </Button>
  );
}
