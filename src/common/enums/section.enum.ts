export enum SectionCategory {
  CM_SECRETARIAT = 'cm_secretariat',
  CS_OFFICE = 'cs_office',
  PLANNING_DEVELOPMENT = 'planning_development',
  FINANCE = 'finance',
  HOME = 'home',
  EDUCATION = 'education',
  HEALTH = 'health',
  AGRICULTURE = 'agriculture',
  OTHERS = 'others',
}

export const SectionCategoryLabels: Record<SectionCategory, string> = {
  [SectionCategory.CM_SECRETARIAT]: 'Chief Minister Secretariat',
  [SectionCategory.CS_OFFICE]: 'Chief Secretary Office',
  [SectionCategory.PLANNING_DEVELOPMENT]: 'Planning & Development',
  [SectionCategory.FINANCE]: 'Finance Department',
  [SectionCategory.HOME]: 'Home Department',
  [SectionCategory.EDUCATION]: 'Education Department',
  [SectionCategory.HEALTH]: 'Health Department',
  [SectionCategory.AGRICULTURE]: 'Agriculture Department',
  [SectionCategory.OTHERS]: 'Others',
};

