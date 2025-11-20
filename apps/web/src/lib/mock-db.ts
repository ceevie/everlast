import {
  CompleteTaskDTO,
  CreateLeadDTO,
  CreateTaskDTO,
  CreateWorkflowDTO,
  Lead,
  LeadStatus,
  Task,
  TaskCategory,
  TaskStatus,
  TaskType,
  Workflow,
  WorkflowActionType,
  WorkflowStatus,
  WorkflowTriggerEvent,
} from "@everlast/types";

type MockDB = {
  tenantId: string;
  leads: Lead[];
  tasks: Task[];
  workflows: Workflow[];
};

const now = Date.now();

const leadSeeds = [
  {
    id: "lead_max",
    name: "Max Mustermann",
    email: "max@example.com",
    phone: "+49 151 1234567",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_lina",
    name: "Lina Becker",
    email: "lina@acme.de",
    phone: "+49 171 9876543",
    status: LeadStatus.CONTACTED,
  },
  {
    id: "lead_anna",
    name: "Anna Schulz",
    email: "anna@vision.de",
    phone: "+49 152 9871234",
    status: LeadStatus.QUALIFIED,
  },
  {
    id: "lead_paul",
    name: "Paul König",
    email: "paul@konzept.de",
    phone: "+49 160 5554444",
    status: LeadStatus.OFFER_SENT,
  },
  {
    id: "lead_lars",
    name: "Lars Meier",
    email: "lars@meier-consulting.de",
    phone: "+49 151 8887777",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_ronja",
    name: "Ronja Kramer",
    email: "ronja@future.io",
    phone: "+49 170 2233445",
    status: LeadStatus.CONTACTED,
  },
  {
    id: "lead_niklas",
    name: "Niklas Hoffmann",
    email: "niklas@hoffmann.de",
    phone: "+49 176 4433221",
    status: LeadStatus.QUALIFIED,
  },
  {
    id: "lead_jana",
    name: "Jana Fritz",
    email: "jana@fit-solutions.de",
    phone: "+49 153 1122334",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_mario",
    name: "Mario Krause",
    email: "mario@krause-haus.de",
    phone: "+49 159 6655443",
    status: LeadStatus.CONTACTED,
  },
  {
    id: "lead_laura",
    name: "Laura Peters",
    email: "laura@scaleup.de",
    phone: "+49 172 7788991",
    status: LeadStatus.OFFER_SENT,
  },
  {
    id: "lead_ben",
    name: "Ben Richter",
    email: "ben@richter.dev",
    phone: "+49 151 8889911",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_elena",
    name: "Elena Vogt",
    email: "elena@vogt-group.de",
    phone: "+49 173 4455662",
    status: LeadStatus.CONTACTED,
  },
  {
    id: "lead_sam",
    name: "Sam Wolf",
    email: "sam@wolf-tech.de",
    phone: "+49 160 2345678",
    status: LeadStatus.WON,
  },
  {
    id: "lead_tom",
    name: "Tom Berger",
    email: "tom@berger.io",
    phone: "+49 175 5544332",
    status: LeadStatus.LOST,
  },
  {
    id: "lead_amelie",
    name: "Amelie Stein",
    email: "amelie@stein-media.de",
    phone: "+49 151 9090909",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_carl",
    name: "Carl Niemann",
    email: "carl@niemann.de",
    phone: "+49 152 6767676",
    status: LeadStatus.CONTACTED,
  },
  {
    id: "lead_sophia",
    name: "Sophia Brandt",
    email: "sophia@brandtagentur.de",
    phone: "+49 174 5656565",
    status: LeadStatus.QUALIFIED,
  },
  {
    id: "lead_kai",
    name: "Kai Lehmann",
    email: "kai@lehmann-build.de",
    phone: "+49 171 3434343",
    status: LeadStatus.OFFER_SENT,
  },
  {
    id: "lead_julia",
    name: "Julia Krüger",
    email: "julia@krueger.io",
    phone: "+49 157 2121212",
    status: LeadStatus.NEW,
  },
  {
    id: "lead_oliver",
    name: "Oliver Weiss",
    email: "oliver@weiss-consult.de",
    phone: "+49 176 9098989",
    status: LeadStatus.CONTACTED,
  },
];

const leads = leadSeeds.map((seed, index) => ({
  id: seed.id,
  tenantId: "tenant-demo-1",
  ownerId: null,
  name: seed.name,
  email: seed.email,
  phone: seed.phone,
  status: seed.status,
  lastActivityAt:
    index % 3 === 0 ? new Date(now - 1000 * 60 * 60 * (index + 3)).toISOString() : null,
  createdAt: new Date(now - 1000 * 60 * 60 * 6 * (index + 1)).toISOString(),
  updatedAt: new Date(now - 1000 * 60 * 60 * (index + 2)).toISOString(),
}));

