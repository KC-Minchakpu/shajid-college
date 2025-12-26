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
const schema = z.object({
  program: z.string().min(1, 'Select your preferred program'),
  mode: z.string().min(1, 'Choose full-time or part-time'),
  campus: z.string().min(1, 'Choose a campus'),
});

type ProgramInputs = z.infer<typeof schema>;

// Expanded Course List
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramInputs>({
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
      // ✅ Update central context
      updatePersonalInfo(formValues);

      // ✅ Save to API
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
      router.push('/apply/step-6-utme'); // Next step
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Step 5: Program Selection</h2>
        <p className="text-sm text-gray-500">Choose your desired course of study and campus.</p>
      </div>

      <div className="space-y-4">
        {/* Program Choice */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Program of Choice</label>
          <select {...register('program')} className={inputClass}>
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program.message}</p>}
        </div>

        {/* Mode of Study */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Mode of Study</label>
          <select {...register('mode')} className={inputClass}>
            <option value="">Select mode</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode.message}</p>}
        </div>

        {/* Campus Choice */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-700">Preferred Campus</label>
          <select {...register('campus')} className={inputClass}>
            <option value="">Select campus</option>
            {campuses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.campus && <p className="text-red-500 text-xs mt-1">{errors.campus.message}</p>}
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg shadow-md transition-all disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Next: UTME Details'}
        </button>
      </div>
    </form>
  );
}