'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './step2.module.css';

const SUBJECTS = ["English Language", "Mathematics", "Biology", "Chemistry", "Physics", "Agricultural Science", "Geography", "Economics", "Civic Education"];
const GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

export default function Step2Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State for the exam sitting
  const [examInfo, setExamInfo] = useState({
    examType: 'WAEC',
    examYear: '',
    examNumber: '',
  });

  // State for subjects (Start with 5 empty rows)
  const [results, setResults] = useState(
    Array(5).fill({ subject: '', grade: '' })
  );

  const handleResultChange = (index: number, field: string, value: string) => {
    const updatedResults = [...results];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    setResults(updatedResults);
  };

  const addSubjectRow = () => setResults([...results, { subject: '', grade: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/apply/save-step-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examInfo, results: results.filter(r => r.subject && r.grade) }),
      });

      if (res.ok) {
        toast.success('Educational history saved!');
        router.push('/apply/step-3'); 
      } else {
        toast.error('Failed to save data');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '50%' }}></div></div>
        
        <h2>Step 2: Educational History</h2>
        <p className={styles.subtitle}>Enter your O'Level results. You can add more rows if needed.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Exam Type</label>
              <select value={examInfo.examType} onChange={(e) => setExamInfo({...examInfo, examType: e.target.value})}>
                <option value="WAEC">WAEC</option>
                <option value="NECO">NECO</option>
                <option value="NABTEB">NABTEB</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Exam Year</label>
              <input type="text" placeholder="e.g. 2023" onChange={(e) => setExamInfo({...examInfo, examYear: e.target.value})} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Exam Number</label>
            <input type="text" placeholder="e.g. 421030..." onChange={(e) => setExamInfo({...examInfo, examNumber: e.target.value})} required />
          </div>

          <h3 className={styles.sectionTitle}>Subjects & Grades</h3>
          {results.map((result, index) => (
            <div key={index} className={styles.resultRow}>
              <select 
                value={result.subject} 
                onChange={(e) => handleResultChange(index, 'subject', e.target.value)}
                className={styles.subjectSelect}
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select 
                value={result.grade} 
                onChange={(e) => handleResultChange(index, 'grade', e.target.value)}
                className={styles.gradeSelect}
              >
                <option value="">Grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ))}

          <button type="button" onClick={addSubjectRow} className={styles.addBtn}>+ Add Subject</button>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => router.back()} className={styles.backBtn}>Back</button>
            <button type="submit" disabled={loading} className={styles.nextBtn}>
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}