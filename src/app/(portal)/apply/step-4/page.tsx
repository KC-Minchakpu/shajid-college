'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { examSubjects } from '@/constants/subjects'; 
import styles from './step4.module.css';

// ... (Keep your existing subjectSchema and sittingSchema)
const subjectSchema = z.object({
  subject: z.string().min(1, 'Required'),
  grade: z.string().min(1, 'Required'),
});

const sittingSchema = z.object({
  examType: z.string().min(1, 'Select exam type'),
  examYear: z.string().length(4, 'Must be 4 digits'),
  examNumber: z.string().min(5, 'Invalid Exam Number'),
  subjects: z.array(subjectSchema).min(5, 'At least 5 subjects required'),
});

const schema = z.object({
  sitting1: sittingSchema,
  sitting2: sittingSchema.optional().nullable(),
});

type ExamFormInputs = z.infer<typeof schema>;

export default function Step4ExamResults() {
  const { formData, updatePersonalInfo } = useFormContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showSitting2, setShowSitting2] = useState(!!formData.sitting2);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ExamFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      sitting1: formData.sitting1 || { 
        examType: '', examYear: '', examNumber: '', 
        subjects: Array(5).fill({ subject: '', grade: '' }) 
      },
      sitting2: formData.sitting2 || null,
    },
  });

  const { fields: subjects1, append: append1 } = useFieldArray({ control, name: 'sitting1.subjects' });
  const { fields: subjects2, append: append2 } = useFieldArray({ control, name: 'sitting2.subjects' });

  const toggleSitting2 = () => {
    if (!showSitting2) {
      // Initialize Sitting 2 with empty fields when opened
      setShowSitting2(true);
    } else {
      setShowSitting2(false);
    }
  };

  const onSubmit = async (formValues: ExamFormInputs) => {
    setIsSaving(true);
    try {
      // If Sitting 2 is hidden, don't send it to the API
      const finalData = {
        ...formValues,
        sitting2: showSitting2 ? formValues.sitting2 : null
      };

      updatePersonalInfo(finalData);
      const response = await fetch('/api/apply/step-4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, data: finalData }),
      });
      if (!response.ok) throw new Error("Failed to save");
      toast.success("Exam results saved!");
      router.push('/apply/step-5-program-details');
    } catch (error) {
      toast.error("Error saving exam results.");
    } finally {
      setIsSaving(false);
    }
  };

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <div className={styles.header}>
        <h2>Step 4: O&apos;Level Results</h2>
        <p>Enter your WAEC/NECO results. You can provide one or two sittings.</p>
      </div>

      {/* SITTING 1 */}
      <section className={styles.sittingSection}>
        <h3 className={styles.sittingTitle}>First Sitting</h3>
        <div className={styles.metaGrid}>
          <input type="text" {...register('sitting1.examYear')} className={styles.inputField} placeholder="Year" />
          <input type="text" {...register('sitting1.examNumber')} className={styles.inputField} placeholder="Exam Number" />
          <select {...register('sitting1.examType')} className={styles.inputField}>
            <option value="">Exam Type</option>
            <option value="WAEC">WAEC</option>
            <option value="NECO">NECO</option>
          </select>
        </div>

        <div className={styles.subjectList}>
          {subjects1.map((field, index) => (
            <div key={field.id} className={styles.subjectRow}>
              <select {...register(`sitting1.subjects.${index}.subject`)} className={`${styles.inputField} ${styles.subjectSelect}`}>
                <option value="">Select Subject</option>
                {examSubjects.map((subject: string) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select {...register(`sitting1.subjects.${index}.grade`)} className={`${styles.inputField} ${styles.gradeSelect}`}>
                <option value="">Grade</option>
                {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ))}
          <button type="button" onClick={() => append1({ subject: '', grade: '' })} className={styles.addBtn}>+ Add Subject</button>
        </div>
      </section>

      {/* SITTING 2 TOGGLE */}
      {!showSitting2 && (
        <button type="button" onClick={toggleSitting2} className={styles.toggleSittingBtn}>
          + Use Two Sittings?
        </button>
      )}

      {/* SITTING 2 */}
      {showSitting2 && (
        <section className={styles.sittingSection}>
          <div className={styles.sittingHeader}>
            <h3 className={styles.sittingTitle}>Second Sitting</h3>
            <button type="button" onClick={() => setShowSitting2(false)} className={styles.removeSittingBtn}>Remove</button>
          </div>
          <div className={styles.metaGrid}>
            <input type="text" {...register('sitting2.examYear')} className={styles.inputField} placeholder="Year" />
            <input type="text" {...register('sitting2.examNumber')} className={styles.inputField} placeholder="Exam Number" />
            <select {...register('sitting2.examType')} className={styles.inputField}>
              <option value="">Exam Type</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
            </select>
          </div>

          <div className={styles.subjectList}>
            {subjects2.map((field, index) => (
              <div key={field.id} className={styles.subjectRow}>
                <select {...register(`sitting2.subjects.${index}.subject`)} className={`${styles.inputField} ${styles.subjectSelect}`}>
                  <option value="">Select Subject</option>
                  {examSubjects.map((subject: string) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select {...register(`sitting2.subjects.${index}.grade`)} className={`${styles.inputField} ${styles.gradeSelect}`}>
                  <option value="">Grade</option>
                  {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            ))}
            <button type="button" onClick={() => append2({ subject: '', grade: '' })} className={styles.addBtn}>+ Add Subject</button>
          </div>
        </section>
      )}

      <div className={styles.footer}>
        <button type="button" onClick={() => router.back()} className={styles.backBtn}>Back</button>
        <button type="submit" disabled={isSaving} className={styles.nextBtn}>
          {isSaving ? 'Saving...' : 'Next Step'}
        </button>
      </div>
    </form>
  );
}