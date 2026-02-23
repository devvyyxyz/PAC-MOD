export type Difficulty = 'easy' | 'normal' | 'hard';

export const DEFAULT_CONFIG = {
  assets: {
    iconsPath: '/assets/icons',
    spritesPath: '/assets/sprites',
    imagesPath: '/assets/images',
    audioSfxPath: '/assets/audio/sfx',
    audioMusicPath: '/assets/audio/music'
  },
  settings: {
    sound: true,
    music: true,
    difficulty: 'normal' as Difficulty,
    skin: 'classic',
    volume: 70,
    maxLives: 3,
    locale: 'en',
    invertControls: false,
    showFPS: false,
    controlScheme: 'wasd',
    colorBlindMode: 'none',
    highContrast: false,
    onlineLeaderboard: false,
    keyboardNavigation: true,
    mouseNavigation: true,
    mouseSensitivity: 50
  },
  // leave empty here in source control; prefer using VITE_DISCORD_WEBHOOK_URL
  discordWebhook: 'https://discord.com/api/webhooks/1475630410229747987/tW6Zmc4RepPLABti6tV6xA6UONJLGpx6Zjo3DkGhRw9Err1QamBmNBo9b3MEBvWyGyxt' as string,
  // path to a JSON file containing level / map data
  gameDataPath: '/game-data.json'
};

export type AppConfig = typeof DEFAULT_CONFIG;
