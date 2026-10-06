export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  OFFER_SENT = "OFFER_SENT",
  WON = "WON",
  LOST = "LOST",
}

export enum LeadSource {
  MANUAL = "MANUAL",
  META = "META",
  WEBFORM = "WEBFORM",
}

export enum TaskCategory {
  FOLLOW_UP = "FOLLOW_UP",
  GENERAL = "GENERAL",
  SYSTEM = "SYSTEM",
}

export enum TaskType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  OTHER = "OTHER",
}

export enum TaskStatus {
  OPEN = "OPEN",
  DONE = "DONE",
}

export enum WorkflowTriggerEvent {
  LEAD_CREATED = "LEAD_CREATED",
}

export enum WorkflowStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum WorkflowActionType {
  CREATE_TASK = "CREATE_TASK",
  SEND_EMAIL = "SEND_EMAIL",
  WAIT = "WAIT",
}

export enum CommunicationChannel {
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
}

export enum CommunicationStatus {
  SENT = "SENT",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export enum WorkflowEnrollmentStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  SALES_MANAGER = "SALES_MANAGER",
  SALES_REP = "SALES_REP",
}

