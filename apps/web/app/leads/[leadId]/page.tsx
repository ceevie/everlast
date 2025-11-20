"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { LeadDetailsCard } from "@/components/leads/lead-details-card";
import { LeadTasksPanel } from "@/components/leads/lead-tasks-panel";
import { useLead } from "@/hooks/use-lead";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.leadId as string | undefined;
  const { data: lead, isLoading, isError } = useLead(leadId);

  if (!leadId) {
    return (
      <div className="space-y-4">
        <PageHeader title="Lead" description="Kein Lead ausgewählt." />
        <Button variant="outline" onClick={() => router.push("/leads")}>
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Lead" description="Lädt Details..." />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="space-y-4">
        <PageHeader title="Lead" description="Lead konnte nicht geladen werden." />
        <Button variant="outline" onClick={() => router.push("/leads")}>
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.name}
        description="Alle wichtigen Informationen und Follow-Up Tasks."
        actions={
          <Button variant="outline" onClick={() => router.push("/leads")}>
            Zurück
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <LeadDetailsCard lead={lead} />
        </div>
        <LeadTasksPanel leadId={lead.id} leadName={lead.name} />
      </div>
    </div>
  );
}

