'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

// 1. Validation Schema
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

  const inputClass = "w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Step 2: Health Information</h2>
        <p className="text-sm text-gray-500">This information is required for medical records.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Do you have any chronic illness? (Enter &apos;None&apos; if none)</label>
          <textarea 
            {...register('chronicIllness')} 
            className={inputClass}
            placeholder="e.g. Asthma, Diabetes, or None"
            rows={2}
          />
          {errors.chronicIllness && <p className="text-red-500 text-xs mt-1">{errors.chronicIllness.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Blood Group</label>
            <select {...register('bloodGroup')} className={inputClass}>
              <option value="">Select...</option>
              {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Genotype</label>
            <select {...register('genotype')} className={inputClass}>
              <option value="">Select...</option>
              {['AA', 'AS', 'SS', 'AC', 'SC'].map(gt => (
                <option key={gt} value={gt}>{gt}</option>
              ))}
            </select>
            {errors.genotype && <p className="text-red-500 text-xs mt-1">{errors.genotype.message}</p>}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Emergency Contact Number</label>
          <input 
            type="tel" 
            {...register('emergencyContact')} 
            className={inputClass}
            placeholder="080..." 
          />
          {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.message}</p>}
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
          {isSaving ? 'Saving...' : 'Next Step: Schools'}
        </button>
      </div>
    </form>
  );
}