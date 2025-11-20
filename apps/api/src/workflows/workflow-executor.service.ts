import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service';
import { LeadCreatedEvent } from '../leads/events/lead-created.event';
import {
  WorkflowStatus,
  WorkflowTriggerEvent,
  WorkflowActionType,
  TaskCategory,
  TaskType,
} from '@everlast/prisma';

@Injectable()
export class WorkflowExecutorService {
  private readonly logger = new Logger(WorkflowExecutorService.name);

  constructor(private prisma: PrismaService) {}

  // Lauscht auf 'lead.created'
  @OnEvent('lead.created', { async: true }) // async: true = läuft im Hintergrund
  async handleLeadCreated(event: LeadCreatedEvent) {
    this.logger.log(`Processing workflows for new lead: ${event.leadId}`);

    // 1. Relevante Workflows finden
    const workflows = await this.prisma.workflow.findMany({
      where: {
        tenantId: event.tenantId,
        status: WorkflowStatus.ACTIVE,
        triggerEvent: WorkflowTriggerEvent.LEAD_CREATED,
      },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    // 2. Workflows ausführen
    for (const workflow of workflows) {
      this.logger.log(`Executing Workflow "${workflow.name}" (${workflow.id})`);
      
      for (const step of workflow.steps) {
        try {
          if (step.actionType === WorkflowActionType.CREATE_TASK) {
            await this.createTask(step, event);
          }
        } catch (error) {
          this.logger.error(
            `Error in workflow ${workflow.id} step ${step.id}`,
            error instanceof Error ? error.stack : String(error)
          );
        }
      }
    }
  }

  private async createTask(step: any, event: LeadCreatedEvent) {
    const config = step.config as any || {};
    const dueInHours = config.dueInHours ?? 24;
    
    await this.prisma.task.create({
      data: {
        tenantId: event.tenantId,
        leadId: event.leadId,
        title: config.title ?? 'Follow-Up Task',
        category: config.category ?? TaskCategory.FOLLOW_UP,
        type: config.type ?? TaskType.CALL,
        dueAt: new Date(Date.now() + dueInHours * 60 * 60 * 1000),
        status: 'OPEN',
      },
    });
  }
}

