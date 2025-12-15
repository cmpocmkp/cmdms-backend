export enum SchemeStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum SchemeType {
  NEW = 'new',
  ONGOING = 'ongoing',
  MEGA = 'mega',
  DISTRIBUTED = 'distributed',
}

export enum SchemeCategory {
  ADP = 'adp',
  NON_ADP = 'non_adp',
  FOREIGN_AID = 'foreign_aid',
}

export const SchemeStatusLabels: Record<SchemeStatus, string> = {
  [SchemeStatus.DRAFT]: 'Draft',
  [SchemeStatus.PENDING_APPROVAL]: 'Pending Approval',
  [SchemeStatus.APPROVED]: 'Approved',
  [SchemeStatus.IN_PROGRESS]: 'In Progress',
  [SchemeStatus.COMPLETED]: 'Completed',
  [SchemeStatus.ON_HOLD]: 'On Hold',
  [SchemeStatus.CANCELLED]: 'Cancelled',
};

export const SchemeTypeLabels: Record<SchemeType, string> = {
  [SchemeType.NEW]: 'New Scheme',
  [SchemeType.ONGOING]: 'Ongoing Scheme',
  [SchemeType.MEGA]: 'Mega Scheme',
  [SchemeType.DISTRIBUTED]: 'Distributed Scheme',
};

export const SchemeCategoryLabels: Record<SchemeCategory, string> = {
  [SchemeCategory.ADP]: 'ADP',
  [SchemeCategory.NON_ADP]: 'Non-ADP',
  [SchemeCategory.FOREIGN_AID]: 'Foreign Aid',
};

