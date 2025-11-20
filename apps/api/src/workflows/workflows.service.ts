import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateWorkflowDTO, WorkflowResponseDTO } from "@everlast/types";

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  // Alle Workflows holen (inklusive Steps!)
  async findAll(tenantId: string): Promise<WorkflowResponseDTO[]> {
    const workflows = this.prisma.workflow.findMany({
      where: { tenantId },
      include: {
        steps: {
          orderBy: { order: "asc" }, // Steps immer in richtiger Reihenfolge
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return workflows as unknown as WorkflowResponseDTO[];
  }

  // Workflow erstellen (Nested Write)
  async create(
    tenantId: string,
    dto: CreateWorkflowDTO
  ): Promise<WorkflowResponseDTO> {
    // dto sollte CreateWorkflowDTO sein
    // Wir extrahieren 'steps' aus dem DTO, falls vorhanden
    const { steps, ...workflowData } = dto as any;

    const workflow = this.prisma.workflow.create({
      data: {
        ...workflowData,
        tenantId,
        // Hier ist der Magic Part: Wir erstellen die Steps direkt mit
        steps: {
          create:
            steps?.map((step: any, index: number) => ({
              order: step.order ?? index + 1, // Falls Order nicht kommt, durchnummerieren
              actionType: step.actionType ?? 'CREATE_TASK',
              config: step.config ?? step,
            })) || [],
        },
      },
      include: {
        steps: true, // Damit wir das Ergebnis inkl. Steps zurückbekommen
      },
    });

    return workflow as unknown as WorkflowResponseDTO;
  }

  // Einzelnen Workflow holen
  async findOne(
    tenantId: string,
    id: string
  ): Promise<WorkflowResponseDTO | null> {
    const workflow = this.prisma.workflow.findFirst({
      where: { id, tenantId },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    return workflow as unknown as WorkflowResponseDTO | null;
  }

  // DELETE: Workflow komplett löschen
  async delete(tenantId: string, id: string): Promise<any> {
    // 1. Existiert er?
    const existing = await this.findOne(tenantId, id);
    if (!existing) return null;

    // 2. Löschen (Steps werden dank Prisma Cascade automatisch mitgelöscht,
    //    wenn im Schema "onDelete: Cascade" steht. Falls nicht, müssen wir Steps erst löschen).
    //    Wir gehen davon aus, dass du Steps erst manuell löschen musst oder Prisma das regelt.
    //    Sicherer Weg: Erst Steps löschen.

    return this.prisma.$transaction([
      this.prisma.workflowStep.deleteMany({ where: { workflowId: id } }),
      this.prisma.workflow.delete({ where: { id } }),
    ]);
  }

  // PATCH: Nur Status/Name ändern (Steps bleiben unberührt)
  async updateStatus(
    tenantId: string,
    id: string,
    data: Partial<CreateWorkflowDTO>
  ): Promise<WorkflowResponseDTO | null> {
    // Security Check
    const existing = await this.findOne(tenantId, id);
    if (!existing) return null;

    // Wir ignorieren 'steps' hier explizit, falls sie versehentlich mitkommen
    const { steps, ...updateData } = data as any;

    const updated = await this.prisma.workflow.update({
      where: { id },
      data: updateData,
      include: { steps: { orderBy: { order: "asc" } } },
    });

    return updated as unknown as WorkflowResponseDTO;
  }

  // PUT: Alles ersetzen (Steps austauschen)
  async replace(tenantId: string, id: string, dto: CreateWorkflowDTO): Promise<WorkflowResponseDTO | null> {
    const existing = await this.findOne(tenantId, id);
    if (!existing) return null;

    const { steps, ...workflowData } = dto as any;

    // Transaktion: Alte Steps weg, Workflow updaten, neue Steps rein
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Alte Steps löschen
      await tx.workflowStep.deleteMany({
        where: { workflowId: id },
      });

      // 2. Workflow Basisdaten updaten & Neue Steps anlegen
      return tx.workflow.update({
        where: { id },
        data: {
          ...workflowData,
          steps: {
            create:
              steps?.map((step: any, index: number) => ({
                order: step.order ?? index + 1,
                actionType: step.actionType ?? 'CREATE_TASK',
                config: step.config ?? step,
              })) || [],
          },
        },
        include: { steps: { orderBy: { order: "asc" } } },
      });
    });

    return result as unknown as WorkflowResponseDTO;
  }
}
