'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

// 1. Define the Schema
const schema = z.object({
  jambRegNo: z.string().min(10, 'Enter a valid JAMB Reg Number'),
  jambScore: z.coerce.number()
    .min(0, "Score must be at least 0")
    .max(400, "Score cannot exceed 400"),
  jambSubjects: z.array(z.string()).min(4, 'Select 4 subjects').max(4, 'Select 4 subjects'),
});

// Derive type
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

  // 2. Initialize useForm - Using explicit type casting for the resolver
  // to fix the "ResolverOptions" property names incompatibility
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UTMEInputs>({
    resolver: zodResolver(schema) as any, // Cast to any to bridge the Zod/RHF type gap
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
        body: JSON.stringify({
          userId: session?.user?.id,
          data: data,
        }),
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

  const inputClass = "w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white";

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Step 6: UTME (JAMB) Details</h2>
        <p className="text-sm text-gray-500">Ensure English, Biology, Chemistry, and Physics are selected for Nursing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold mb-1 block">JAMB Registration Number</label>
          <input {...register('jambRegNo')} className={inputClass} placeholder="e.g. 2024..." />
          {errors.jambRegNo && <p className="text-red-500 text-xs mt-1 font-medium">{errors.jambRegNo.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block">JAMB Total Score</label>
          <input type="number" {...register('jambScore')} className={inputClass} placeholder="0 - 400" />
          {errors.jambScore && <p className="text-red-500 text-xs mt-1 font-medium">{errors.jambScore.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 block text-gray-700">JAMB Subject Combination (Select 4)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {jambSubjectOptions.map((subj) => (
            <label key={subj} className="flex items-center space-x-2 p-2 rounded hover:bg-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                value={subj}
                {...register('jambSubjects')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!selectedSubjects.includes(subj) && selectedSubjects.length >= 4}
              />
              <span className="text-sm">{subj}</span>
            </label>
          ))}
        </div>
        {errors.jambSubjects && <p className="text-red-500 text-xs mt-2 font-medium">{errors.jambSubjects.message}</p>}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 font-medium">
          Back
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg shadow-md transition-all disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Review Application'}
        </button>
      </div>
    </form>
  );
}