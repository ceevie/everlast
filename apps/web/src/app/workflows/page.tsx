"use client";

import { useMemo } from "react";
import { useWorkflows } from "@/hooks/use-workflows";
import { PageHeader } from "@/components/ui/page-header";
import { WorkflowDataTable } from "@/components/workflows/workflow-data-table";
import { workflowColumns } from "@/components/workflows/workflow-columns";

export default function WorkflowsPage() {
  const { data: workflows, isLoading } = useWorkflows();

  const rows = useMemo(() => {
    if (!workflows) return [];
    return workflows.map((workflow) => ({
      ...workflow,
      stepsCount: workflow.steps.length,
    }));
  }, [workflows]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Automatisiere Follow-Up Tasks und andere Aktionen."
      />
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Lade Workflows...
        </div>
      ) : (
        <WorkflowDataTable columns={workflowColumns} data={rows} />
      )}
    </div>
  );
}

