import React from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Credits.module.css';
import CREDITS from '../../config/credits';
import { useI18n, Grid } from '../../components';
import Title from '../../components/Title';

export default function Credits({onBack}:{onBack:()=>void}){
  const { t } = useI18n();
  return (
    <div className={`${menuStyles.wrap} ${styles.pageWrap}`}>
      <div className={menuStyles.bg} aria-hidden />
      <div className={menuStyles.stage} role="main">
        <Title title={t('credits_title')} subtitle={t('credits_subtitle')} sticky className={`${menuStyles.title} ${styles.stickyTitle}`} />

        <Grid className={styles.cards} columns={{sm:1,md:2,lg:3}} gap={16}>
          {CREDITS.map(c => {
            const CardInner = (
              <div className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon} aria-hidden>
                      {c.icon ? <img src={c.icon} alt="" style={{width:28,height:28}}/> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd84d" strokeWidth="1.5"><circle cx="12" cy="12" r="6" /></svg>}
                    </div>
                    <div>
                      <h4 className={styles.cardTitle}>{c.name}</h4>
                      {c.role && <div className={styles.cardRole}>{c.role}</div>}
                    </div>
                  </div>
                  {c.note && <div className={styles.cardNote}>{c.note}</div>}
                </div>
                {c.url && <div className={styles.cardFooter}><div className={styles.cardLink}>{t('visit')}</div></div>}
              </div>
            );

            if(c.url){
              return (
                <a key={c.id} className={styles.cardLinkWrap} href={c.url} target="_blank" rel="noopener noreferrer">
                  {CardInner}
                </a>
              );
            }

            return <div key={c.id}>{CardInner}</div>;
          })}
        </Grid>

        <div style={{marginTop:18,width:'100%',display:'flex',justifyContent:'center'}}>
          <Button variant="secondary" onClick={onBack}>{t('return_menu')}</Button>
        </div>

        <div className={menuStyles.footer} style={{width:'100%',textAlign:'center'}}>{t('credits_footer')}</div>
      </div>
    </div>
  );
}
