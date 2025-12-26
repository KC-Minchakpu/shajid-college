'use client';

import { usePaystackPayment } from 'react-paystack';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ReviewProps {
  email: string;
  amount: number;
}

export default function ReviewAndPayClient({ email, amount }: ReviewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Define your handlers first
  const onSuccess = (reference: any) => {
    setLoading(false);
    toast.success("Payment Received! Application Submitted.");
    router.push('/dashboard?status=success');
  };

  const onClose = () => {
    setLoading(false);
    toast.info("Transaction cancelled.");
  };

  // 2. The Config
  const config = {
    reference: `NURS-${new Date().getTime()}`,
    email: email,
    amount: amount * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY as string,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    setLoading(true);
    
    // 3. Pass the handlers here to satisfy the 1-argument requirement
    initializePayment({ onSuccess, onClose });
  };

  return (
    <div className="border-t pt-6">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay Application Fee (₦${amount.toLocaleString()})`}
      </button>
    </div>
  );
}