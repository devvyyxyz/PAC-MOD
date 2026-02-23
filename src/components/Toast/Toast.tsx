import React from 'react';
import styles from './Toast.module.css';

type ToastProps = {
  id: string | number;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'error';
  onClose: (id: string | number) => void;
};

export default function Toast({ id, title, message, type = 'info', onClose }: ToastProps){
  return (
    <div className={`${styles.toast} ${styles[type] || ''}`} role="status" aria-live="polite">
      <div className={styles.meta}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {message ? <div className={styles.body}>{message}</div> : null}
      </div>
      <button className={styles.close} onClick={() => onClose(id)} aria-label="dismiss">×</button>
    </div>
  );
}
