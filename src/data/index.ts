import cardsJson from './cards.json';
import spreadsJson from './spreads.json';
import type { Card, Spread } from '../types';

export const cards = cardsJson as Card[];
export const spreads = spreadsJson as Spread[];
