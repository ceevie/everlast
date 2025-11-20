import { LeadStatus, TaskStatus } from "@everlast/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type StatusBadgeProps =
  | { variant: "lead"; status: LeadStatus }
  | { variant: "task"; status: TaskStatus };

const leadVariantMap: Record<LeadStatus, BadgeProps["variant"]> = {
  [LeadStatus.NEW]: "default",
  [LeadStatus.CONTACTED]: "secondary",
  [LeadStatus.QUALIFIED]: "outline",
  [LeadStatus.OFFER_SENT]: "outline",
  [LeadStatus.WON]: "success",
  [LeadStatus.LOST]: "destructive",
};

const taskVariantMap: Record<TaskStatus, BadgeProps["variant"]> = {
  [TaskStatus.OPEN]: "default",
  [TaskStatus.DONE]: "success",
};

export function StatusBadge(props: StatusBadgeProps) {
  if (props.variant === "lead") {
    return (
      <Badge variant={leadVariantMap[props.status]}>
        {props.status.replace("_", " ")}
      </Badge>
    );
  }
  return (
    <Badge variant={taskVariantMap[props.status]}>
      {props.status.replace("_", " ")}
    </Badge>
  );
}

