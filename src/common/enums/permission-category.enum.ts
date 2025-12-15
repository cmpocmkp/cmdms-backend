export enum PermissionCategory {
  ADMIN = 'admin',
  DEPARTMENT = 'department',
  REPORTS = 'reports',
}

export const PermissionCategoryLabels: Record<PermissionCategory, string> = {
  [PermissionCategory.ADMIN]: 'Admin Permissions',
  [PermissionCategory.DEPARTMENT]: 'Department Permissions',
  [PermissionCategory.REPORTS]: 'Report Permissions',
};

