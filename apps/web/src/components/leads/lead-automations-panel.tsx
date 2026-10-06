"use client";

import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Lead, WorkflowEnrollmentStatus } from "@everlast/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type LeadAutomationsPanelProps = {
  lead: Lead;
};

const statusLabel: Record<WorkflowEnrollmentStatus, string> = {
  [WorkflowEnrollmentStatus.ACTIVE]: "Aktiv",
  [WorkflowEnrollmentStatus.PAUSED]: "Pausiert",
  [WorkflowEnrollmentStatus.COMPLETED]: "Abgeschlossen",
  [WorkflowEnrollmentStatus.FAILED]: "Fehlgeschlagen",
};

const statusVariant: Record<WorkflowEnrollmentStatus, BadgeProps["variant"]> = {
  [WorkflowEnrollmentStatus.ACTIVE]: "default",
  [WorkflowEnrollmentStatus.PAUSED]: "secondary",
  [WorkflowEnrollmentStatus.COMPLETED]: "success",
  [WorkflowEnrollmentStatus.FAILED]: "destructive",
};

export function LeadAutomationsPanel({ lead }: LeadAutomationsPanelProps) {
  const enrollments = lead.enrollments ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sequenzen</CardTitle>
        <p className="text-sm text-muted-foreground">
          Automatisierungen, in denen dieser Kontakt gerade oder schon gelaufen ist.
        </p>
      </CardHeader>
      <CardContent>
        {enrollments.length ? (
          <ul className="space-y-3">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{enrollment.workflow.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {enrollment.status === WorkflowEnrollmentStatus.COMPLETED
                        ? "Sequenz durchlaufen"
                        : `Aktueller Schritt ${enrollment.currentStep + 1}`}
                      {enrollment.nextRunAt
                        ? ` · nächster Lauf ${formatDistanceToNow(new Date(enrollment.nextRunAt), {
                            locale: de,
                            addSuffix: true,
                          })}`
                        : null}
                    </p>
                  </div>
                  <Badge variant={statusVariant[enrollment.status]}>
                    {statusLabel[enrollment.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  eingeschrieben{" "}
                  {formatDistanceToNow(new Date(enrollment.enrolledAt), {
                    locale: de,
                    addSuffix: true,
                  })}
                </p>
                {enrollment.lastError ? (
                  <p className="mt-2 text-sm text-destructive">{enrollment.lastError}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Dieser Kontakt ist in keiner Sequenz.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
