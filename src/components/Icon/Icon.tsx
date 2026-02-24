import React from 'react';
import styles from './Icon.module.css';
import ICONS from '../../config/icons';

type IconName = keyof typeof ICONS;

export default function Icon({ name, size = 20, className = '', title, onClick }: { name: IconName; size?: number; className?: string; title?: string; onClick?: () => void }){
  const cls = `${styles.icon} ${onClick ? styles.clickable : ''} ${className}`.trim();
  const cfg = (ICONS as any)[name] || { src: `/assets/icons/${name}.svg` };
  const src = cfg.src || `/assets/icons/${name}.svg`;
  const style: React.CSSProperties = {};
  if(cfg.color) style.color = cfg.color;
  return (
    <img src={src} width={size} height={size} className={cls} onClick={onClick} aria-label={title} alt={title || name} style={style} />
  );
}
