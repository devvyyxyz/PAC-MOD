import { useRef, useCallback, useState } from 'react';
import AUDIO from '../config/audio';
import config from '../config';

type PlayOpts = { volume?: number; loop?: boolean };

export function useAudio(){
  const sounds = useRef<Record<string, HTMLAudioElement>>({});
  const music = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState<number>(1);

  const play = useCallback((url: string, opts?: PlayOpts) => {
    try{
      const a = new Audio(url);
      a.volume = typeof opts?.volume === 'number' ? opts.volume : volume;
      a.loop = !!opts?.loop;
      a.play().catch(()=>{});
      return a;
    }catch(e){ return null; }
  }, [volume]);

  const playByName = useCallback((name: string, opts?: PlayOpts) => {
    try{
      const entry = (AUDIO as any)[name];
      if(!entry) return null;
      const cfg = config.loadConfig();
      const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : volume;
      const a = new Audio(encodeURI(entry.src));
      a.volume = typeof entry.defaultVolume === 'number' ? (entry.defaultVolume * vol) : vol;
      a.loop = typeof entry.loop === 'boolean' ? entry.loop : !!opts?.loop;
      a.play().catch(()=>{});
      return a;
    }catch(e){ return null; }
  }, [volume]);

  const playSound = useCallback((id: string, url: string, vol?: number) => {
    try{
      const a = new Audio(url);
      a.volume = typeof vol === 'number' ? vol : volume;
      a.play().catch(()=>{});
      sounds.current[id] = a;
      return a;
    }catch(e){ return null; }
  }, [volume]);

  const playSoundByName = useCallback((id: string, name: string) => {
    try{
      const entry = (AUDIO as any)[name];
      if(!entry) return null;
      const cfg = config.loadConfig();
      const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : volume;
      const a = new Audio(encodeURI(entry.src));
      a.volume = typeof entry.defaultVolume === 'number' ? (entry.defaultVolume * vol) : vol;
      a.play().catch(()=>{});
      sounds.current[id] = a;
      return a;
    }catch(e){ return null; }
  }, [volume]);

  const stopSound = useCallback((id: string) => {
    const s = sounds.current[id];
    if(s){ s.pause(); delete sounds.current[id]; }
  }, []);

  const playMusic = useCallback((url: string, loop = true) => {
    try{
      if(music.current){ music.current.pause(); }
      const m = new Audio(url);
      m.loop = loop;
      m.volume = volume;
      m.play().catch(()=>{});
      music.current = m;
      return m;
    }catch(e){ return null; }
  }, [volume]);

  const playMusicByName = useCallback((name: string) => {
    try{
      const entry = (AUDIO as any)[name];
      if(!entry) return null;
      if(music.current){ music.current.pause(); }
      const cfg = config.loadConfig();
      const vol = (typeof cfg.settings?.volume === 'number') ? (cfg.settings.volume / 100) : volume;
      const m = new Audio(encodeURI(entry.src));
      m.loop = !!entry.loop;
      m.volume = typeof entry.defaultVolume === 'number' ? (entry.defaultVolume * vol) : vol;
      m.play().catch(()=>{});
      music.current = m;
      return m;
    }catch(e){ return null; }
  }, [volume]);

  const stopMusic = useCallback(() => {
    if(music.current){ music.current.pause(); music.current = null; }
  }, []);

  const setVolume = useCallback((v: number) => {
    const next = Math.max(0, Math.min(1, v));
    setVolumeState(next);
    if(music.current) music.current.volume = next;
    Object.values(sounds.current).forEach(s => { try{ s.volume = next; }catch{} });
  }, []);

  return {
    play,
    playByName,
    playSound,
    playSoundByName,
    stopSound,
    playMusic,
    playMusicByName,
    stopMusic,
    setVolume,
    volume,
    isMusicPlaying: () => !!music.current,
  };
}

export default useAudio;
