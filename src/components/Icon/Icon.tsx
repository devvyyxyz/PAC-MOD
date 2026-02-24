import React from 'react';
import styles from './Icon.module.css';

type IconName = 'play' | 'pause' | 'close' | 'menu' | 'settings' | 'coin' | 'ghost';

export default function Icon({ name, size = 20, className = '', title, onClick }: { name: IconName; size?: number; className?: string; title?: string; onClick?: () => void }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  const cls = `${styles.icon} ${onClick ? styles.clickable : ''} ${className}`.trim();
  const src = `/assets/icons/${name}.svg`;
  return (
    <img src={src} width={size} height={size} className={cls} onClick={onClick} aria-label={title} alt={title || name} />
  );
}
