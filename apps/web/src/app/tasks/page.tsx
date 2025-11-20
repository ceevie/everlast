"use client";

import { useMemo } from "react";
import { useTasks, useToggleTaskStatus } from "@/hooks/use-tasks";
import { PageHeader } from "@/components/ui/page-header";
import { TaskDataTable } from "@/components/tasks/task-data-table";
import { taskColumns } from "@/components/tasks/task-columns";
import { useLeads } from "@/hooks/use-leads";

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { data: leads } = useLeads();
  const toggleTaskStatus = useToggleTaskStatus();

  const rows = useMemo(() => {
    if (!tasks) return [];
    const leadMap = new Map((leads ?? []).map((lead) => [lead.id, lead.name]));
    return tasks.map((task) => ({
      ...task,
      leadName: task.leadId ? leadMap.get(task.leadId) : undefined,
    }));
  }, [tasks, leads]);

  const columns = useMemo(
    () =>
      taskColumns({
        onComplete: (task) =>
          toggleTaskStatus.mutate({ id: task.id, status: task.status }),
      }),
    [toggleTaskStatus],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Alle Follow-Up-Aufgaben für deine Leads."
      />
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Lade Tasks...
        </div>
      ) : (
        <TaskDataTable columns={columns} data={rows} />
      )}
    </div>
  );
}