const baseTasks = leads.slice(0, 20).map((lead, idx) => ({
  id: `task_${lead.id}_${idx}`,
  tenantId: "tenant-demo-1",
  leadId: lead.id,
  assignedToUserId: null,
  title:
    idx % 2 === 0
      ? `Follow-Up mit ${lead.name}`
      : `Angebot nachfassen – ${lead.name}`,
  category: TaskCategory.FOLLOW_UP,
  type: idx % 3 === 0 ? TaskType.EMAIL : TaskType.CALL,
  status: idx % 5 === 0 ? TaskStatus.DONE : TaskStatus.OPEN,
  dueAt: new Date(now + 1000 * 60 * 60 * (idx + 6)).toISOString(),
  createdAt: new Date(now - 1000 * 60 * 60 * (idx + 1)).toISOString(),
  completedAt:
    idx % 5 === 0 ? new Date(now - 1000 * 60 * 30 * (idx + 1)).toISOString() : null,
}));

const extraTaskTemplates = [
  {
    title: "Demo für Vision GmbH vorbereiten",
    category: TaskCategory.GENERAL,
    type: TaskType.MEETING,
    status: TaskStatus.OPEN,
    dueOffsetHours: 5,
  },
  {
    title: "Check-in nach Workshop",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.EMAIL,
    status: TaskStatus.OPEN,
    dueOffsetHours: 18,
  },
  {
    title: "Onboarding-Unterlagen senden",
    category: TaskCategory.SYSTEM,
    type: TaskType.EMAIL,
    status: TaskStatus.DONE,
    dueOffsetHours: -2,
  },
  {
    title: "CRM-Daten bereinigen",
    category: TaskCategory.GENERAL,
    type: TaskType.OTHER,
    status: TaskStatus.OPEN,
    dueOffsetHours: 30,
  },
  {
    title: "Vertragsentwurf prüfen",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.MEETING,
    status: TaskStatus.OPEN,
    dueOffsetHours: 12,
  },
  {
    title: "Finanzfreigabe einholen",
    category: TaskCategory.GENERAL,
    type: TaskType.OTHER,
    status: TaskStatus.DONE,
    dueOffsetHours: -24,
  },
  {
    title: "Q&A Call planen",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.CALL,
    status: TaskStatus.OPEN,
    dueOffsetHours: 6,
  },
  {
    title: "Angebotsvergleich senden",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.EMAIL,
    status: TaskStatus.OPEN,
    dueOffsetHours: 15,
  },
  {
    title: "Kampagnenidee nachreichen",
    category: TaskCategory.GENERAL,
    type: TaskType.EMAIL,
    status: TaskStatus.OPEN,
    dueOffsetHours: 48,
  },
  {
    title: "Use-Case Referenzen versenden",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.EMAIL,
    status: TaskStatus.DONE,
    dueOffsetHours: -12,
  },
  {
    title: "Success Story vorbereiten",
    category: TaskCategory.GENERAL,
    type: TaskType.OTHER,
    status: TaskStatus.OPEN,
    dueOffsetHours: 72,
  },
  {
    title: "Pilotfeedback einholen",
    category: TaskCategory.FOLLOW_UP,
    type: TaskType.CALL,
    status: TaskStatus.OPEN,
    dueOffsetHours: 24,
  },
  {
    title: "NDA gegenzeichnen",
    category: TaskCategory.GENERAL,
    type: TaskType.OTHER,
    status: TaskStatus.DONE,
    dueOffsetHours: -8,
  },
  {
    title: "Workshop-Agenda finalisieren",
    category: TaskCategory.GENERAL,
    type: TaskType.MEETING,
    status: TaskStatus.OPEN,
    dueOffsetHours: 10,
  },
  {
    title: "Kundenzugang testen",
    category: TaskCategory.SYSTEM,
    type: TaskType.OTHER,
    status: TaskStatus.OPEN,
    dueOffsetHours: 20,
  },
];

const extraTasks = extraTaskTemplates.map((template, idx) => {
  const relatedLead = leads[(idx + 5) % leads.length];
  const dueAt = new Date(now + template.dueOffsetHours * 60 * 60 * 1000).toISOString();
  const createdAt = new Date(now - 1000 * 60 * 60 * (idx + 2)).toISOString();
  const completedAt =
    template.status === TaskStatus.DONE
      ? new Date(now - 1000 * 60 * 60 * (idx + 1)).toISOString()
      : null;

  return {
    id: `task_extra_${idx + 1}`,
    tenantId: relatedLead?.tenantId ?? "tenant-demo-1",
    leadId: relatedLead?.id ?? null,
    assignedToUserId: null,
    title: template.title,
    category: template.category,
    type: template.type,
    status: template.status,
    dueAt,
    createdAt,
    completedAt,
  };
});

const tasks = [...baseTasks, ...extraTasks];

