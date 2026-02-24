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
  uiHover: { src: '/assets/audio/GameSFX/Blops/Retro Blop 07.wav', defaultVolume: 0.9 },
  uiSend: { src: '/assets/audio/GameSFX/Blops/Retro Blop StereoUP 09.wav', defaultVolume: 1 },
  uiCopy: { src: '/assets/audio/GameSFX/Blops/Retro Blop StereoUP 09.wav', defaultVolume: 1 }
};

export default AUDIO;
