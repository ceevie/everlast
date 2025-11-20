"use client";

import { LeadStatus } from "@everlast/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateLeadStatus } from "@/hooks/use-update-lead-status";
import { StatusBadge } from "@/components/status-badge";

const options = Object.values(LeadStatus);

type LeadStatusSelectProps = {
  leadId: string;
  value: LeadStatus;
};

export function LeadStatusSelect({ leadId, value }: LeadStatusSelectProps) {
  const mutation = useUpdateLeadStatus();

  const handleChange = (status: LeadStatus) => {
    mutation.mutate({ leadId, status });
  };

  return (
    <Select value={value} onValueChange={(val) => handleChange(val as LeadStatus)}>
      <SelectTrigger className="w-fit items-center gap-2 border-none bg-transparent p-0 focus:ring-0">
        <SelectValue>
          <StatusBadge variant="lead" status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-48">
        {options.map((status) => (
          <SelectItem key={status} value={status}>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {status.replace("_", " ")}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