export const mockDb: MockDB = {
  tenantId: "tenant-demo-1",
  leads,
  tasks,
  workflows: [
    {
      id: "workflow_auto_followup",
      tenantId: "tenant-demo-1",
      name: "Lead Follow-Up",
      description: "Erstellt einen Task 24h nach Lead-Erstellung",
      triggerEvent: WorkflowTriggerEvent.LEAD_CREATED,
      status: WorkflowStatus.ACTIVE,
      conditions: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      steps: [
        {
          id: "workflow_step_call_24h",
          workflowId: "workflow_auto_followup",
          order: 1,
          actionType: WorkflowActionType.CREATE_TASK,
          config: {
            title: "Kunden anrufen",
            category: TaskCategory.FOLLOW_UP,
            type: TaskType.CALL,
            dueInHours: 24,
          },
          createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
      ],
    },
  ],
};

export function simulateDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function addLead(payload: CreateLeadDTO): Lead {
  const lead: Lead = {
    id: generateId("lead"),
    tenantId: payload.tenantId,
    ownerId: payload.ownerId ?? null,
    name: payload.name,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    status: LeadStatus.NEW,
    lastActivityAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockDb.leads.unshift(lead);
  return lead;
}

export function updateLeadStatus(
  tenantId: string,
  leadId: string,
  status: LeadStatus,
): Lead | undefined {
  const lead = mockDb.leads.find(
    (item) => item.id === leadId && item.tenantId === tenantId,
  );
  if (!lead) return undefined;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export function updateLeadDetails(
  tenantId: string,
  leadId: string,
  data: { email?: string | null; phone?: string | null; name?: string },
): Lead | undefined {
  const lead = mockDb.leads.find(
    (item) => item.id === leadId && item.tenantId === tenantId,
  );
  if (!lead) return undefined;
  if (typeof data.email !== "undefined") lead.email = data.email;
  if (typeof data.phone !== "undefined") lead.phone = data.phone;
  if (typeof data.name !== "undefined") lead.name = data.name;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export function addTask(payload: CreateTaskDTO): Task {
  const task: Task = {
    id: generateId("task"),
    tenantId: payload.tenantId,
    leadId: payload.leadId ?? null,
    assignedToUserId: payload.assignedToUserId ?? null,
    title: payload.title,
    category: payload.category ?? TaskCategory.FOLLOW_UP,
    type: payload.type ?? TaskType.CALL,
    status: TaskStatus.OPEN,
    dueAt: payload.dueAt,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  mockDb.tasks.unshift(task);
  return task;
}

export function completeTask(payload: CompleteTaskDTO): Task | undefined {
  const task = mockDb.tasks.find(
    (t) => t.id === payload.taskId && t.tenantId === payload.tenantId,
  );
  if (!task) return undefined;
  task.status = TaskStatus.DONE;
  task.completedAt = new Date().toISOString();
  return task;
}

export function reopenTaskDb(payload: CompleteTaskDTO): Task | undefined {
  const task = mockDb.tasks.find(
    (t) => t.id === payload.taskId && t.tenantId === payload.tenantId,
  );
  if (!task) return undefined;
  task.status = TaskStatus.OPEN;
  task.completedAt = null;
  return task;
}

export function addWorkflow(payload: CreateWorkflowDTO): Workflow {
  const workflow: Workflow = {
    id: generateId("workflow"),
    tenantId: payload.tenantId,
    name: payload.name,
    description: payload.description ?? null,
    triggerEvent: payload.triggerEvent,
    status: payload.status ?? WorkflowStatus.ACTIVE,
    conditions: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: payload.steps.map((step, idx) => ({
      id: generateId("workflow_step"),
      workflowId: "",
      order: idx + 1,
      actionType: WorkflowActionType.CREATE_TASK,
      config: step,
      createdAt: new Date().toISOString(),
    })),
  };
  workflow.steps = workflow.steps.map((step) => ({
    ...step,
    workflowId: workflow.id,
  }));
  mockDb.workflows.unshift(workflow);
  return workflow;
}

export function workflowEngineHandleLeadCreated(lead: Lead) {
  const workflows = mockDb.workflows.filter(
    (wf) =>
      wf.tenantId === lead.tenantId &&
      wf.status === WorkflowStatus.ACTIVE &&
      wf.triggerEvent === WorkflowTriggerEvent.LEAD_CREATED,
  );
  workflows.forEach((workflow) => {
    workflow.steps
      .filter(
        (step) => step.actionType === WorkflowActionType.CREATE_TASK && step.config,
      )
      .forEach((step) => {
        const dueInHours = step.config?.dueInHours ?? 24;
        addTask({
          tenantId: lead.tenantId,
          leadId: lead.id,
          title: step.config?.title ?? "Follow-Up",
          category: step.config?.category ?? TaskCategory.FOLLOW_UP,
          type: step.config?.type ?? TaskType.CALL,
          dueAt: new Date(Date.now() + dueInHours * 60 * 60 * 1000).toISOString(),
        });
      });
  });
}

