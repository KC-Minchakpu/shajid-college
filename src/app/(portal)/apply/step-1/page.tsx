'use client';

import { useForm } from 'react-hook-form';
import { useFormContext } from '@/context/MultiStepContext';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import styles from './step1.module.css'; 

export default function Step1PersonalInfo({ savedData }: any) {
  const { register, handleSubmit, setValue } = useForm<any>();
  const { updatePersonalInfo } = useFormContext();
  const router = useRouter();
  
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      updatePersonalInfo({ ...data, passport: preview });
      toast.success('Personal info saved!');
      router.push('/apply/step-2');
    } catch (error) {
      toast.error('Failed to save personal info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input className={styles.inputField} {...register('fullName')} placeholder="Surname First" required />
        </div>

        <div className={styles.inputGroup}>
          <label>Gender</label>
          <select className={styles.inputField} {...register('gender')} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input className={styles.inputField} {...register('email')} type="email" placeholder="email@example.com" required />
        </div>

        <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <input className={styles.inputField} {...register('phone')} placeholder="08012345678" required />
        </div>

        <div className={`${styles.inputGroup} ${styles.spanFull}`}>
          <label>Contact Address</label>
          <input className={styles.inputField} {...register('contactAddress')} placeholder="Residential Address" required />
        </div>

        <div className={styles.inputGroup}>
          <label>Date of Birth</label>
          <input className={styles.inputField} {...register('dateOfBirth')} type="date" required />
        </div>

        <div className={styles.inputGroup}>
          <label>Next of Kin Name</label>
          <input className={styles.inputField} {...register('parentsName')} placeholder="Parent/Guardian Name" required />
        </div>
      </div>

      {/* Passport Upload Section */}
      <div className={styles.passportUploadSection}>
        <label className={styles.passportLabel}>
          Passport Photograph (Red Background Required)
        </label>
        
        <div className={styles.uploadControls}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            required={!preview}
            className={styles.fileInput}
          />

          {preview && (
            <div className={styles.previewContainer}>
              <Image 
                src={preview} 
                alt="Passport Preview" 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving || isUploading}
        className={styles.submitButton}
      >
        {isSaving ? 'Processing...' : isUploading ? 'Uploading Image...' : 'Save & Continue to Health Info'}
      </button>
    </form>
  );
}