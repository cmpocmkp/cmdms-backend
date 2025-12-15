export enum KpiFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export const KpiFrequencyLabels: Record<KpiFrequency, string> = {
  [KpiFrequency.DAILY]: 'Daily',
  [KpiFrequency.WEEKLY]: 'Weekly',
  [KpiFrequency.MONTHLY]: 'Monthly',
  [KpiFrequency.QUARTERLY]: 'Quarterly',
  [KpiFrequency.YEARLY]: 'Yearly',
};

