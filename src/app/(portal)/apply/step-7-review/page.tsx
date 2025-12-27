'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormContext } from '@/context/MultiStepContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import styles from './step7.module.css';

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { formData } = useFormContext();

  const nestedData = {
    personalInfo: {
      fullName: formData.fullName || '',
      gender: formData.gender || '',
      email: formData.email || '',
      phone: formData.phone || '',
      passportUrl: formData.passportPreview || "/default-passport.jpg", 
      contactAddress: formData.contactAddress || '',
      dateOfBirth: formData.dateOfBirth || '',
      parentsName: formData.parentsName || '',
      parentsContactAddress: formData.parentsContactAddress || '',
    },
    healthInfo: {
      bloodGroup: formData.bloodGroup,
      genotype: formData.genotype,
      disability: formData.disability,
    },
    schoolsAttended: {
      primarySchool: formData.primarySchool || '',
      secondarySchool: formData.secondarySchool || '',
      otherInstitutions: formData.otherInstitutions || '',
    },
    examResults: [
      ...(formData.sitting1 ? [formData.sitting1] : []),
      ...(formData.sitting2 ? [formData.sitting2] : [])
    ],
    programDetails: {
      program: formData.program || '',
      mode: formData.mode || 'Full-time',
      campus: formData.campus || '',
    },
    utmeInfo: {
      jambRegNo: formData.jambRegNo || '',
      jambScore: Number(formData.jambScore) || 0,
      jambSubjects: formData.jambSubjects || [],
    },
  };

  const handleFinalSubmit = async () => {
    if (!formData) return toast.error('No data to submit');
    setSubmitting(true);
    const loadingToast = toast.loading('Submitting application...');

    try {
      const res = await fetch('/api/apply/final-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          fullForm: nestedData,
        }),
      });

      if (res.ok) {
        toast.success('Application submitted!', { id: loadingToast });
        router.push('/apply/success');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      toast.error('Submission failed. Check your connection.', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value: any }) => (
    <div className={styles.reviewRow}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Application Review</h2>
        <p>Double-check your passport and info before final submission.</p>
      </div>

      <div className={styles.mainGrid}>
        
        {/* LEFT COLUMN: PASSPORT */}
        <div className={styles.passportSection}>
          <div className={styles.passportFrame}>
            {formData.passportPreview ? (
              <Image 
                src={formData.passportPreview} 
                alt="Passport" 
                fill 
                className="object-cover" 
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center p-4 text-gray-400 text-xs">
                No Passport Uploaded
              </div>
            )}
          </div>
          <p className={styles.passportLabel}>Official Passport</p>
        </div>

        {/* RIGHT COLUMN: DATA SUMMARY */}
        <div className={styles.dataGrid}>
          <section className={styles.section}>
            <h3>Personal Details</h3>
            <ReviewRow label="Name" value={formData.fullName} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Phone" value={formData.phone} />
            <ReviewRow label="Gender" value={formData.gender} />
          </section>

          <section className={styles.section}>
            <h3>Program Details</h3>
            <ReviewRow label="Course" value={formData.program} />
            <ReviewRow label="Mode" value={formData.mode} />
            <ReviewRow label="Campus" value={formData.campus} />
          </section>

          <section className={styles.section}>
            <h3>UTME Info</h3>
            <ReviewRow label="Reg No" value={formData.jambRegNo} />
            <ReviewRow label="Score" value={formData.jambScore} />
          </section>

          <section className={styles.section}>
            <h3>Medical Info</h3>
            <ReviewRow label="Genotype" value={formData.genotype} />
            <ReviewRow label="Blood Group" value={formData.bloodGroup} />
          </section>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          Back to Edit
        </button>
        <button
          onClick={handleFinalSubmit}
          disabled={submitting}
          className={styles.submitBtn}
        >
          {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
        </button>
      </div>
    </div>
  );
}