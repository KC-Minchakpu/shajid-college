'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormContext } from '@/context/MultiStepContext';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const { formData } = useFormContext();

  // --- 1. RESTRUCTURE DATA ---
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

  // --- 2. SUBMISSION LOGIC (DEV MODE) ---
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

  const handleDownloadPDF = async () => {
    setPreviewing(true);
    try {
      const pdfBytes = await generateStyledPDF(formData);
      download(pdfBytes, `application_review.pdf`, 'application/pdf');
    } finally {
      setPreviewing(false);
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
      <div className="text-center space-y-2 border-b pb-8">
        <h2 className="text-4xl font-black text-gray-900">Application Review</h2>
        <p className="text-gray-500">Double-check your passport and info before final submission.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PASSPORT PREVIEW */}
        <div className="lg:col-span-1 flex flex-col items-center space-y-4">
          <div className="relative w-48 h-60 border-8 border-white shadow-2xl rounded-2xl overflow-hidden bg-gray-100">
            {formData.passportPreview ? (
              <Image 
                src={formData.passportPreview} 
                alt="Passport" 
                fill 
                className="object-cover" 
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center p-4">
                No Passport Uploaded
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Official Passport</p>
        </div>

        {/* RIGHT COLUMN: DATA SUMMARY */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-1">Personal Details</h3>
            <div className="space-y-1">
              <ReviewRow label="Name" value={formData.fullName} />
              <ReviewRow label="Email" value={formData.email} />
              <ReviewRow label="Phone" value={formData.phone} />
              <ReviewRow label="Gender" value={formData.gender} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-1">Program Details</h3>
            <div className="space-y-1">
              <ReviewRow label="Course" value={formData.program} />
              <ReviewRow label="Mode" value={formData.mode} />
              <ReviewRow label="Campus" value={formData.campus} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-1">UTME Info</h3>
            <div className="space-y-1">
              <ReviewRow label="Reg No" value={formData.jambRegNo} />
              <ReviewRow label="Score" value={formData.jambScore} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-1">Medical Info</h3>
            <div className="space-y-1">
              <ReviewRow label="Genotype" value={formData.genotype} />
              <ReviewRow label="Blood Group" value={formData.bloodGroup} />
            </div>
          </section>
        </div>
      </div>

      <div className="pt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
        >
          Back to Edit
        </button>
        <button
          onClick={handleFinalSubmit}
          disabled={submitting}
          className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
        </button>
      </div>
    </div>
  );
}