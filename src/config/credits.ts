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
  },
  {
    id: 'Example',
    name: 'Example Contributor',
    role: 'Example Role',
    url: 'https://example.com',
    note: 'Example note for contributor'
  },
  {
    id: 'Example2',
    name: 'Example Contributor',
    role: 'Example Role',
    url: 'https://example.com',
    note: 'Example note for contributor'
  }
];

export default CREDITS;
