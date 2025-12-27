'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './create-account.module.css';

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Added Type Safety for input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    // 1. Client-side validation: Password length
    if (form.password.length < 9) {
      toast.error('Password must be at least 9 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success('Account created! Please verify your email.');
        // Redirect to Sign In so they can log in after verification
        setTimeout(() => router.push('/sign-in'), 2000);
      } else {
        toast.error(data.error || 'Account creation failed');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.container}>
        
        {/* Logo at the top */}
        <div className={styles.logoContainer}>
          <Image 
            src="/shajid-logo.png" 
            alt="Shajid College Logo" 
            width={100} 
            height={100} 
            priority
          />
        </div>

        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subtitle}>Applicant Registration Portal</p>

        <input
          name="name"
          type="text"
          placeholder="Full Name (Surname First)"
          value={form.name}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 9 characters)"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className={styles.link}>
          Already have an account?{' '}
          <Link href="/sign-in">Sign In</Link>
        </p>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}