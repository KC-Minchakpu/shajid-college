
import Image from 'next/image';
import Links from "./links/Links";
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Shajid College Logo" className={styles.logoImage} width={314} height={81} />
      </div>
      <div>
        <Links />
      </div>
    </div>
  );
};

export default Navbar;