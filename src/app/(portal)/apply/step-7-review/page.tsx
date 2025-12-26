'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormContext } from '@/context/MultiStepContext';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import toast from 'react-hot-toast';

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const { formData } = useFormContext();

  const handleFinalSubmit = async () => {
    if (!formData) return toast.error('No data to submit');
    
    setSubmitting(true);
    const loadingToast = toast.loading('Submitting application...');

    // --- RESTRUCTURE DATA TO MATCH BACKEND NESTED SCHEMA ---
    const nestedData = {
      personalInfo: {
        fullName: formData.fullName || '',
        gender: formData.gender || '',
        email: formData.email || '',
        phone: formData.phone || '',
        passportUrl: formData.passportUrl || "https://example.com/default-passport.jpg", 
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
      // Backend expects an array of sittings
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

    try {
      const res = await fetch('/api/apply/final-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          fullForm: nestedData, // Sending the nested object
        }),
      });

      if (res.ok) {
        toast.success('Application submitted successfully!', { id: loadingToast });
        router.push('/apply/success');
      } else {
        const errorData = await res.json();
        console.error('Validation Error:', errorData.error);
        throw new Error('Submission failed');
      }
    } catch (err) {
      toast.error('Submission failed. Check all fields and try again.', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData) return toast.error('No data to generate PDF');
    setPreviewing(true);
    const pdfToast = toast.loading('Generating PDF...');

    try {
      const pdfBytes = await generateStyledPDF(formData);
      download(pdfBytes, `application_${session?.user?.id || 'copy'}.pdf`, 'application/pdf');
      toast.success('PDF downloaded!', { id: pdfToast });
    } catch (err) {
      toast.error('Error generating PDF.', { id: pdfToast });
    } finally {
      setPreviewing(false);
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="text-center space-y-2 border-b pb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Final Review</h2>
        <p className="text-gray-500">Please confirm all details are correct before submission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECTION 1: Personal & Health */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-700 border-l-4 border-blue-600 pl-3">Personal & Health</h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ReviewRow label="Full Name" value={formData.fullName} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Blood Group" value={formData.bloodGroup} />
            <ReviewRow label="Genotype" value={formData.genotype} />
          </div>
        </div>

        {/* SECTION 2: Program Choice */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-700 border-l-4 border-blue-600 pl-3">Program Selection</h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ReviewRow label="Applied Course" value={formData.program} />
            <ReviewRow label="Study Mode" value={formData.mode} />
            <ReviewRow label="Campus" value={formData.campus} />
          </div>
        </div>

        {/* SECTION 3: UTME Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-700 border-l-4 border-blue-600 pl-3">UTME (JAMB) Details</h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ReviewRow label="JAMB Reg No" value={formData.jambRegNo} />
            <ReviewRow label="JAMB Score" value={formData.jambScore} />
            <ReviewRow label="Subjects" value={formData.jambSubjects?.join(', ')} />
          </div>
        </div>

        {/* SECTION 4: O'Level Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-700 border-l-4 border-blue-600 pl-3">O&apos;Level Summary</h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ReviewRow label="First Sitting" value={formData.sitting1 ? `${formData.sitting1.examType} (${formData.sitting1.examYear})` : 'N/A'} />
            {formData.sitting2 && (
              <ReviewRow label="Second Sitting" value={`${formData.sitting2.examType} (${formData.sitting2.examYear})`} />
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Go Back & Edit
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={previewing}
          className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {previewing ? 'Generating...' : 'Download Slip'}
        </button>

        <button
          onClick={handleFinalSubmit}
          disabled={submitting}
          className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl font-extrabold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Submit Final Application'}
        </button>
      </div>
    </div>
  );
}