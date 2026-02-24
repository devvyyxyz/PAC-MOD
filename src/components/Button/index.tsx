import React from 'react';
import styles from './Button.module.css';
import Icon from '../Icon/Icon';
import { playSfx } from '../../utils/audio';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  full?: boolean;
  icon?: string;
  // optional sfx name to play on activation; set to null to disable
  sfx?: string | null;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(function Button({variant='secondary', full=false, className, children, icon, sfx='uiClick', onClick, ...rest}: Props, ref){
  const cls = [
    styles.btn,
    className || '',
    variant === 'primary' ? styles.primary : '',
    variant === 'secondary' ? styles.secondary : '',
    full ? styles.full : '',
  ].filter(Boolean).join(' ');

  function handleClick(e: React.MouseEvent<HTMLButtonElement>){
    try{ if(sfx) playSfx(sfx as string); }catch(e){}
    try{ onClick && onClick(e); }catch(e){}
  }

  return (
    <button ref={ref} className={cls} onClick={handleClick} {...rest}>
      {icon ? <span className={styles.iconWrap}><Icon name={icon as any} size={18} /></span> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
