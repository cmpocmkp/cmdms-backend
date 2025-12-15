// Roles Enum
export enum Roles {
  ADMIN = 'admin',
  CM = 'cm',
  CS = 'cs',
  CABINET = 'cabinet',
  DEPARTMENT = 'department',
  DATAENTRY = 'dataentry',
  SECTORIAL = 'sectorial',
}

// Decision Status
export enum DecisionStatus {
  ON_TARGET = 1,
  DELAYED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  ONGOING = 5,
}

// Issue Status
export enum IssueStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}

// User Type
export enum UserType {
  SYSTEM = 'system',
  REGULAR = 'regular',
  EXTERNAL = 'external',
}

// Issue Type
export enum IssueType {
  PUBLIC_COMPLAINT = 'public_complaint',
  MEDIA_REPORT = 'media_report',
  CM_DIRECTIVE = 'cm_directive',
  HCM_DIRECTIVE = 'hcm_directive',
  PTF_ISSUE = 'ptf_issue',
  OTHER = 'other',
}

// Meeting Type
export enum MeetingType {
  NORMAL = 'normal',
  CABINET = 'cabinet',
  PTF = 'ptf',
  PMRU = 'pmru',
  BOARD = 'board',
  SECTORIAL = 'sectorial',
  SENATE = 'senate',
}

// Notification Type
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  REMINDER = 'reminder',
  ALERT = 'alert',
  SYSTEM = 'system',
}

// Permission Category
export enum PermissionCategory {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  DEPARTMENT = 'department',
  MEETINGS = 'meetings',
  MINUTES = 'minutes',
  DIRECTIVES = 'directives',
  ANNOUNCEMENTS = 'announcements',
  COMPLAINTS = 'complaints',
  ISSUES = 'issues',
  TASKS = 'tasks',
  KPI = 'kpi',
  REPORTS = 'reports',
  ACTIVITY_LOGS = 'activity_logs',
}

// Board Member Type
export enum BoardMemberType {
  CHAIRMAN = 'chairman',
  VICE_CHAIRMAN = 'vice_chairman',
  MEMBER = 'member',
  SECRETARY = 'secretary',
  EX_OFFICIO = 'ex_officio',
}

// Board Member Status
export enum BoardMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESIGNED = 'resigned',
  TERM_EXPIRED = 'term_expired',
}

// KPI Frequency
export enum KpiFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

// Senate Member Type
export enum SenateMemberType {
  GOVERNMENT = 'government',
  OPPOSITION = 'opposition',
  EXPERT = 'expert',
  EX_OFFICIO = 'ex_officio',
}

// Khushhal Progress Type
export enum KhushhalProgressType {
  NARRATIVE = 'narrative',
  METRIC = 'metric',
  PHOTO = 'photo',
  DOCUMENT = 'document',
}

// Khushhal Progress Status
export enum KhushhalProgressStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
}

// Scheme Status
export enum SchemeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended',
}

// Scheme Type
export enum SchemeType {
  ANNUAL = 'annual',
  MEGA = 'mega',
  DISTRIBUTED = 'distributed',
  FEDERAL = 'federal',
}

