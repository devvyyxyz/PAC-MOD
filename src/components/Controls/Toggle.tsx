import React from 'react';
import styles from './Controls.module.css';

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  saved?: boolean;
  label?: React.ReactNode;
};

export default function Toggle({checked, onChange, disabled, saved, label}: Props){
  return (
    <div className={styles.wrap}>
      <label style={{display:'flex',alignItems:'center',gap:8}}>
        <input className={styles.checkbox} type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} disabled={disabled} />
        <span className={styles.label}>{label}</span>
      </label>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
