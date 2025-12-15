export enum SenateMemberType {
  FACULTY = 'faculty',
  ADMIN = 'admin',
  EX_OFFICIO = 'ex_officio',
  NOMINATED = 'nominated',
}

export enum SenateMemberAppointmentType {
  REGULAR = 'regular',
  ACTING = 'acting',
  TEMPORARY = 'temporary',
}

export const SenateMemberTypeLabels: Record<SenateMemberType, string> = {
  [SenateMemberType.FACULTY]: 'Faculty',
  [SenateMemberType.ADMIN]: 'Administration',
  [SenateMemberType.EX_OFFICIO]: 'Ex-Officio',
  [SenateMemberType.NOMINATED]: 'Nominated',
};

export const SenateMemberAppointmentTypeLabels: Record<SenateMemberAppointmentType, string> = {
  [SenateMemberAppointmentType.REGULAR]: 'Regular',
  [SenateMemberAppointmentType.ACTING]: 'Acting',
  [SenateMemberAppointmentType.TEMPORARY]: 'Temporary',
};

