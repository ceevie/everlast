"use client";

import { useMemo, useState } from "react";
import { TaskStatus } from "@everlast/types";
import { useTasks, useToggleTaskStatus } from "@/hooks/use-tasks";
import { useLeads } from "@/hooks/use-leads";
import { PageHeader } from "@/components/ui/page-header";
import { TaskDataTable } from "@/components/tasks/task-data-table";
import { taskColumns } from "@/components/tasks/task-columns";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { data: leads } = useLeads();
  const toggleTaskStatus = useToggleTaskStatus();
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>(
    TaskStatus.OPEN,
  );

  const rows = useMemo(() => {
    if (!tasks) return [];
    const leadMap = new Map((leads ?? []).map((lead) => [lead.id, lead.name]));
    return tasks.map((task) => ({
      ...task,
      leadName: task.leadId ? leadMap.get(task.leadId) : undefined,
    }));
  }, [tasks, leads]);

const openTasksCount = useMemo(
  () => rows.filter((task) => task.status === TaskStatus.OPEN).length,
  [rows],
);

const archivedTasksCount = useMemo(
  () => rows.filter((task) => task.status === TaskStatus.DONE).length,
  [rows],
);

const totalTasksCount = rows.length;

const currentCountLabel = useMemo(() => {
  if (statusFilter === TaskStatus.OPEN) {
    return `${openTasksCount} offene Tasks`;
  }
  if (statusFilter === TaskStatus.DONE) {
    return `${archivedTasksCount} archivierte Tasks`;
  }
  return `${totalTasksCount} Tasks insgesamt`;
}, [statusFilter, openTasksCount, archivedTasksCount, totalTasksCount]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "ALL") return rows;
    return rows.filter((task) => task.status === statusFilter);
  }, [rows, statusFilter]);

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
        description="Verwalte alle Follow-Up Aufgaben in deinem CRM."
      />
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Lade Tasks...
        </div>
      ) : (
        <TaskDataTable
          columns={columns}
          data={filteredRows}
          filterControls={
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Offene", value: TaskStatus.OPEN as const },
                { label: "Archiviert", value: TaskStatus.DONE as const },
                { label: "Alle", value: "ALL" as const },
              ].map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={statusFilter === option.value ? "default" : "outline"}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
              <span className="text-sm text-muted-foreground">
                {currentCountLabel}
              </span>
            </div>
          }
        />
      )}
    </div>
  );
}
