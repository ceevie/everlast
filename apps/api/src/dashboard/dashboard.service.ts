import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DashboardStatsDTO } from '@everlast/types';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string): Promise<DashboardStatsDTO> {
    const [
      leadsCount,
      openTasksCount,
      activeWorkflowsCount,
      upcomingTasks,
      recentLeads,
    ] = await Promise.all([
      // 1. Leads zählen
      this.prisma.lead.count({ where: { tenantId } }),

      // 2. Offene Tasks zählen
      this.prisma.task.count({ where: { tenantId, status: 'OPEN' } }),

      // 3. Aktive Workflows zählen
      this.prisma.workflow.count({ where: { tenantId, status: 'ACTIVE' } }),

      // 4. Fällige Tasks (Top 5, bald fällig zuerst)
      this.prisma.task.findMany({
        where: { tenantId, status: 'OPEN' },
        orderBy: { dueAt: 'asc' },
        take: 5,
        include: { lead: true }, // Damit wir "Zum Lead" anzeigen können
      }),

      // 5. Neue Leads (Top 5, neueste zuerst)
      this.prisma.lead.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      counts: {
        leads: leadsCount,
        openTasks: openTasksCount,
        activeWorkflows: activeWorkflowsCount,
      },
      upcomingTasks: upcomingTasks as any, // Casten wegen Date vs String Problematik
      recentLeads: recentLeads as any,
    };
  }
}
