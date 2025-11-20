export class LeadCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly leadId: string,
    public readonly email?: string,
  ) {}
}

