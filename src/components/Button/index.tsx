import React from 'react';
import styles from './Button.module.css';
import Icon from '../Icon/Icon';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  full?: boolean;
  icon?: string;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(function Button({variant='secondary', full=false, className, children, icon, ...rest}: Props, ref){
  const cls = [
    styles.btn,
    className || '',
    variant === 'primary' ? styles.primary : '',
    variant === 'secondary' ? styles.secondary : '',
    full ? styles.full : '',
  ].filter(Boolean).join(' ');

  return (
    <button ref={ref} className={cls} {...rest}>
      {icon ? <span className={styles.iconWrap}><Icon name={icon as any} size={18} /></span> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
