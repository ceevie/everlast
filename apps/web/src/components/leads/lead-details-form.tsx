"use client";

import { Lead } from "@everlast/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateLeadDetails } from "@/hooks/use-update-lead-details";

const schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type LeadDetailsFormProps = {
  lead: Lead;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type LeadDetailsFormValues = z.infer<typeof schema>;

export function LeadDetailsForm({ lead, onSuccess, onCancel }: LeadDetailsFormProps) {
  const mutation = useUpdateLeadDetails();
  const form = useForm<LeadDetailsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: lead.email ?? "",
      phone: lead.phone ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      leadId: lead.id,
      email: values.email || undefined,
      phone: values.phone || undefined,
    });
    onSuccess?.();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <p className="text-muted-foreground">Email</p>
        <Input
          type="email"
          placeholder="name@example.com"
          {...form.register("email")}
        />
      </div>
      <div>
        <p className="text-muted-foreground">Telefon</p>
        <Input placeholder="+49 ..." {...form.register("phone")} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Speichern..." : "Änderungen speichern"}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              form.reset();
              onCancel();
            }}
          >
            Abbrechen
          </Button>
        ) : null}
      </div>
    </form>
  );
}

