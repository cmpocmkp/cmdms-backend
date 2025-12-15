export enum Roles {
  ADMIN = 1,
  DEPARTMENT = 2,
  DATA_ENTRY = 3,
  CM = 4,
  CS = 5,
  SECTORIAL = 7,
  CABINET = 6,
}

export const RoleLabels: Record<Roles, string> = {
  [Roles.ADMIN]: 'Admin',
  [Roles.DEPARTMENT]: 'Department User',
  [Roles.DATA_ENTRY]: 'Data Entry',
  [Roles.CM]: 'Chief Minister',
  [Roles.CS]: 'Chief Secretary',
  [Roles.SECTORIAL]: 'Sectorial',
  [Roles.CABINET]: 'Cabinet',
};

