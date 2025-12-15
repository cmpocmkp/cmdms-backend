export enum NotificationType {
  ASSIGNMENT = 'assignment',
  STATUS_CHANGE = 'status_change',
  DEADLINE = 'deadline',
  OVERDUE = 'overdue',
  UPDATE = 'update',
  COMMENT = 'comment',
  MENTION = 'mention',
  APPROVAL = 'approval',
}

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.ASSIGNMENT]: 'New Assignment',
  [NotificationType.STATUS_CHANGE]: 'Status Changed',
  [NotificationType.DEADLINE]: 'Deadline Approaching',
  [NotificationType.OVERDUE]: 'Item Overdue',
  [NotificationType.UPDATE]: 'Update Available',
  [NotificationType.COMMENT]: 'New Comment',
  [NotificationType.MENTION]: 'You were mentioned',
  [NotificationType.APPROVAL]: 'Approval Required',
};

