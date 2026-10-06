import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowExecutorService } from './workflow-executor.service';
import { PrismaService } from '../prisma.service';
import { SequenceModule } from '../sequence/sequence.module';

@Module({
  imports: [SequenceModule],
  controllers: [WorkflowsController],
  providers: [
    WorkflowsService,
    WorkflowExecutorService,
    PrismaService
  ],
})
export class WorkflowsModule {}
