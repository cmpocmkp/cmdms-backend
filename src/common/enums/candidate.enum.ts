export enum CandidateRequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ElectionType {
  GENERAL = 'general',
  BY_ELECTION = 'by_election',
}

export const CandidateRequestStatusLabels: Record<CandidateRequestStatus, string> = {
  [CandidateRequestStatus.PENDING]: 'Pending',
  [CandidateRequestStatus.IN_PROGRESS]: 'In Progress',
  [CandidateRequestStatus.RESOLVED]: 'Resolved',
  [CandidateRequestStatus.REJECTED]: 'Rejected',
};

export const ElectionTypeLabels: Record<ElectionType, string> = {
  [ElectionType.GENERAL]: 'General Election',
  [ElectionType.BY_ELECTION]: 'By-Election',
};

