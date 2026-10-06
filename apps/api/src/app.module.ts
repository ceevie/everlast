import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { LeadsModule } from './leads/leads.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SequenceModule } from './sequence/sequence.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LeadsModule,
    TasksModule,
    WorkflowsModule,
    DashboardModule,
    WebhooksModule,
    SequenceModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
