import React from 'react';
import styles from './Card.module.css';

type CardProps = React.PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export default function Card({ title, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`.trim()}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
