// src/components/StepIndicator.tsx
'use client';

import { usePathname } from 'next/navigation';

const steps = [
  { id: 1, name: 'Personal', path: '/apply/step-1' },
  { id: 2, name: 'Health', path: '/apply/step-2' },
  { id: 3, name: 'Schools', path: '/apply/step-3' },
  { id: 4, name: 'Exams', path: '/apply/step-4' },
  { id: 5, name: 'Program', path: '/apply/step-5' },
  { id: 6, name: 'UTME', path: '/apply/step-6' },
  { id: 7, name: 'Review', path: '/apply/step-7' },
];

export default function StepIndicator() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between mb-8 px-4 py-2 bg-gray-50 rounded-lg">
      {steps.map((step) => {
        const isActive = pathname.includes(step.path);
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step.id}
            </div>
            <span className={`text-xs mt-1 hidden md:block ${
              isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
        );
      })}
    </nav>
  );
}