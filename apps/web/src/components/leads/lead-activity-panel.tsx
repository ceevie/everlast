"use client";

import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import {
  CommunicationChannel,
  CommunicationStatus,
  Lead,
} from "@everlast/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type LeadActivityPanelProps = {
  lead: Lead;
};

type TimelineItem = {
  id: string;
  at: string;
  title: string;
  detail?: string | null;
  badge?: string;
  variant?: BadgeProps["variant"];
};

const channelLabel: Record<CommunicationChannel, string> = {
  [CommunicationChannel.EMAIL]: "E-Mail",
  [CommunicationChannel.WHATSAPP]: "WhatsApp",
};

const commStatusLabel: Record<CommunicationStatus, string> = {
  [CommunicationStatus.SENT]: "Gesendet",
  [CommunicationStatus.FAILED]: "Fehlgeschlagen",
  [CommunicationStatus.SKIPPED]: "Übersprungen",
};

const commStatusVariant: Record<CommunicationStatus, BadgeProps["variant"]> = {
  [CommunicationStatus.SENT]: "success",
  [CommunicationStatus.FAILED]: "destructive",
  [CommunicationStatus.SKIPPED]: "secondary",
};

export function LeadActivityPanel({ lead }: LeadActivityPanelProps) {
  const items: TimelineItem[] = [
    ...(lead.communications ?? []).map((item) => ({
      id: `comm-${item.id}`,
      at: item.createdAt,
      title: `${channelLabel[item.channel]} · ${item.subject ?? item.preview ?? "Nachricht"}`,
      detail: item.error,
      badge: commStatusLabel[item.status],
      variant: commStatusVariant[item.status],
    })),
    ...(lead.notes ?? []).map((note) => ({
      id: `note-${note.id}`,
      at: note.createdAt,
      title: `Notiz von ${note.author}`,
      detail: note.body,
    })),
    ...(lead.enrollments ?? []).map((enrollment) => ({
      id: `enroll-${enrollment.id}`,
      at: enrollment.enrolledAt,
      title: `In Sequenz „${enrollment.workflow.name}“ eingeschrieben`,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Verlauf</CardTitle>
        <p className="text-sm text-muted-foreground">
          Nachrichten, Notizen und Sequenz-Ereignisse in zeitlicher Reihenfolge.
        </p>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ol className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="relative border-l pl-4">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border bg-background" />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium">{item.title}</p>
                  {item.badge ? (
                    <Badge variant={item.variant ?? "secondary"}>{item.badge}</Badge>
                  ) : null}
                </div>
                {item.detail ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.at), {
                    locale: de,
                    addSuffix: true,
                  })}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">Noch keine Aktivitäten.</p>
        )}
      </CardContent>
    </Card>
  );
}
