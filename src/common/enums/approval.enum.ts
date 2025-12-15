export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUIRED = 'revision_required',
}

export enum ApprovalForum {
  PDWP = 'pdwp',
  DDWP = 'ddwp',
  CDWP = 'cdwp',
  ECNEC = 'ecnec',
}

export const ApprovalStatusLabels: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: 'Pending',
  [ApprovalStatus.APPROVED]: 'Approved',
  [ApprovalStatus.REJECTED]: 'Rejected',
  [ApprovalStatus.REVISION_REQUIRED]: 'Revision Required',
};

export const ApprovalForumLabels: Record<ApprovalForum, string> = {
  [ApprovalForum.PDWP]: 'PDWP',
  [ApprovalForum.DDWP]: 'DDWP',
  [ApprovalForum.CDWP]: 'CDWP',
  [ApprovalForum.ECNEC]: 'ECNEC',
};

