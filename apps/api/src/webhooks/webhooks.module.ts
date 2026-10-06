import { Module } from "@nestjs/common";
import { LeadsModule } from "../leads/leads.module";
import { PrismaService } from "../prisma.service";
import { MetaGraphService } from "./meta-graph.service";
import { MetaWebhookController } from "./meta.controller";
import { MetaWebhookService } from "./meta-webhook.service";

@Module({
  imports: [LeadsModule],
  controllers: [MetaWebhookController],
  providers: [MetaWebhookService, MetaGraphService, PrismaService],
})
export class WebhooksModule {}
