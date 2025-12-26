'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

// 1. Validation Schema
const schoolSchema = z.object({
  primarySchool: z.string().min(1, 'Primary School name is required'),
  secondarySchool: z.string().min(1, 'Secondary School name is required'),
  otherInstitutions: z.string().optional(),
});

type SchoolInputs = z.infer<typeof schoolSchema>;

export default function Step3SchoolsAttended() {
  // Use updatePersonalInfo to keep the function name consistent with previous steps
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
      // Update central context
      updatePersonalInfo(formValues);

      // Save to API
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

  const inputClass = "w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Step 3: Educational History</h2>
        <p className="text-sm text-gray-500">Please provide details of schools you have attended.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Primary School Attended</label>
          <input 
            {...register('primarySchool')} 
            className={inputClass} 
            placeholder="e.g. Model Primary School, Abuja"
          />
          {errors.primarySchool && <p className="text-red-500 text-xs mt-1">{errors.primarySchool.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Secondary School Attended</label>
          <input 
            {...register('secondarySchool')} 
            className={inputClass}
            placeholder="e.g. Government Secondary School"
          />
          {errors.secondarySchool && <p className="text-red-500 text-xs mt-1">{errors.secondarySchool.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Other Institutions (Optional)</label>
          <textarea 
            {...register('otherInstitutions')} 
            className={inputClass}
            placeholder="e.g. Previous Nursing school, College of Education, etc."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg transition-all shadow-md disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Next: Exam Results'}
        </button>
      </div>
    </form>
  );
}