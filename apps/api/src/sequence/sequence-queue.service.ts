import { Injectable, Logger } from "@nestjs/common";
import { inngest } from "./inngest.client";
import { SequenceRunnerService } from "./sequence-runner.service";

@Injectable()
export class SequenceQueueService {
  private readonly logger = new Logger(SequenceQueueService.name);

  constructor(private runner: SequenceRunnerService) {}

  isInngestConfigured(): boolean {
    return Boolean(process.env.INNGEST_EVENT_KEY || process.env.INNGEST_DEV);
  }

  async enqueue(enrollmentId: string) {
    if (this.isInngestConfigured()) {
      await inngest.send({
        name: "workflow/enrolled",
        data: { enrollmentId },
      });
      this.logger.log(`Sequenz ${enrollmentId} an Inngest übergeben`);
      return;
    }

    this.logger.warn(
      "Inngest nicht konfiguriert — Sequenz läuft lokal bis zum ersten WAIT",
    );
    await this.runner.runUntilWait(enrollmentId);
  }
}
