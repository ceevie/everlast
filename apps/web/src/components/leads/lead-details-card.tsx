"use client";

import { useState } from "react";
import { Lead } from "@everlast/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { LeadStatusSelect } from "@/components/leads/lead-status-select";
import { LeadDetailsForm } from "@/components/leads/lead-details-form";
import { Button } from "@/components/ui/button";

type LeadDetailsCardProps = {
  lead: Lead;
};

export function LeadDetailsCard({ lead }: LeadDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg">Details</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Abbrechen" : "Bearbeiten"}
            </Button>
            <LeadStatusSelect leadId={lead.id} value={lead.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {isEditing ? (
          <LeadDetailsForm
            lead={lead}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{lead.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefon</p>
              <p>{lead.phone ?? "—"}</p>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Erstellt</span>
            <span>
              {formatDistanceToNow(new Date(lead.createdAt), {
                locale: de,
                addSuffix: true,
              })}
            </span>
          </div>
          {lead.lastActivityAt ? (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Letzte Aktivität</span>
              <span>
                {formatDistanceToNow(new Date(lead.lastActivityAt), {
                  locale: de,
                  addSuffix: true,
                })}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

