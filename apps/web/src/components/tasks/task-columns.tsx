import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Task } from "@everlast/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { TaskActionCell } from "@/components/tasks/task-action-cell";

export type TaskRow = Task & { leadName?: string };

export const taskColumns = ({
  onComplete,
}: {
  onComplete: (task: TaskRow) => void;
}): ColumnDef<TaskRow>[] => [
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "lead",
    header: "Lead",
    cell: ({ row }) =>
      row.original.leadId ? (
        <Link
          href={`/leads/${row.original.leadId}`}
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          {row.original.leadName ?? row.original.leadId}
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "type",
    header: "Typ",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "dueAt",
    header: "Fällig",
    sortingFn: (a, b) =>
      new Date(a.original.dueAt).getTime() -
      new Date(b.original.dueAt).getTime(),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.dueAt), {
          addSuffix: true,
          locale: de,
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant="task" status={row.original.status} />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <TaskActionCell task={row.original} />,
  },
];
