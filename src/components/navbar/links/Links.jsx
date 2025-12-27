'use client';

import styles from './links.module.css';
import NavLink from './navLink/navLink';

const Links = () => {
  const links = [
    { title: 'HOME', path: '/' },
    { title: 'SIGN IN', path: '/sign-in' },
    { title: 'CREATE ACCOUNT', path: '/create-account' },
    { title: 'APPLY NOW', path: '/application' },
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