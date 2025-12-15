export enum IssueType {
  COMPLAINT = 'complaint',
  QUERY = 'query',
  FEEDBACK = 'feedback',
  REQUEST = 'request',
  EMERGENCY = 'emergency',
}

export enum IssueStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}

export const IssueTypeLabels: Record<IssueType, string> = {
  [IssueType.COMPLAINT]: 'Complaint',
  [IssueType.QUERY]: 'Query',
  [IssueType.FEEDBACK]: 'Feedback',
  [IssueType.REQUEST]: 'Request',
  [IssueType.EMERGENCY]: 'Emergency',
};

export const IssueStatusLabels: Record<IssueStatus, string> = {
  [IssueStatus.NEW]: 'New',
  [IssueStatus.ASSIGNED]: 'Assigned',
  [IssueStatus.IN_PROGRESS]: 'In Progress',
  [IssueStatus.RESOLVED]: 'Resolved',
  [IssueStatus.CLOSED]: 'Closed',
  [IssueStatus.REOPENED]: 'Reopened',
};

