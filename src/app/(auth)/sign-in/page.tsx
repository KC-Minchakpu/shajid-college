'use client';

// 1. Added getSession to the imports
import { signIn, getSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './sign-in.module.css';

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        ...form,
        redirect: false,
      });

      if (res?.ok) {
        // 2. Use getSession() instead of fetch('/api/auth/session')
        const session = await getSession();
        
        // Use optional chaining to safely check the role
        const userRole = session?.user?.role;

        if (userRole === 'applicant') {
          toast.success('Signed in successfully');
          // Redirect to Step 1
          setTimeout(() => router.push('/apply/step-1'), 1000);
        } else {
          setLoading(false);
          toast.error('Only applicants can sign in here');
        }
      } else {
        setLoading(false);
        if (res?.error === 'Please verify your email before signing in.') {
          toast.error('Email not verified');
          setTimeout(() => {
            router.push(`/auth/email-verification-failed?email=${encodeURIComponent(form.email)}`);
          }, 1000);
        } else {
          toast.error('Invalid email or password');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.container}>
        
        <div className={styles.logoContainer}>
          <Image
            src="/shajid-logo.png"
            alt="Shajid College Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Nursing & Midwifery Portal</p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <button 
          type="submit" 
          disabled={loading} 
          className={styles.submitButton}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className={styles.link}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/create-account">
            Create Account
          </Link>
        </p>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}