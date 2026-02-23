import React from 'react';
import menuStyles from '../../components/Menu/Menu.module.css';
import { GameOptions } from '../GameSetup';
import { useI18n, Layout } from '../../components';
import Button from '../../components/Button';

export default function GamePlay({options, onBack}:{options:GameOptions; onBack:()=>void}){
  const { t } = useI18n();
  return (
    <Layout title={t('game_ready')}>
      <div style={{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'var(--muted)',fontSize:13}}>{t('game_ready')}</div>
        <div>
          <Button variant="secondary" onClick={onBack}>{t('exit')}</Button>
        </div>
      </div>

      <div id="game-root" style={{flex:1,position:'relative',minHeight:360}} />
    </Layout>
  );
}
