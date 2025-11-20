"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  TaskCategory,
  TaskType,
  WorkflowActionType,
  WorkflowStepConfig,
  WorkflowTriggerEvent,
} from "@everlast/types";
import { Bolt, ListTodo } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateWorkflow } from "@/hooks/use-workflows";

const DEFAULT_STEP: WorkflowStepConfig = {
  title: "Kunde anrufen",
  category: TaskCategory.FOLLOW_UP,
  type: TaskType.CALL,
  dueInHours: 24,
};

const triggerOptions = [
  {
    value: WorkflowTriggerEvent.LEAD_CREATED,
    label: "Lead event",
    description: "Workflow startet, wenn ein Lead erstellt wird.",
  },
];

const stepActions = [
  {
    value: WorkflowActionType.CREATE_TASK,
    label: "Create Task",
    description: "Automatisch einen Follow-Up Task planen.",
    icon: ListTodo,
  },
];

type SidebarContext =
  | { type: "trigger" }
  | { type: "step"; index: number };

export default function NewWorkflowPage() {
  const router = useRouter();
  const { mutateAsync: createWorkflow, isPending } = useCreateWorkflow();

  const [name, setName] = useState("New Workflow");
  const [description, setDescription] = useState("Automatisiere Follow-Ups");
  const [trigger, setTrigger] = useState<WorkflowTriggerEvent | null>(null);
  const [steps, setSteps] = useState<WorkflowStepConfig[]>([]);
  const [sidebar, setSidebar] = useState<SidebarContext>({ type: "trigger" });
  const [showStepMenu, setShowStepMenu] = useState(false);

  const activeStep = useMemo(() => {
    if (sidebar.type === "step") {
      return steps[sidebar.index];
    }
    return null;
  }, [sidebar, steps]);

  const addStep = () => {
    if (!trigger) {
      toast.error("Bitte zuerst einen Trigger wählen.");
      setSidebar({ type: "trigger" });
      setShowStepMenu(false);
      return;
    }
    const newStep = { ...DEFAULT_STEP };
    setSteps((prev) => [...prev, newStep]);
    setSidebar({ type: "step", index: steps.length });
    setShowStepMenu(false);
  };

  const updateStep = (index: number, patch: Partial<WorkflowStepConfig>) => {
    setSteps((prev) =>
      prev.map((step, idx) => (idx === index ? { ...step, ...patch } : step)),
    );
  };

  const handleSave = async () => {
    if (!trigger) {
      toast.error("Bitte wähle einen Trigger aus.");
      setSidebar({ type: "trigger" });
      return;
    }
    if (!steps.length) {
      toast.error("Füge mindestens einen Step hinzu.");
      return;
    }
    await createWorkflow({
      name,
      description,
      triggerEvent: trigger,
      steps,
    });
    toast.success("Workflow gespeichert");
    router.push("/workflows");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={name || "Neuer Workflow"}
        description="Baue einen automatisierten Follow-Up Ablauf."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="flex-1 space-y-6 rounded-2xl border bg-muted/20 p-6">
          <div className="max-w-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase text-muted-foreground">
                Workflow name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase text-muted-foreground">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-6">
            <TriggerCard
              label={
                trigger
                  ? triggerOptions.find((option) => option.value === trigger)?.label ??
                    "Select a trigger"
                  : "Select a trigger"
              }
              onClick={() => setSidebar({ type: "trigger" })}
            />

            <div className="h-6 w-px bg-border" />

            {steps.map((step, index) => (
              <div key={`step-${index}`} className="flex flex-col items-center gap-3">
                <StepCard
                  step={step}
                  isActive={sidebar.type === "step" && sidebar.index === index}
                  onClick={() => setSidebar({ type: "step", index })}
                />
                {index < steps.length - 1 && <div className="h-6 w-px bg-border" />}
              </div>
            ))}

            <div className="relative">
              <Button
                variant="ghost"
                className="rounded-full border px-6 py-2 shadow-sm"
                onClick={() => setShowStepMenu((prev) => !prev)}
              >
                + Add Step
              </Button>
              {showStepMenu && (
                <div className="absolute left-1/2 z-10 mt-2 w-64 -translate-x-1/2 rounded-2xl border bg-background p-2 shadow-lg">
                  {stepActions.map((action) => (
                    <button
                      key={action.value}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted"
                      onClick={addStep}
                    >
                      <span className="mt-1 rounded-full bg-muted p-1">
                        <action.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="w-full rounded-2xl border bg-card p-5 lg:w-[320px]">
          {sidebar.type === "trigger" ? (
            <TriggerSidebar
              trigger={trigger}
              onSelect={(value) => {
                setTrigger(value);
                setSidebar({ type: "trigger" });
              }}
            />
          ) : activeStep ? (
            <StepSidebar
              step={activeStep}
              onChange={(patch) => updateStep(sidebar.index, patch)}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Wähle einen Step aus, um Details zu bearbeiten.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function TriggerCard({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full max-w-3xl rounded-2xl border bg-background/70 p-4 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-primary/10 p-3 text-primary">
          <Bolt className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase text-muted-foreground">Trigger</p>
          <p className="text-lg font-semibold text-foreground">{label}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Wähle einen Trigger, um den Workflow zu starten.
      </p>
    </button>
  );
}

function StepCard({
  step,
  isActive,
  onClick,
}: {
  step: WorkflowStepConfig;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full max-w-3xl rounded-2xl border bg-background/70 p-4 text-left shadow-sm transition hover:shadow-md ${isActive ? "border-primary shadow-md" : "border-muted"}`}
    >
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-muted p-3 text-muted-foreground">
          <ListTodo className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{step.title}</p>
          <p className="text-xs text-muted-foreground">
            {step.type} • due in {step.dueInHours ?? 0}h
          </p>
        </div>
      </div>
    </button>
  );
}

function TriggerSidebar({
  trigger,
  onSelect,
}: {
  trigger: WorkflowTriggerEvent | null;
  onSelect: (value: WorkflowTriggerEvent) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select trigger</h3>
      <p className="text-sm text-muted-foreground">
        Wähle den Auslöser für diesen Workflow.
      </p>
      <div className="space-y-2">
        {triggerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full rounded-lg border px-3 py-2 text-left ${trigger === option.value ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
          >
            <p className="font-medium">{option.label}</p>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSidebar({
  step,
  onChange,
}: {
  step: WorkflowStepConfig;
  onChange: (patch: Partial<WorkflowStepConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create Task konfigurieren</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Titel
        </label>
        <Input
          value={step.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Kategorie
        </label>
        <Select
          value={step.category ?? TaskCategory.FOLLOW_UP}
          onValueChange={(value) => onChange({ category: value as TaskCategory })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Task Typ
        </label>
        <Select
          value={step.type ?? TaskType.CALL}
          onValueChange={(value) => onChange({ type: value as TaskType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Fällig in (Stunden)
        </label>
        <Input
          type="number"
          value={step.dueInHours ?? 24}
          onChange={(e) =>
            onChange({ dueInHours: Number(e.target.value) || 0 })
          }
        />
      </div>
    </div>
  );
}


