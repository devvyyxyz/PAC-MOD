import React from 'react';
import styles from './Icon.module.css';

type IconName = 'play' | 'pause' | 'close' | 'menu' | 'settings' | 'coin' | 'ghost';

export default function Icon({ name, size = 20, className = '', title, onClick }: { name: IconName; size?: number; className?: string; title?: string; onClick?: () => void }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  const cls = `${styles.icon} ${onClick ? styles.clickable : ''} ${className}`.trim();

  switch(name){
    case 'play':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <rect x="6" y="5" width="4" height="14" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" fill="currentColor" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" fill="currentColor" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a1 1 0 0 1-1.41 1.41l-.06-.06a1.7 1.7 0 0 0-1.82-.33 1.7 1.7 0 0 0-1 .9 1.7 1.7 0 0 1-2.97 0 1.7 1.7 0 0 0-1-.9 1.7 1.7 0 0 0-1.82.33l-.06.06a1 1 0 1 1-1.41-1.41l.06-.06A1.7 1.7 0 0 0 5 15a1.7 1.7 0 0 0-.9-1 1.7 1.7 0 0 1 0-2.97 1.7 1.7 0 0 0 .9-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06A1 1 0 0 1 5.88 4.7l.06.06A1.7 1.7 0 0 0 7.76 6a1.7 1.7 0 0 0 1 .9 1.7 1.7 0 0 1 2.97 0 1.7 1.7 0 0 0 1-.9A1.7 1.7 0 0 0 13.5 4.7l.06-.06a1 1 0 1 1 1.41 1.41l-.06.06A1.7 1.7 0 0 0 16 7.76a1.7 1.7 0 0 0 1 .9 1.7 1.7 0 0 1 0 2.97 1.7 1.7 0 0 0-.9 1A1.7 1.7 0 0 0 19.4 15z" fill="currentColor" opacity="0.9" />
        </svg>
      );
    case 'coin':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
    case 'ghost':
      return (
        <svg {...common} className={cls} onClick={onClick} aria-label={title}>
          <path d="M4 18V9a8 8 0 1 1 16 0v9l-3-2-3 2-3-2-3 2-1-1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
