import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDTO } from '@everlast/types';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Find All (Optional gefiltert nach Lead)
  async findAll(tenantId: string, leadId?: string) {
    const whereClause: any = { tenantId };

    // Wenn leadId existiert, fügen wir es zum Filter hinzu
    if (leadId) {
      whereClause.leadId = leadId;
    }

    return this.prisma.task.findMany({
      where: whereClause,
      orderBy: {
        dueAt: 'asc', // Nächste Tasks zuerst
      },
      include: {
        lead: true, // Wir laden die Lead-Infos direkt mit (optional)
      },
    });
  }

  async create(tenantId: string, data: any) { // Nutze Omit<CreateTaskDTO, 'tenantId'> wenn möglich
    return this.prisma.task.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    // Erst prüfen ob Task zum Tenant gehört
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
    });

    if (!task) return null;

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }
}
