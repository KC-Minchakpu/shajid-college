export const examSubjects = [
  'English Language',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Agricultural Science',
  'Economics',
  'Geography',
  'Civic Education',
  'Government',
  'Commerce',
  'Financial Accounting',
  'Literature in English',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Technical Drawing',
  'Further Mathematics',
  'History',
  'French',
  'Computer Studies',
] as const;

// This helps TypeScript understand that 'examSubjects' is a fixed list of strings
export type ExamSubject = (typeof examSubjects)[number];