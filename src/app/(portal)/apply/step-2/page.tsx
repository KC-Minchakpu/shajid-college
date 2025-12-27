'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './step2.module.css';

const healthSchema = z.object({
  chronicIllness: z.string().min(1, 'Please describe or enter "None"'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  genotype: z.string().min(1, 'Genotype is required'),
  emergencyContact: z.string().min(10, 'Please enter a valid phone number'),
});

type HealthInfoInputs = z.infer<typeof healthSchema>;

export default function Step2HealthInfo() {
  const { formData, updatePersonalInfo } = useFormContext();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthInfoInputs>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      chronicIllness: formData.chronicIllness || '',
      bloodGroup: formData.bloodGroup || '',
      genotype: formData.genotype || '',
      emergencyContact: formData.emergencyContact || '', 
    },
  });

  const onSubmit = async (values: HealthInfoInputs) => {
    setIsSaving(true);
    try {
      updatePersonalInfo(values);

      const response = await fetch('/api/apply/step-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: values,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Health info saved!");
      router.push('/apply/step-3-schools-attended');
    } catch (error) {
      toast.error("Could not save health information.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <div className={styles.header}>
        <h2>Step 2: Health Information</h2>
        <p>This information is required for medical records and emergency purposes.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Do you have any chronic illness? (Enter &apos;None&apos; if none)</label>
          <textarea 
            {...register('chronicIllness')} 
            className={styles.inputField}
            placeholder="e.g. Asthma, Diabetes, or None"
            rows={2}
          />
          {errors.chronicIllness && <p className={styles.errorText}>{errors.chronicIllness.message}</p>}
        </div>

        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Blood Group</label>
            <select {...register('bloodGroup')} className={styles.inputField}>
              <option value="">Select...</option>
              {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            {errors.bloodGroup && <p className={styles.errorText}>{errors.bloodGroup.message}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Genotype</label>
            <select {...register('genotype')} className={styles.inputField}>
              <option value="">Select...</option>
              {['AA', 'AS', 'SS', 'AC', 'SC'].map(gt => (
                <option key={gt} value={gt}>{gt}</option>
              ))}
            </select>
            {errors.genotype && <p className={styles.errorText}>{errors.genotype.message}</p>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Emergency Contact Number</label>
          <input 
            type="tel" 
            {...register('emergencyContact')} 
            className={styles.inputField}
            placeholder="08012345678" 
          />
          {errors.emergencyContact && <p className={styles.errorText}>{errors.emergencyContact.message}</p>}
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
          {isSaving ? 'Saving...' : 'Next Step: Schools'}
        </button>
      </div>
    </form>
  );
}