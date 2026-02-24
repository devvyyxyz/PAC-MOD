import React from 'react';
import styles from './Controls.module.css';

type Props = {
  value: number;
  onChange: (n:number)=>void;
  disabled?: boolean;
  saved?: boolean;
  controlScheme?: 'arrow'|'wasd';
};

export default function NumberInput({value,onChange,disabled,saved}:Props){
  const min = 0;
  const max = 99;
  const scheme = (arguments[0] as any)?.controlScheme || 'arrow';

  function dec(){ if(disabled) return; const next = Math.max(min, Number(value) - 1); onChange(next); }
  function inc(){ if(disabled) return; const next = Math.min(max, Number(value) + 1); onChange(next); }

  function onKey(e: React.KeyboardEvent){
    const k = (e.key || '').toLowerCase();
    const up = scheme === 'wasd' ? 'w' : 'arrowup';
    const down = scheme === 'wasd' ? 's' : 'arrowdown';
    if(k === up){ e.preventDefault(); inc(); }
    else if(k === down){ e.preventDefault(); dec(); }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.numCtrl} role="spinbutton" aria-label="number input" tabIndex={0} onKeyDown={onKey} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Number(value)}>
        <button type="button" className={styles.numBtn} onClick={dec} disabled={disabled} aria-label="decrement">−</button>
        <div className={styles.numValue} aria-live="polite">{value}</div>
        <button type="button" className={styles.numBtn} onClick={inc} disabled={disabled} aria-label="increment">+</button>
      </div>
      {saved ? <div className={styles.saved}>Saved</div> : null}
    </div>
  );
}
