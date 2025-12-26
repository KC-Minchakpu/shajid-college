export interface NursingApplication {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  // Step 2: Health
  bloodGroup: string;
  genotype: string;
  // ... other steps
  // Step 6: UTME
  utmeScore: number;
  utmeRegNumber: string;
  // Meta
  isPaid: boolean;
  status: 'DRAFT' | 'SUBMITTED';
}