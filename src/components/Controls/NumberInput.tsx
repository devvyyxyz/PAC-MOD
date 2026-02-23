import React from 'react';
import styles from './Controls.module.css';

type Props = {
  value: number;
  onChange: (n:number)=>void;
  disabled?: boolean;
  saved?: boolean;
};

export default function NumberInput({value,onChange,disabled,saved}:Props){
  return (
    <div className={styles.wrap}>
      <input type="number" className={styles.input} value={value} onChange={(e)=>onChange(parseInt(e.target.value||'0'))} disabled={disabled} />
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
