'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, PrinterIcon, HomeIcon } from '@heroicons/react/24/solid';

// This small component generates the ID. Because it's called inside 
// the main component, we will use a "lazy" state initialization 
// which React 19 prefers over useEffect.
function ApplicationId() {
  const [id] = useState(() => {
    // Lazy initialization: This function only runs ONCE during the first render
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SON/${year}/${random}`;
  });

  return <span className="text-3xl font-mono font-bold text-blue-600">{id}</span>;
}

export default function SuccessPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8 border border-green-50">
        
        {/* Animated Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircleIcon className="w-20 h-20 text-green-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900">Submission Received!</h1>
          <p className="text-gray-500 text-lg">
            Congratulations, {session?.user?.name || 'Applicant'}! Your application has been successfully submitted.
          </p>
        </div>

        {/* Application Number Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Application Number</p>
          <ApplicationId />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-black transition-all print:hidden"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Slip
          </button>
          
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 print:hidden"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 italic">
           An email confirmation has been sent to your registered email address. 
           Please check your inbox (and spam folder) for further instructions. 
        </p>
      </div>
    </div>
  );
}