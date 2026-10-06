import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
  }

  async send(input: SendEmailInput): Promise<{ id?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    if (!apiKey || !from) {
      throw new Error("RESEND_API_KEY oder RESEND_FROM fehlt");
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (result.error) {
      this.logger.error(`Resend-Fehler: ${result.error.message}`);
      throw new Error(result.error.message);
    }

    return { id: result.data?.id };
  }
}
