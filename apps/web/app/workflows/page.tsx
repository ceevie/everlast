"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkflows } from "@/hooks/use-workflows";
import { PageHeader } from "@/components/ui/page-header";
import { WorkflowDataTable } from "@/components/workflows/workflow-data-table";
import { workflowColumns } from "@/components/workflows/workflow-columns";
import { Button } from "@/components/ui/button";

export default function WorkflowsPage() {
  const { data: workflows, isLoading } = useWorkflows();
  const router = useRouter();

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
        description="Automatisierte Follow-Up Abläufe pro Tenant."
        actions={
          <Button onClick={() => router.push("/workflows/new")}>
            Workflow erstellen
          </Button>
        }
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
