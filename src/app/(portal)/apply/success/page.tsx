'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, PrinterIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useFormContext } from '@/context/MultiStepContext';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import styles from './success.module.css';

function ApplicationId() {
  const [id] = useState(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SON/${year}/${random}`;
  });

  return <span className={styles.idValue}>{id}</span>;
}

export default function SuccessPage() {
  const { data: session } = useSession();
  const { formData } = useFormContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateStyledPDF(formData);
      download(pdfBytes, `Nursing_Application_Slip.pdf`, 'application/pdf');
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle}>
            <CheckCircleIcon className={styles.icon} />
          </div>
        </div>

        <div className={styles.titleSection}>
          <h1>Submission Received!</h1>
          <p>
            Congratulations, {session?.user?.name || 'Applicant'}! Your application has been successfully submitted.
          </p>
        </div>

        <div className={styles.idCard}>
          <p className={styles.idLabel}>Application Number</p>
          <ApplicationId />
        </div>

        <div className={styles.buttonGrid}>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={styles.printBtn}
          >
            <PrinterIcon className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Download Slip'}
          </button>
          
          <Link href="/dashboard" className={styles.dashboardLink}>
            <HomeIcon className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <p className={styles.footerNote}>
           An email confirmation has been sent to your registered email address. 
           Please check your inbox (and spam folder) for further instructions. 
        </p>
      </div>
    </div>
  );
}