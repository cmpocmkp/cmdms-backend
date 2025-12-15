export enum UserType {
  ADMIN = 'admin',
  DEPARTMENT = 'department',
  CS = 'cs',
  CM = 'cm',
}

export const UserTypeLabels: Record<UserType, string> = {
  [UserType.ADMIN]: 'Admin User',
  [UserType.DEPARTMENT]: 'Department User',
  [UserType.CS]: 'Chief Secretary',
  [UserType.CM]: 'Chief Minister',
};

