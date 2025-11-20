"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ListTodo, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useDashboard } from "@/hooks/use-dashboard";

export default function Home() {
  const { data } = useDashboard();

  if (!data) return <div>Laden...</div>;

  const { counts, upcomingTasks, recentLeads } = data;

  return (
    <main className="space-y-6 p-6 lg:p-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold">Everlast CRM</h1>
            <p className="text-sm text-muted-foreground">
              Überblick über deine Leads, Tasks und Workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/leads">
                <Users className="mr-2 h-4 w-4" />
                Leads anzeigen
              </Link>
            </Button>
            <Button asChild>
              <Link href="/tasks">
                <ListTodo className="mr-2 h-4 w-4" />
                Tasks öffnen
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workflows/new">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Workflow erstellen
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Leads gesamt"
          value={counts.leads}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Offene Tasks"
          value={counts.openTasks}
          icon={<ListTodo className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Aktive Workflows"
          value={counts.activeWorkflows}
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fällige Tasks</CardTitle>
              <p className="text-sm text-muted-foreground">
                Deine nächsten Follow-Ups
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tasks">Alle Tasks</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length ? (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      fällig{" "}
                      {formatDistanceToNow(new Date(task.dueAt), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/leads/${task.leadId ?? ""}`}>Zum Lead</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Keine offenen Tasks.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Neue Leads</CardTitle>
              <p className="text-sm text-muted-foreground">
                Zuletzt ins System gekommen
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/leads">Alle Leads</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.length ? (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.status} •{" "}
                      {formatDistanceToNow(new Date(lead.createdAt), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/leads/${lead.id}`}>Details</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Noch keine Leads vorhanden.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
