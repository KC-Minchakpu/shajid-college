import styles from "./ApplyPage.module.css";

const ApplyPage = () => {
  return (
    <div className={styles.page}>
     {/* Main Content */}
        <main className={styles.container}>
        <h1 className={styles.title}>
    Apply to study at Shajid Royal College of Nursing and Midwifery
    </h1>

  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Applicant Account</h2>
    <p className={styles.sectionParagraph}>
      You will need an applicant account to log in and complete your application.
    </p>

    <ul className={styles.list}>
      <li>
        If you are a new applicant to Shajid Royal College of Nursing and
        Midwifery, please select{" "}
        <strong>&quot;Create Account&quot;</strong> on the application
        portal and follow the instructions provided.
      </li>
      <li>
        If you already have an applicant account but cannot remember your login
        details, click{" "}
        <strong>&quot;Forgot Password&quot;</strong> to reset your credentials.
        Please do not create a new account.
      </li>
    </ul>

    <button className={styles.applyButton}>Apply Now</button>
  </section>

  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Programme Selection</h2>
    <p className={styles.sectionParagraph}>
      The information you provide in your application will help us determine
      your eligibility and recommend the appropriate nursing or midwifery
      programme. You will confirm your final programme choice before submission.
    </p>
  </section>

  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Current Students</h2>
    <p className={styles.sectionParagraph}>
      If you are currently enrolled at Shajid Royal College of Nursing and
      Midwifery, please <strong>DO NOT</strong> submit a new application. Log in
      to the student portal to manage your academic records and resolve any
      outstanding issues.
    </p>
  </section>
</main>
 </div>
  );
};

export default ApplyPage;
