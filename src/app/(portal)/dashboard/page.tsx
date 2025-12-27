'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ClipboardDocumentCheckIcon, 
  AcademicCapIcon, 
  CreditCardIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div className={styles.loading}>Loading Portal...</div>;

  // Mock status - In a real app, this comes from session.user.status
  const applicationStatus = session?.user?.status || 'pending'; 

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.header}>
        <h1>Welcome, {session?.user?.name}</h1>
        <p>Student ID: {session?.user?.email}</p>
      </header>

      <div className={styles.grid}>
        {/* SECTION 1: ADMISSIONS (Changes based on status) */}
        <div className={styles.card}>
          <ClipboardDocumentCheckIcon className={styles.icon} />
          <h3>Admission Status</h3>
          
          {applicationStatus === 'pending' && (
            <>
              <p>You have not started your application yet.</p>
              <Link href="/apply/step-1" className={styles.actionButton}>
                Begin Application
              </Link>
            </>
          )}

          {applicationStatus === 'submitted' && (
            <div className={styles.statusBadge}>
              <p>Application Submitted. Please check back later for admission status.</p>
            </div>
          )}

          {applicationStatus === 'admitted' && (
            <div className={styles.successBadge}>
              <p>Congratulations! You have been offered admission.</p>
              <Link href="/admission-letter" className={styles.link}>Download Letter</Link>
            </div>
          )}
        </div>

        {/* SECTION 2: ACADEMICS (Only active if Admitted) */}
        <div className={`${styles.card} ${applicationStatus !== 'admitted' ? styles.disabled : ''}`}>
          <AcademicCapIcon className={styles.icon} />
          <h3>Academics</h3>
          <p>Course registration, Timetables, and Result checking.</p>
          {applicationStatus === 'admitted' ? (
            <Link href="/academics/register" className={styles.actionButton}>Register Courses</Link>
          ) : (
            <span className={styles.lockedText}>Locked until Admission</span>
          )}
        </div>

        {/* SECTION 3: PAYMENTS */}
        <div className={styles.card}>
          <CreditCardIcon className={styles.icon} />
          <h3>Finance</h3>
          <p>Pay application fees, tuition, and view receipts.</p>
          <Link href="/finance/history" className={styles.actionButton}>View Payments</Link>
        </div>
      </div>
    </div>
  );
}