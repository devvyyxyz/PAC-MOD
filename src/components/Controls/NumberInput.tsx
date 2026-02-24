import React from 'react';
import styles from './Controls.module.css';

type Props = {
  value: number;
  onChange: (n:number)=>void;
  disabled?: boolean;
  saved?: boolean;
};

export default function NumberInput({value,onChange,disabled,saved}:Props){
  function dec(){ if(disabled) return; onChange(Number(value) - 1); }
  function inc(){ if(disabled) return; onChange(Number(value) + 1); }

  return (
    <div className={styles.wrap}>
      <div className={styles.numCtrl} role="group" aria-label="number input">
        <button type="button" className={styles.numBtn} onClick={dec} disabled={disabled} aria-label="decrement">−</button>
        <div className={styles.numValue} aria-live="polite">{value}</div>
        <button type="button" className={styles.numBtn} onClick={inc} disabled={disabled} aria-label="increment">+</button>
      </div>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
