import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "../prisma.service";
import { CreateLeadDTO } from "@everlast/types";
import { LeadCreatedEvent } from "./events/lead-created.event";

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Alle Leads eines Tenants holen
  async findAll(tenantId: string) {
    return this.prisma.lead.findMany({
      where: {
        tenantId, // Automatische Filterung!
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Einen Lead erstellen
  async create(tenantId: string, data: Omit<CreateLeadDTO, "tenantId">) {
    const lead = await this.prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ownerId: data.ownerId,
        tenantId, // Wir erzwingen die TenantId aus dem Token/Header
      },
    });

    // 🔥 Event feuern (Asynchron, blockiert nicht)
    this.eventEmitter.emit(
      'lead.created',
      new LeadCreatedEvent(tenantId, lead.id, lead.email || undefined)
    );

    return lead;
  }

  // Einen einzelnen Lead holen (Sicherheitscheck!)
  async findOne(tenantId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: {
        id,
        tenantId, // WICHTIG: Sicherstellen, dass er zum Tenant gehört
      },
    });
  }

  // Lead updaten
  async update(tenantId: string, id: string, data: any) { // Wir nutzen erstmal any oder Partial<CreateLeadDTO>
    // Erst prüfen ob er existiert/gehört
    const existing = await this.findOne(tenantId, id);
    
    if (!existing) {
      // Wenn null zurückkommt, weiß der Controller: 404
      return null;
    }

    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }
  
}
