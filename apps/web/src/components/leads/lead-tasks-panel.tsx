"use client";

import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useLeadTasks } from "@/hooks/use-lead-tasks";
import { useUpdateTaskStatus } from "@/hooks/use-update-task-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadTaskForm } from "@/components/leads/lead-task-form";
import { StatusBadge } from "@/components/status-badge";
import { Task } from "@everlast/types";

type LeadTasksPanelProps = {
  leadId: string;
  leadName?: string;
};

export function LeadTasksPanel({ leadId, leadName }: LeadTasksPanelProps) {
  const { data: tasks, isLoading } = useLeadTasks(leadId);
  const updateTaskStatus = useUpdateTaskStatus();

  const openTasks = (tasks ?? []).filter((task) => task.status === "OPEN");

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Tasks</CardTitle>
          <p className="text-sm text-muted-foreground">
            Folgeaufgaben für {leadName ?? "den Lead"}.
          </p>
        </div>
        <LeadTaskForm
          leadId={leadId}
          trigger={<Button>Task hinzufügen</Button>}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Lade Tasks...
          </div>
        ) : openTasks.length ? (
          <div className="space-y-3">
            {openTasks.map((task) => (
              <LeadTaskRow
                key={task.id}
                task={task}
                onComplete={() =>
                  updateTaskStatus.mutate({ id: task.id, status: "DONE" })
                }
                loading={updateTaskStatus.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            Keine offenen Tasks.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LeadTaskRow({
  task,
  onComplete,
  loading,
}: {
  task: Task;
  onComplete: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-3">
      <div>
        <p className="font-medium">{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge variant="task" status={task.status} />
          <span>
            fällig{" "}
            {formatDistanceToNow(new Date(task.dueAt), {
              addSuffix: true,
              locale: de,
            })}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onComplete}
        disabled={loading}
      >
        Erledigt
      </Button>
    </div>
  );
}

