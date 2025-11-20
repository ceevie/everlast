import { ColumnDef } from "@tanstack/react-table";
import { Workflow, WorkflowStatus } from "@everlast/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { WorkflowActionCell } from "./workflow-action-cell";

export type WorkflowRow = Workflow & {
  stepsCount: number;
};

const statusVariant: Record<WorkflowStatus, "default" | "secondary"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
};

export const workflowColumns: ColumnDef<WorkflowRow>[] = [
  {
    accessorKey: "name",
    header: "Workflow",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "triggerEvent",
    header: "Trigger",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.triggerEvent}</span>
    ),
  },
  {
    accessorKey: "stepsCount",
    header: "Steps",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.stepsCount}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Zuletzt aktualisiert",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.updatedAt), {
          addSuffix: true,
          locale: de,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <WorkflowActionCell workflow={row.original} />,
  },
];
