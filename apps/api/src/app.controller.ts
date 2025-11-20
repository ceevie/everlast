import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { TenantGuard } from './common/guards/tenant.guard';
import { TenantId } from './common/decorators/tenant.decorator';
//import { User } from '@everlast/prisma';

@Controller()
@UseGuards(TenantGuard)

export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(@TenantId() tenantId: string): string {
    return `API is running for Tenant: ${tenantId} - HOT RELOAD TEST`;
  }
}
