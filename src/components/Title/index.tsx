import React from 'react';
import styles from './Title.module.css';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  sticky?: boolean;
  className?: string;
};

export default function Title({title, subtitle, sticky, className}: Props){
  return (
    <div className={`${styles.titleWrap} ${className || ''}`}>
      <div className={sticky ? styles.sticky : undefined} aria-hidden={false}>
        <h1 className={styles.name}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
    </div>
  );
}
