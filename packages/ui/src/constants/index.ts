import type { NavbarLink } from '@/components/layout/navbar';

export const LEARN_MORE_URI = 'https://docs.arbitrum.io/how-arbitrum-works/sequencer';
export const MILESTONE_ONE_URI = 'https://drive.google.com/file/d/1mBZLs-64t7PxTXpgJsqTmKRwsR5w5opG/view';

export const NAV_LINKS: NavbarLink[] = [
  {
    label: 'Research',
    to: MILESTONE_ONE_URI,
    targetBlank: true,
  },
];
