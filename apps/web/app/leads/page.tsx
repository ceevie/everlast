"use client";

import { useLeads } from "@/hooks/use-leads";
import { PageHeader } from "@/components/ui/page-header";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadsTable } from "@/components/leads/leads-table";
import { Button } from "@/components/ui/button";

function LeadsContent() {
  const { data, isLoading, isError, refetch } = useLeads();

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Lädt Leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-destructive">
        Konnte Leads nicht laden.
        <Button variant="outline" onClick={() => refetch()}>
          Neu laden
        </Button>
      </div>
    );
  }

  return <LeadsTable leads={data ?? []} />;
}

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Verwalte neue Interessenten und starte Follow-Up Workflows."
        actions={<LeadForm trigger={<Button>Lead anlegen</Button>} />}
      />
      <LeadsContent />
    </div>
  );
}
