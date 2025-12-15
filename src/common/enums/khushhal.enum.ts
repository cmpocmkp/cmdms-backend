export enum KhushhalProgressStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
}

export enum KhushhalProgressType {
  INITIAL = 'initial',
  UPDATE = 'update',
  FINAL = 'final',
}

export const KhushhalProgressStatusLabels: Record<KhushhalProgressStatus, string> = {
  [KhushhalProgressStatus.PENDING]: 'Pending',
  [KhushhalProgressStatus.IN_PROGRESS]: 'In Progress',
  [KhushhalProgressStatus.COMPLETED]: 'Completed',
  [KhushhalProgressStatus.DELAYED]: 'Delayed',
};

export const KhushhalProgressTypeLabels: Record<KhushhalProgressType, string> = {
  [KhushhalProgressType.INITIAL]: 'Initial',
  [KhushhalProgressType.UPDATE]: 'Update',
  [KhushhalProgressType.FINAL]: 'Final',
};

