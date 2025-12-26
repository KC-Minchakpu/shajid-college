'use client';

import { useForm } from 'react-hook-form';
import { useFormContext } from '@/context/MultiStepContext';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

// 1. Define the strictly typed interface for form fields
interface PersonalInfoInputs {
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  contactAddress: string;
  dateOfBirth: string;
  parentsName: string;
  parentsContactAddress: string;
  passport: FileList;
}

interface Step1Props {
  savedData?: Partial<PersonalInfoInputs> & { passportPreview?: string };
}

export default function Step1PersonalInfo({ savedData }: Step1Props) {
  const { register, handleSubmit, setValue } = useForm<PersonalInfoInputs>();
  const { updatePersonalInfo } = useFormContext();
  const router = useRouter();
  
  // State for the image preview (Base64 string)
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Load saved data on mount
  useEffect(() => {
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        if (key !== 'passportPreview') {
          setValue(key as keyof PersonalInfoInputs, value as any);
        }
      });
      if (savedData.passportPreview) {
        setPreview(savedData.passportPreview);
      }
    }
  }, [savedData, setValue]);

  // 3. Handle Image Selection with Next.js Optimization logic
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Size (e.g., max 1MB for passports)
    if (file.size > 1024 * 1024) {
      toast.error("Passport size must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Sync the file with react-hook-form
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue('passport', dataTransfer.files);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: PersonalInfoInputs) => {
    setIsSaving(true);
    try {
      // Update Context
      updatePersonalInfo({
        ...data,
        passportFile: data.passport?.[0],
        passportPreview: preview || undefined,
      });

      // Save to Backend
      const response = await fetch('/api/form/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1, data: { ...data, passportPreview: preview } }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Personal info saved!");
      router.push('/apply/step-2-health-info');
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Full Name</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('fullName')} placeholder="Surname First" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Gender</label>
          <select className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('gender')} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Email Address</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('email')} type="email" placeholder="email@example.com" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Phone Number</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('phone')} placeholder="08012345678" required />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold mb-1">Contact Address</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('contactAddress')} placeholder="Residential Address" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Date of Birth</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('dateOfBirth')} type="date" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Next of Kin Name</label>
          <input className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" {...register('parentsName')} placeholder="Parent/Guardian Name" required />
        </div>
      </div>

      {/* Passport Upload Section */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-dashed border-blue-200">
        <label className="block text-sm font-bold text-blue-800 mb-2">
          Passport Photograph (Red Background Required)
        </label>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!preview}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />

          {preview && (
            <div className="relative w-32 h-40 border-4 border-white shadow-lg rounded-md overflow-hidden bg-gray-200">
              <Image 
                src={preview} 
                alt="Passport Preview" 
                fill
                className="object-cover"
                unoptimized // Since it is a base64 string
              />
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg active:transform active:scale-[0.98] disabled:bg-gray-400"
      >
        {isSaving ? 'Processing...' : 'Save & Continue to Health Info'}
      </button>
    </form>
  );
}