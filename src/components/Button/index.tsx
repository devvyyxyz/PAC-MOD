import React from 'react';
import styles from './Button.module.css';

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
      {icon ? <span className={styles.iconWrap}><img src={`/assets/icons/${icon}.svg`} alt="" width={18} height={18} style={{display:'block'}}/></span> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
