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
  }
  // add other named audio entries here, e.g.:
  //,sfxChomp: { src: '/assets/audio/sfx/chomp.wav', defaultVolume: 1 }
};

export default AUDIO;
