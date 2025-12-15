export enum MeetingType {
  NORMAL = 1,
  CABINET = 2,
  PTF = 3,
  PMRU = 4,
  BOARD = 5,
  SECTORIAL = 6,
  SENATE = 7,
}

export const MeetingTypeLabels: Record<MeetingType, string> = {
  [MeetingType.NORMAL]: 'Normal Meeting',
  [MeetingType.CABINET]: 'Cabinet Meeting',
  [MeetingType.PTF]: 'PTF Meeting',
  [MeetingType.PMRU]: 'PMRU Meeting',
  [MeetingType.BOARD]: 'Board Meeting',
  [MeetingType.SECTORIAL]: 'Sectorial Meeting',
  [MeetingType.SENATE]: 'Senate Meeting',
};

