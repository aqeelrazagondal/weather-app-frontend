import type { Cardinal } from '../types/weatherApi';

const cardinals: { dir: Cardinal; deg: number }[] = [
  { dir: 'N', deg: 0 },
  { dir: 'NE', deg: 45 },
  { dir: 'E', deg: 90 },
  { dir: 'SE', deg: 135 },
  { dir: 'S', deg: 180 },
  { dir: 'SW', deg: 225 },
  { dir: 'W', deg: 270 },
  { dir: 'NW', deg: 315 },
];

export function cardinalToDeg(cardinal: Cardinal): number {
  switch (cardinal) {
    case 'N': return 0;
    case 'NE': return 45;
    case 'E': return 90;
    case 'SE': return 135;
    case 'S': return 180;
    case 'SW': return 225;
    case 'W': return 270;
    case 'NW': return 315;
    default: return 0;
  }
}