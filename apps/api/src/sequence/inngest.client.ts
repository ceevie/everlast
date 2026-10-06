import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "everlast",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export type WorkflowEnrolledEvent = {
  name: "workflow/enrolled";
  data: {
    enrollmentId: string;
  };
};
