'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { examSubjects } from '@/constants/subjects'; 

const subjectSchema = z.object({
  subject: z.string().min(1, 'Required'),
  grade: z.string().min(1, 'Required'),
});

const sittingSchema = z.object({
  examType: z.string().min(1, 'Select exam type'),
  examYear: z.string().length(4, 'Must be 4 digits'),
  examNumber: z.string().min(5, 'Invalid Exam Number'),
  subjects: z.array(subjectSchema).min(5, 'At least 5 subjects required'),
});

const schema = z.object({
  sitting1: sittingSchema,
  sitting2: sittingSchema.optional().or(z.literal(null)),
});

type ExamFormInputs = z.infer<typeof schema>;

export default function Step4ExamResults() {
  const { formData, updatePersonalInfo } = useFormContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      sitting1: formData.sitting1 || { 
        examType: '', examYear: '', examNumber: '', 
        subjects: Array(5).fill({ subject: '', grade: '' }) 
      },
      sitting2: formData.sitting2 || undefined,
    },
  });

  const { fields: subjects1, append: append1, remove: remove1 } = useFieldArray({ control, name: 'sitting1.subjects' });
  const { fields: subjects2, append: append2, remove: remove2 } = useFieldArray({ control, name: 'sitting2.subjects' });

  const onSubmit = async (formValues: ExamFormInputs) => {
    setIsSaving(true);
    try {
      updatePersonalInfo(formValues);
      const response = await fetch('/api/apply/step-4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, data: formValues }),
      });
      if (!response.ok) throw new Error("Failed to save");
      toast.success("Exam results saved!");
      router.push('/apply/step-5-program-details');
    } catch (error) {
      toast.error("Error saving exam results.");
    } finally {
      setIsSaving(false);
    }
  };

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];
  const inputClass = "border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Step 4: O&apos;Level Results</h2>
      </div>

      {/* SITTING 1 */}
      <section className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-blue-700 text-sm uppercase">First Sitting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" {...register('sitting1.examYear')} className={inputClass} placeholder="Year" />
          <input type="text" {...register('sitting1.examNumber')} className={inputClass} placeholder="Exam Number" />
          <select {...register('sitting1.examType')} className={inputClass}>
            <option value="">Exam Type</option>
            <option value="WAEC">WAEC</option>
            <option value="NECO">NECO</option>
          </select>
        </div>

        <div className="space-y-2">
          {subjects1.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <select {...register(`sitting1.subjects.${index}.subject`)} className={`${inputClass} flex-2`}>
                <option value="">Select Subject</option>
                {/* FIXED: Added explicit string type here */}
                {examSubjects.map((subject: string) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select {...register(`sitting1.subjects.${index}.grade`)} className={`${inputClass} flex-1`}>
                <option value="">Grade</option>
                {gradeOptions.map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={() => append1({ subject: '', grade: '' })} className="text-blue-600 text-sm">+ Add Subject</button>
        </div>
      </section>

      {/* ... SITTING 2 follows same pattern ... */}

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={() => router.back()} className="text-gray-500">Back</button>
        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 rounded-lg">
          {isSaving ? 'Saving...' : 'Next Step'}
        </button>
      </div>
    </form>
  );
}