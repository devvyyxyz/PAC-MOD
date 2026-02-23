import React from 'react';
import styles from './Card.module.css';

type CardProps = React.PropsWithChildren<{
  title?: string;
  className?: string;
  overlayLabel?: string | null;
}>;

export default function Card({ title, children, className, overlayLabel = null }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`.trim()}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
      {overlayLabel ? (
        <div className={styles.overlay} aria-hidden>
          <div className={styles.overlayInner}>{overlayLabel}</div>
        </div>
      ) : null}
    </div>
  );
}
