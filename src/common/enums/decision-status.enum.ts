export enum DecisionStatus {
  TOTAL = 5,
  COMPLETED = 1,
  ON_TARGET = 2,
  OVERDUE = 3,
  OFF_TARGET = 4,
  OVERDUE_OTHER_REASON = 6,
  ONGOING = 7,
  CAN_NOT_COMPLETED = 8,
  OFF_TARGET_OTHER_REASON = 9,
}

export const DecisionStatusLabels: Record<DecisionStatus, string> = {
  [DecisionStatus.COMPLETED]: 'Completed',
  [DecisionStatus.TOTAL]: 'Total',
  [DecisionStatus.ON_TARGET]: 'On Target',
  [DecisionStatus.OVERDUE]: 'Overdue',
  [DecisionStatus.OFF_TARGET]: 'Off Target',
  [DecisionStatus.OVERDUE_OTHER_REASON]: 'Overdue other reason',
  [DecisionStatus.ONGOING]: 'Ongoing',
  [DecisionStatus.CAN_NOT_COMPLETED]: 'Can not be completed',
  [DecisionStatus.OFF_TARGET_OTHER_REASON]: 'Off Target reason',
};

export const DecisionStatusColors: Record<DecisionStatus, string> = {
  [DecisionStatus.COMPLETED]: 'success',
  [DecisionStatus.ON_TARGET]: 'warning',
  [DecisionStatus.OVERDUE]: 'danger',
  [DecisionStatus.OFF_TARGET]: 'info',
  [DecisionStatus.OVERDUE_OTHER_REASON]: 'purple',
  [DecisionStatus.ONGOING]: 'primary',
  [DecisionStatus.CAN_NOT_COMPLETED]: 'dark',
  [DecisionStatus.OFF_TARGET_OTHER_REASON]: 'danger',
  [DecisionStatus.TOTAL]: 'secondary',
};

