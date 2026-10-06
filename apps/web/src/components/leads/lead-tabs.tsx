"use client";

import { cn } from "@/lib/utils";

export type LeadTabId = "crm" | "automations" | "activity";

const TABS: { id: LeadTabId; label: string }[] = [
  { id: "crm", label: "CRM" },
  { id: "automations", label: "Automatisierungen" },
  { id: "activity", label: "Aktivitäten" },
];

type LeadTabsProps = {
  value: LeadTabId;
  onChange: (tab: LeadTabId) => void;
};

export function LeadTabs({ value, onChange }: LeadTabsProps) {
  return (
    <div className="border-b">
      <nav className="-mb-px flex gap-6" aria-label="Lead-Bereiche">
        {TABS.map((tab) => {
          const active = tab.id === value;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "border-b-2 px-0.5 pb-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
