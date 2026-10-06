import { WorkflowActionType } from "@everlast/prisma";
import { inngest } from "./inngest.client";
import { SequenceRunnerService } from "./sequence-runner.service";

let runner: SequenceRunnerService | null = null;

export function bindSequenceRunner(service: SequenceRunnerService) {
  runner = service;
}

function getRunner(): SequenceRunnerService {
  if (!runner) {
    throw new Error("SequenceRunner ist noch nicht gebunden");
  }
  return runner;
}

export const runWorkflowSequence = inngest.createFunction(
  {
    id: "run-workflow-sequence",
    retries: 4,
    onFailure: async ({ error, event }) => {
      const payload = event.data as {
        enrollmentId?: string;
        event?: { data?: { enrollmentId?: string } };
      };
      const enrollmentId = payload.enrollmentId ?? payload.event?.data?.enrollmentId;
      if (enrollmentId) {
        await getRunner().fail(
          enrollmentId,
          error instanceof Error ? error.message : String(error),
        );
      }
    },
  },
  { event: "workflow/enrolled" },
  async ({ event, step }) => {
    const enrollmentId = event.data.enrollmentId as string;
    const loaded = await step.run("load-enrollment", () =>
      getRunner().load(enrollmentId),
    );

    if (loaded.status !== "ACTIVE") {
      return { skipped: true, status: loaded.status };
    }

    const steps = loaded.workflow.steps;
    const start = loaded.currentStep ?? 0;

    for (let i = start; i < steps.length; i++) {
      const workflowStep = steps[i];

      if (workflowStep.actionType === WorkflowActionType.WAIT) {
        const seconds = getRunner().delaySeconds(workflowStep.config);
        if (seconds > 0) {
          const nextRunAt = new Date(Date.now() + seconds * 1000);
          await step.run(`schedule-wait-${workflowStep.id}`, () =>
            getRunner().markStep(enrollmentId, i, nextRunAt),
          );
          await step.sleep(`wait-${workflowStep.id}`, `${seconds}s`);
        }
      } else {
        await step.run(`action-${workflowStep.id}`, () =>
          getRunner().runAction(
            enrollmentId,
            workflowStep.id,
            workflowStep.actionType,
            workflowStep.config,
          ),
        );
      }

      await step.run(`progress-${workflowStep.id}`, () =>
        getRunner().markStep(enrollmentId, i + 1),
      );
    }

    await step.run("complete-enrollment", () => getRunner().complete(enrollmentId));
    return { completed: true, enrollmentId };
  },
);

export const inngestFunctions = [runWorkflowSequence];
