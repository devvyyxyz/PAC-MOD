import React from 'react';
import styles from './Menu.module.css';
import { useI18n, Layout } from '../../components';
import Title from '../Title';
import { playChomp } from '../../utils/audio';
import Button from '../Button';

type Props = { onStart?: () => void, onOpenSettings?: ()=>void, onOpenCredits?: ()=>void, onError?: ()=>void };

export default function Menu({onStart, onOpenSettings, onOpenCredits, onError}: Props) {
  const [starting, setStarting] = React.useState(false);
  const { t } = useI18n();

  function handleStart() {
    if (starting) return;
    playChomp();
    setStarting(true);
    setTimeout(() => { if (onStart) onStart(); }, 600);
  }

  function handleSettings(){ playChomp(); if(onOpenSettings) onOpenSettings(); }
  function handleCredits(){ playChomp(); if(onOpenCredits) onOpenCredits(); }
  function handleError(){ if(onError) onError(); }

  return (
    <div className={`${styles.wrap} ${starting ? styles.starting : ''}`}>
      <div className={styles.bg} aria-hidden />
      <Layout stageClassName={styles.stage}>
            <div className={styles.title}>
              <Title title={"Game Template"} subtitle={t('menu_subtitle')} className={styles.title} />
            </div>

        <div className={styles.controls} role="navigation" aria-label="Main menu">
          <Button variant="primary" className={styles.menuButton} onClick={handleStart} autoFocus aria-disabled={starting}>{starting ? t('starting') : t('start_game')}</Button>

          <div className={styles.row}>
            <Button variant="secondary" className={styles.menuButton} onClick={handleSettings}>{t('menu_settings')}</Button>
            <Button variant="secondary" className={styles.menuButton} onClick={handleCredits}>{t('menu_credits')}</Button>
            <Button variant="secondary" className={styles.menuButton} onClick={handleError}>{t('menu_simulate_error')}</Button>
          </div>
        </div>

        <div className={styles.footer}>{t('menu_footer')}</div>
      </Layout>
    </div>
  );
}
