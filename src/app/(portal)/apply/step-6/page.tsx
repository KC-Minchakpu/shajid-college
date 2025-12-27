'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './step6.module.css';

const schema = z.object({
  jambRegNo: z.string().min(10, 'Enter a valid JAMB Reg Number'),
  jambScore: z.coerce.number()
    .min(0, "Score must be at least 0")
    .max(400, "Score cannot exceed 400"),
  jambSubjects: z.array(z.string()).min(4, 'Select 4 subjects').max(4, 'Select 4 subjects'),
});

type UTMEInputs = z.infer<typeof schema>;

const jambSubjectOptions = [
  'English', 'Biology', 'Chemistry', 'Physics', 'Mathematics',
  'Economics', 'Government', 'Geography', 'Literature in English',
  'CRS', 'IRS', 'Agricultural Science', 'Commerce',
];

export default function Step6UTMEInfo() {
  const { formData, updatePersonalInfo } = useFormContext(); 
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<UTMEInputs>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      jambRegNo: formData.jambRegNo || '',
      jambScore: formData.jambScore ?? 0,
      jambSubjects: formData.jambSubjects || [],
    },
  });

  const selectedSubjects = watch('jambSubjects') || [];

  const onFormSubmit = async (data: UTMEInputs) => {
    setIsSaving(true);
    try {
      updatePersonalInfo(data);
      const response = await fetch('/api/apply/step-6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, data }),
      });

      if (!response.ok) throw new Error("Failed to save");
      toast.success("UTME details saved!");
      router.push('/apply/step-7-review');
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.formCard}>
      <div className={styles.header}>
        <h2>Step 6: UTME (JAMB) Details</h2>
        <p>Ensure English, Biology, Chemistry, and Physics are selected for Nursing programs.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>JAMB Registration Number</label>
          <input {...register('jambRegNo')} className={styles.inputField} placeholder="e.g. 202512345678AB" />
          {errors.jambRegNo && <p className={styles.errorText}>{errors.jambRegNo.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>JAMB Total Score</label>
          <input type="number" {...register('jambScore')} className={styles.inputField} placeholder="0 - 400" />
          {errors.jambScore && <p className={styles.errorText}>{errors.jambScore.message}</p>}
        </div>
      </div>

      <div className={styles.subjectContainer}>
        <label className={styles.label}>JAMB Subject Combination (Select Exactly 4)</label>
        <div className={styles.subjectGrid}>
          {jambSubjectOptions.map((subj) => (
            <label key={subj} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={subj}
                {...register('jambSubjects')}
                className={styles.checkboxInput}
                disabled={!selectedSubjects.includes(subj) && selectedSubjects.length >= 4}
              />
              <span>{subj}</span>
            </label>
          ))}
        </div>
        {errors.jambSubjects && <p className={styles.errorText}>{errors.jambSubjects.message}</p>}
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={() => router.back()} className={styles.backBtn}>Back</button>
        <button type="submit" disabled={isSaving} className={styles.submitBtn}>
          {isSaving ? 'Saving...' : 'Review Application'}
        </button>
      </div>
    </form>
  );
}