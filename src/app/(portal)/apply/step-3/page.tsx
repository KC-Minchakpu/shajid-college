'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './step3.module.css';

const schoolSchema = z.object({
  primarySchool: z.string().min(1, 'Primary School name is required'),
  secondarySchool: z.string().min(1, 'Secondary School name is required'),
  otherInstitutions: z.string().optional(),
});

type SchoolInputs = z.infer<typeof schoolSchema>;

export default function Step3SchoolsAttended() {
  const { formData, updatePersonalInfo } = useFormContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolInputs>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      primarySchool: formData.primarySchool || '',
      secondarySchool: formData.secondarySchool || '',
      otherInstitutions: formData.otherInstitutions || '',
    }
  });

  const onSubmit = async (formValues: SchoolInputs) => {
    setIsSaving(true);
    try {
      updatePersonalInfo(formValues);

      const response = await fetch('/api/apply/step-3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: formValues,
        }),
      });

      if (!response.ok) throw new Error("Failed to save schools info");

      toast.success("Educational history saved!");
      router.push('/apply/step-4-exam-results');
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <div className={styles.header}>
        <h2>Step 3: Educational History</h2>
        <p>Please provide details of schools you have attended.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Primary School Attended</label>
          <input 
            {...register('primarySchool')} 
            className={styles.inputField} 
            placeholder="e.g. Model Primary School, Abuja"
          />
          {errors.primarySchool && <p className={styles.errorText}>{errors.primarySchool.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Secondary School Attended</label>
          <input 
            {...register('secondarySchool')} 
            className={styles.inputField}
            placeholder="e.g. Government Secondary School"
          />
          {errors.secondarySchool && <p className={styles.errorText}>{errors.secondarySchool.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Other Institutions (Optional)</label>
          <textarea 
            {...register('otherInstitutions')} 
            className={styles.inputField}
            placeholder="e.g. Previous Nursing school, College of Education, etc."
            rows={3}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          type="button" 
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className={styles.nextBtn}
        >
          {isSaving ? 'Saving...' : 'Next: Exam Results'}
        </button>
      </div>
    </form>
  );
}