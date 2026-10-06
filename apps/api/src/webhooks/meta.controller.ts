import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  Logger,
  Post,
  Query,
  Req,
  Res,
  RawBodyRequest,
} from "@nestjs/common";
import { Request, Response } from "express";
import { MetaWebhookPayload, MetaWebhookService } from "./meta-webhook.service";

@Controller("webhooks/meta")
export class MetaWebhookController {
  private readonly logger = new Logger(MetaWebhookController.name);

  constructor(private readonly metaWebhook: MetaWebhookService) {}

  @Get()
  verify(
    @Query("hub.mode") mode: string | undefined,
    @Query("hub.verify_token") token: string | undefined,
    @Query("hub.challenge") challenge: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (mode === "subscribe" && this.metaWebhook.isValidVerifyToken(token)) {
      res.status(200).type("text/plain").send(challenge ?? "");
      return;
    }
    throw new ForbiddenException("Invalid verify token");
  }

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-hub-signature-256") signature: string | undefined,
    @Body() body: MetaWebhookPayload,
  ) {
    if (!this.metaWebhook.isValidSignature(req.rawBody, signature)) {
      this.logger.warn("Ungültige Meta-Webhook-Signatur");
      throw new ForbiddenException("Invalid signature");
    }

    // Meta erwartet 200 schnell; Verarbeitung darf den Response nicht blockieren.
    void this.metaWebhook.handlePayload(body).catch((error) => {
      this.logger.error(
        "Meta-Webhook-Verarbeitung fehlgeschlagen",
        error instanceof Error ? error.stack : String(error),
      );
    });

    return { received: true };
  }
}
