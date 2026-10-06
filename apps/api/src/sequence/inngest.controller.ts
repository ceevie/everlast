import { All, Controller, OnModuleInit, Req, Res } from "@nestjs/common";
import { serve } from "inngest/express";
import { Request, Response } from "express";
import { inngest } from "./inngest.client";
import { bindSequenceRunner, inngestFunctions } from "./inngest.functions";
import { SequenceRunnerService } from "./sequence-runner.service";

@Controller("inngest")
export class InngestController implements OnModuleInit {
  private handler: ReturnType<typeof serve>;

  constructor(private runner: SequenceRunnerService) {}

  onModuleInit() {
    bindSequenceRunner(this.runner);
    this.handler = serve({
      client: inngest,
      functions: inngestFunctions,
    });
  }

  @All()
  async handleRoot(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res);
  }

  @All("*")
  async handleWildcard(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res);
  }
}
