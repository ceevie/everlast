"use client";

import { FormEvent, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Lead } from "@everlast/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddLeadNote } from "@/hooks/use-add-lead-note";

type LeadNotesPanelProps = {
  lead: Lead;
};

export function LeadNotesPanel({ lead }: LeadNotesPanelProps) {
  const [body, setBody] = useState("");
  const mutation = useAddLeadNote();
  const notes = lead.notes ?? [];

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next = body.trim();
    if (!next) return;
    await mutation.mutateAsync({ leadId: lead.id, body: next });
    setBody("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notizen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-2" onSubmit={onSubmit}>
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Interne Notiz zum Kontakt..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!body.trim() || mutation.isPending}>
              {mutation.isPending ? "Speichern..." : "Notiz speichern"}
            </Button>
          </div>
        </form>

        {notes.length ? (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="rounded-lg border p-3">
                <p className="whitespace-pre-wrap text-sm">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {note.author} ·{" "}
                  {formatDistanceToNow(new Date(note.createdAt), {
                    locale: de,
                    addSuffix: true,
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>
        )}
      </CardContent>
    </Card>
  );
}
