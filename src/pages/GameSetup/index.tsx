import React, {useState} from 'react';
import styles from './GameSetup.module.css';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import { useI18n, Layout, Grid } from '../../components';

export type GameOptions = {
  skin: string;
  difficulty: 'easy'|'normal'|'hard';
  sound: boolean;
  music: boolean;
}

export default function GameSetup({onPlay, onBack}:{onPlay:(opts:GameOptions)=>void; onBack:()=>void}){
  const { t } = useI18n();
  const skins = [
    {id:'classic', color:'#ffd84d'},
    {id:'neon', color:'#00f0ff'},
    {id:'ghost', color:'#ff6b8a'},
  ];

  const [skin,setSkin] = useState(skins[0].id);
  const [difficulty,setDifficulty] = useState<GameOptions['difficulty']>('normal');
  const [sound,setSound] = useState(true);
  const [music,setMusic] = useState(true);

  return (
    <Layout title={t('setup_title')}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <Grid columns={{sm:1,md:2}} gap={16}>
            <div className={styles.left}>
          <h3 className={styles.title}>{t('setup_title')}</h3>
          <p className={styles.label}>{t('choose_skin')}</p>
          <div className={styles.skins}>
            {skins.map(s => (
              <div key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={skin===s.id}
                onClick={()=>setSkin(s.id)}
                onKeyDown={(e)=>{ if(e.key==='Enter') setSkin(s.id)}}
                className={`${styles.skin} ${skin===s.id?styles.selected:''}`}
                style={{background:s.color}}
                title={t(`skin_${s.id}`)}
                aria-label={t(`skin_${s.id}`)}
              />
            ))}
          </div>

          <div style={{height:12}} />

          <div className={styles.controls}>
            <div>
              <div className={styles.label}>{t('difficulty')}</div>
              <div className={styles.row}>
                <label className={styles.small}><input type="radio" name="diff" checked={difficulty==='easy'} onChange={()=>setDifficulty('easy')} /> {t('diff_easy')}</label>
                <label className={styles.small}><input type="radio" name="diff" checked={difficulty==='normal'} onChange={()=>setDifficulty('normal')} /> {t('diff_normal')}</label>
                <label className={styles.small}><input type="radio" name="diff" checked={difficulty==='hard'} onChange={()=>setDifficulty('hard')} /> {t('diff_hard')}</label>
              </div>
            </div>

            <div>
              <div className={styles.label}>{t('audio')}</div>
              <div className={styles.row}>
                <label className={styles.small}><input type="checkbox" checked={sound} onChange={(e)=>setSound(e.target.checked)} /> {t('sound')}</label>
                <label className={styles.small}><input type="checkbox" checked={music} onChange={(e)=>setMusic(e.target.checked)} /> {t('music')}</label>
              </div>
            </div>
          </div>
        </div>

          <div className={styles.right}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div className={styles.label}>{t('summary')}</div>
            <div className={styles.small}>{t('summary_skin')}: {t(`skin_${skin}`)}</div>
            <div className={styles.small}>{t('summary_difficulty')}: {difficulty}</div>
            <div className={styles.small}>{t('summary_sound') || t('sound')}: {sound? t('summary_sound_on') : t('summary_sound_off')}</div>
            <div className={styles.small}>{t('summary_music') || t('music')}: {music? t('summary_music_on') : t('summary_music_off')}</div>

            <div style={{height:12}} />
            <Button variant="primary" className={styles.playBtn} onClick={()=>onPlay({skin,difficulty,sound,music})}>{t('play')}</Button>
            <Button variant="secondary" style={{marginTop:8}} onClick={onBack}>{t('back')}</Button>
          </div>
            </div>
          </Grid>
        </div>
      </div>
    </Layout>
  );
}
