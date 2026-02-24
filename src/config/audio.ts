export type AudioEntry = {
  src: string; // path under public/
  loop?: boolean;
  defaultVolume?: number; // 0.0 - 1.0
  description?: string;
};

const AUDIO: Record<string, AudioEntry> = {
  // main menu background ambience
  menuAmbience: {
    src: '/assets/audio/GameSFX/Ambience/Retro Ambience Short 09.wav',
    loop: true,
    defaultVolume: 0.7,
    description: 'Menu background ambience'
  },
  sfxChomp: { src: '/assets/audio/GameSFX/Blops/Retro Blop 18.wav', defaultVolume: 1 },
  uiClick: { src: '/assets/audio/GameSFX/Blops/Retro Blop 18.wav', defaultVolume: 1 },
  uiSend: { src: '/assets/audio/GameSFX/Events/Retro Event UI 13.wav', defaultVolume: 1 },
  uiCopy: { src: '/assets/audio/GameSFX/Events/Retro Event UI 15.wav', defaultVolume: 1 }
};

export default AUDIO;
