import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { InngestController } from "./inngest.controller";
import { MailerService } from "./mailer.service";
import { SequenceQueueService } from "./sequence-queue.service";
import { SequenceRunnerService } from "./sequence-runner.service";

@Module({
  controllers: [InngestController],
  providers: [
    PrismaService,
    MailerService,
    SequenceRunnerService,
    SequenceQueueService,
  ],
  exports: [SequenceQueueService, SequenceRunnerService],
})
export class SequenceModule {}
