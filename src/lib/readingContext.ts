import { buildProfileContext } from './profileContext';
import type { Profile } from './numerology';
import { pickSymbolChips } from './pickSymbolChips';
import { cards, spreads } from '../data';
import type { DrawnCard, Spread } from '../types';

export interface ReadingPick { position: number; cardId: string; reversed: boolean }
export type ReadingErrorCode = 'SPREAD_NOT_FOUND' | 'INVALID_PICKS' | 'CARD_COUNT' | 'CARD_NOT_FOUND' | 'POSITION_NOT_FOUND' | 'DUPLICATE_POSITION' | 'DUPLICATE_CARD' | 'FORCE_UPRIGHT';
export class ReadingContextError extends Error {
  constructor(public readonly code: ReadingErrorCode) { super(code); this.name = 'ReadingContextError'; }
}
const fail = (code: ReadingErrorCode): never => { throw new ReadingContextError(code); };

/** Resolve only identifiers: callers cannot supply or override book text. No browser APIs. */
export function resolveReading(spreadId: string, picks: readonly ReadingPick[]): DrawnCard[] {
  const spread = spreads.find((item) => item.id === spreadId);
  if (!spread) return fail('SPREAD_NOT_FOUND');
  if (!Array.isArray(picks)) return fail('INVALID_PICKS');
  if (picks.length !== spread.card_count) return fail('CARD_COUNT');
  const positions = new Set<number>(), cardIds = new Set<string>();
  const result = picks.map((pick) => {
    if (!pick || !Number.isInteger(pick.position) || typeof pick.cardId !== 'string' || typeof pick.reversed !== 'boolean') return fail('INVALID_PICKS');
    const position = spread.positions.find((item) => item.number === pick.position);
    if (!position) return fail('POSITION_NOT_FOUND');
    if (positions.has(pick.position)) return fail('DUPLICATE_POSITION');
    positions.add(pick.position);
    const card = cards.find((item) => item.id === pick.cardId);
    if (!card) return fail('CARD_NOT_FOUND');
    if (cardIds.has(card.id)) return fail('DUPLICATE_CARD');
    cardIds.add(card.id);
    if (position.force_upright && pick.reversed) return fail('FORCE_UPRIGHT');
    return { position, card, reversed: pick.reversed };
  });
  return spread.positions.map((position) => result.find((item) => item.position.number === position.number)!);
}

export function buildReadingContext(reading: readonly DrawnCard[], spread: Spread, profile?: Profile) {
  return {
    spread: { id: spread.id, name: spread.name_vi },
    ...(profile ? {profile: buildProfileContext(profile, reading.map(({card}) => card.id))} : {}),
    positions: reading.map(({ position, card, reversed }) => {
      const reversedMissing = reversed && (card.rev_missing || !card.summary_rev || !card.depth_rev);
      const side = reversed && !reversedMissing ? 'rev' : 'up';
      return {
        number: position.number, name: position.name_vi, meaning: position.meaning_short,
        card: { id: card.id, name_vi: card.name_vi, name_en: card.name_en },
        orientation: reversed ? 'reversed' as const : 'upright' as const,
        arcana: card.arcana,
        suit_element: [card.suit ? ({cups: 'Cốc', swords: 'Kiếm', wands: 'Gậy', pentacles: 'Tiền'} as const)[card.suit] : '', card.element].filter(Boolean).join(' · ') || 'sách không đề cập',
        symbols: pickSymbolChips(card.symbols).map(({name}) => name),
        keywords: card.keywords.slice(0, 8),
        text: [card[`summary_${side}`], card[`depth_${side}`]].filter(Boolean).join('\n\n'),
        ...(reversedMissing ? { reversedMissing: true } : {}),
      };
    }),
  };
}
