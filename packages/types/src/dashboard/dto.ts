// Importiere deine existierenden Typen (aus den anderen DTOs oder Types)
import { Task } from '../tasks/types';
import { Lead } from '../leads/types';

export interface DashboardStatsDTO {
  counts: {
    leads: number;
    openTasks: number;
    activeWorkflows: number;
  };
  upcomingTasks: Task[]; // Die 5 dringendsten
  recentLeads: Lead[];   // Die 5 neuesten
}
