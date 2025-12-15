export enum BoardMemberType {
  EX_OFFICIO = 'ex-officio',
  PRIVATE = 'private',
  NOMINATED = 'nominated',
}

export enum BoardMemberStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export const BoardMemberTypeLabels: Record<BoardMemberType, string> = {
  [BoardMemberType.EX_OFFICIO]: 'Ex-Officio',
  [BoardMemberType.PRIVATE]: 'Private',
  [BoardMemberType.NOMINATED]: 'Nominated',
};

export const BoardMemberStatusLabels: Record<BoardMemberStatus, string> = {
  [BoardMemberStatus.ACTIVE]: 'Active',
  [BoardMemberStatus.EXPIRED]: 'Expired',
  [BoardMemberStatus.TERMINATED]: 'Terminated',
};

