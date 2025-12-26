'use client';

import styles from './links.module.css';
import NavLink from './navLink/navLink';

const Links = () => {
  const links = [
    { title: 'HOME', path: '/' },
    { title: 'SIGN IN', path: '/auth/sign-in' },
    { title: 'CREATE ACCOUNT', path: '/auth/create-account' },
    { title: 'APPLY NOW', path: '/apply' },
  ];

  return (
    <div className={styles.links}>
      {links.map((link) => (
       <NavLink item={link} key={link.title}/>
      ))}
    </div>
  );
};

export default Links;