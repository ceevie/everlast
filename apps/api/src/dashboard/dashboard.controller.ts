import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { DashboardStatsDTO } from '@everlast/types';

@Controller('dashboard')
@UseGuards(TenantGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStats(@TenantId() tenantId: string): Promise<DashboardStatsDTO> {
    return this.dashboardService.getStats(tenantId);
  }
}
