'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './step5.module.css';

const schema = z.object({
  program: z.string().min(1, 'Select your preferred program'),
  mode: z.string().min(1, 'Choose full-time or part-time'),
  campus: z.string().min(1, 'Choose a campus'),
});

type ProgramInputs = z.infer<typeof schema>;

const programs = [
  'General Nursing',
  'Basic Nursing',
  'Basic Midwifery',
  'Community Midwifery',
  'Community Nursing',
  'Post Basic Nursing',
  'Mental Health Nursing',
];

const campuses = [
  'Main Campus',
  'Satellite Campus 1',
  'Satellite Campus 2',
];

export default function Step5ProgramDetails() {
  const { formData, updatePersonalInfo } = useFormContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProgramInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      program: formData.program || '',
      mode: formData.mode || '',
      campus: formData.campus || '',
    }
  });

  const onSubmit = async (formValues: ProgramInputs) => {
    setIsSaving(true);
    try {
      updatePersonalInfo(formValues);

      const response = await fetch('/api/apply/step-5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: formValues,
        }),
      });

      if (!response.ok) throw new Error("Failed to save program details");

      toast.success("Program selection saved!");
      router.push('/apply/step-6-utme');
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <div className={styles.header}>
        <h2>Step 5: Program Selection</h2>
        <p>Choose your desired course of study and campus location.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Program of Choice</label>
          <select {...register('program')} className={styles.inputField}>
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.program && <p className={styles.errorText}>{errors.program.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Mode of Study</label>
          <select {...register('mode')} className={styles.inputField}>
            <option value="">Select mode</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          {errors.mode && <p className={styles.errorText}>{errors.mode.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Preferred Campus</label>
          <select {...register('campus')} className={styles.inputField}>
            <option value="">Select campus</option>
            {campuses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.campus && <p className={styles.errorText}>{errors.campus.message}</p>}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={() => router.back()} className={styles.backBtn}>Back</button>
        <button type="submit" disabled={isSaving} className={styles.nextBtn}>
          {isSaving ? 'Saving...' : 'Next: UTME Details'}
        </button>
      </div>
    </form>
  );
}