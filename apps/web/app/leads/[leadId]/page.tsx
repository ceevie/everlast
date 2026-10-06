"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { LeadDetailsCard } from "@/components/leads/lead-details-card";
import { LeadTasksPanel } from "@/components/leads/lead-tasks-panel";
import { LeadNotesPanel } from "@/components/leads/lead-notes-panel";
import { LeadAutomationsPanel } from "@/components/leads/lead-automations-panel";
import { LeadActivityPanel } from "@/components/leads/lead-activity-panel";
import { LeadTabs, type LeadTabId } from "@/components/leads/lead-tabs";
import { useLead } from "@/hooks/use-lead";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.leadId as string | undefined;
  const { data: lead, isLoading, isError } = useLead(leadId);
  const [tab, setTab] = useState<LeadTabId>("crm");

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
        description="Kontaktdaten, Sequenzen und Verlauf."
        actions={
          <Button variant="outline" onClick={() => router.push("/leads")}>
            Zurück
          </Button>
        }
      />

      <LeadTabs value={tab} onChange={setTab} />

      {tab === "crm" ? (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <LeadDetailsCard lead={lead} />
          <div className="space-y-6">
            <LeadNotesPanel lead={lead} />
            <LeadTasksPanel leadId={lead.id} leadName={lead.name} />
          </div>
        </div>
      ) : null}

      {tab === "automations" ? <LeadAutomationsPanel lead={lead} /> : null}

      {tab === "activity" ? <LeadActivityPanel lead={lead} /> : null}
    </div>
  );
}
