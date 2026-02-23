export type Credit = {
  id: string;
  name: string;
  role?: string;
  url?: string;
  note?: string;
  icon?: string; // optional path under /assets/icons
}

const CREDITS: Credit[] = [
  {
    id: 'author',
    name: 'Devvyyxyz',
    role: 'Code',
    note: 'Main implementation and UI'
  },
  {
    id: 'kronbits',
    name: 'Kronbits',
    role: 'Audio / SFX',
    url: 'https://kronbits.itch.io/freesfx',
    note: 'Free SFX pack used for game sounds'
  }
];

export default CREDITS;
