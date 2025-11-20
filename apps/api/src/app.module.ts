import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { LeadsModule } from './leads/leads.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LeadsModule,
    TasksModule,
    WorkflowsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
