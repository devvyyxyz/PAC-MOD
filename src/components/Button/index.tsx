import React from 'react';
import styles from './Button.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  full?: boolean;
};

export default function Button({variant='secondary', full=false, className, children, ...rest}: Props){
  const cls = [
    styles.btn,
    className || '',
    variant === 'primary' ? styles.primary : '',
    variant === 'secondary' ? styles.secondary : '',
    full ? styles.full : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
