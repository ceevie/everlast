"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskCategory, TaskType } from "@everlast/types";
import { useCreateTask } from "@/hooks/use-tasks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(2, "Titel ist erforderlich"),
  type: z.nativeEnum(TaskType),
  dueAt: z.string().min(1, "Fälligkeitsdatum ist erforderlich"),
});

const DEFAULT_DUE_AT = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);

type LeadTaskFormProps = {
  leadId: string;
  trigger: React.ReactNode;
};

type LeadTaskFormValues = z.infer<typeof schema>;

export function LeadTaskForm({ leadId, trigger }: LeadTaskFormProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<LeadTaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      type: TaskType.CALL,
      dueAt: DEFAULT_DUE_AT,
    },
  });
  const createTask = useCreateTask();

  const onSubmit = form.handleSubmit(async (values) => {
    await createTask.mutateAsync({
      leadId,
      title: values.title,
      type: values.type,
      category: TaskCategory.FOLLOW_UP,
      dueAt: new Date(values.dueAt).toISOString(),
    });
    toast.success("Task erstellt");
    form.reset({ title: "", type: TaskType.CALL, dueAt: DEFAULT_DUE_AT });
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{trigger}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Follow-Up Task erstellen</DialogTitle>
          <DialogDescription>Plane den nächsten Schritt für diesen Lead.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input placeholder="Kunde anrufen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Typ auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TaskType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fällig am</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

