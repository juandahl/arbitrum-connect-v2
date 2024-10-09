import type { NavbarLink } from '@/components/layout/navbar';
import envParsed from '@/envParsed';

export const LEARN_MORE_URI = 'https://docs.arbitrum.io/how-arbitrum-works/sequencer';

export const NAV_LINKS: NavbarLink[] = [
  {
    label: 'Research',
    to: envParsed().RESERCH_LINK_URL,
    targetBlank: true,
  },
];
