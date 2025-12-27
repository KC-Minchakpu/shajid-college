'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect the route: if unauthenticated, redirect to sign-in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className={styles.loadingContainer}>Loading Portal...</div>;
  }

  const userStatus = session?.user?.role || 'pending';

  return (
    <div className={styles.dashboardWrapper}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <Image src="/shajid-logo.png" alt="Logo" width={50} height={50} />
          <span>Shajid College Portal</span>
        </div>
        <div className={styles.userInfo}>
          <span>{session?.user?.name}</span>
          <div className={styles.statusBadge}>{userStatus.toUpperCase()}</div>
        </div>
      </nav>

      <main className={styles.content}>
        <header className={styles.welcomeHeader}>
          <h1>Applicant Dashboard</h1>
          <p>Manage your admission process and academic records here.</p>
        </header>

        <div className={styles.grid}>
          {/* 1. Admission Card - DYNAMIC */}
          <div className={styles.card}>
            <h3>Admission & Application</h3>
            <p>Track your current application progress.</p>
            
            <div className={styles.actionArea}>
              {userStatus === 'pending' && (
                <>
                  <p className={styles.infoText}>You haven&apos;t started your application yet.</p>
                  <Link href="/apply/step-1" className={styles.primaryBtn}>
                    Begin Application
                  </Link>
                </>
              )}

              {userStatus === 'submitted' && (
                <div className={styles.alertBox}>
                  <p>Your application is currently <strong>Under Review</strong>. Check back later for updates.</p>
                </div>
              )}

              {userStatus === 'admitted' && (
                <div className={styles.successBox}>
                  <p>Congratulations! You have been offered admission.</p>
                  <Link href="/admission/letter" className={styles.secondaryBtn}>
                    Download Admission Letter
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 2. Academics Card - LOCKED UNTIL ADMITTED */}
          <div className={`${styles.card} ${userStatus !== 'admitted' ? styles.locked : ''}`}>
            <h3>Academic Records</h3>
            <p>Register courses and check results.</p>
            {userStatus === 'admitted' ? (
              <Link href="/academics/registration" className={styles.primaryBtn}>
                Register Courses
              </Link>
            ) : (
              <p className={styles.lockText}>🔒 Available after admission</p>
            )}
          </div>

          {/* 3. Payments Card */}
          <div className={styles.card}>
            <h3>Payments & Finance</h3>
            <p>View your transaction history and pay fees.</p>
            <Link href="/dashboard/payments" className={styles.outlineBtn}>
              View Receipts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}