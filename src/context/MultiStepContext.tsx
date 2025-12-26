'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubjectResult {
  subject: string;
  grade: string;
}

interface ExamSitting {
  examType: string;
  examYear: string;
  examNumber: string;
  subjects: SubjectResult[];
}

export interface FormData {
  // Step 1: Personal
  fullName?: string;
  gender?: string;
  email?: string;
  phone?: string;
  disability?: string;
  contactAddress?: string;
  dateOfBirth?: string;
  parentsName?: string;
  parentsContactAddress?: string; 
  passportPreview?: string;
  passportFile?: File;
  passportUrl?: string; 

  // Step 2: Health
  chronicIllness?: string;
  bloodGroup?: string;
  genotype?: string;
  emergencyContact?: string;

  // Step 3: Schools 
  primarySchool?: string;
  secondarySchool?: string;
  otherInstitutions?: string;

  // Step 4: Exam Results (Sittings)
  sitting1?: ExamSitting;
  sitting2?: ExamSitting | null;

  // Step 5: Program Details 
  program?: string;
  mode?: string;
  campus?: string;

  // Step 6: UTME Info
  jambRegNo?: string;
  jambScore?: number;
  jambSubjects?: string[];
}

interface MultiStepContextType {
  formData: FormData;
  updatePersonalInfo: (data: Partial<FormData>) => void;
  setStep: (step: number) => void;
  currentStep: number;
}

const MultiStepContext = createContext<MultiStepContextType | undefined>(undefined);

export function MultiStepProvider({ children }: { children: ReactNode }) {
  // Initialize with an empty object or sensible defaults
  const [formData, setFormData] = useState<FormData>({
    jambSubjects: [],
    // You can set other defaults here if needed
  });
  const [currentStep, setStep] = useState(1);

  const updatePersonalInfo = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <MultiStepContext.Provider value={{ formData, updatePersonalInfo, currentStep, setStep }}>
      {children}
    </MultiStepContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(MultiStepContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a MultiStepProvider');
  }
  return context;
}