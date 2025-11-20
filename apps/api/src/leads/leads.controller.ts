import { Controller, Get, Post, Body, UseGuards, Patch, Param, NotFoundException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { CreateLeadDTO } from '@everlast/types';

@Controller('leads')
@UseGuards(TenantGuard) // Ganzer Controller geschützt
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.leadsService.findAll(tenantId);
  }

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createLeadDto: Omit<CreateLeadDTO, 'tenantId'> // Wir erwarten im Body keine TenantID, die kommt aus dem Header!
  ) {
    return this.leadsService.create(tenantId, createLeadDto);
  }
  
  @Get(':id')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
      const lead = await this.leadsService.findOne(tenantId, id);
      if (!lead) throw new NotFoundException('Lead not found');
      return lead;
  }

  @Patch(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any // Hier sollten wir später ein UpdateLeadDTO nutzen
  ) {
    const updated = await this.leadsService.update(tenantId, id, data);
    if (!updated) throw new NotFoundException('Lead not found');
    return updated;
  }
}
