import { cards } from '../data';
import lensData from '../data/numberLens.json';
import { cardSet, profileResonance, type Profile, type Resonance } from './numerology';
export type WireProfile = Profile & {resonance: Resonance[]};
export interface NumberLens {number: number; essence: string; gift: string; shadow: string; question: string; _placeholder?: boolean}
export function lookupNumberLens(number: number): NumberLens | null {
  const lens = (lensData as NumberLens[]).find((entry) => entry.number === number);
  return lens && !lens._placeholder ? {number, essence: lens.essence, gift: lens.gift, shadow: lens.shadow, question: lens.question} : null;
}
/** Strict outbound projection. Never spread a raw profile/form object into a network payload. */
export function toWireProfile(profile: Profile, drawnCardIds: string[]): WireProfile {
  return {birthCard: profile.birthCard, yearCard: profile.yearCard, nameCard: profile.nameCard,
    facets: {soul: profile.facets.soul, lesson: profile.facets.lesson, gift: profile.facets.gift, purpose: profile.facets.purpose},
    resonance: profileResonance(profile, drawnCardIds)};
}
export function buildProfileContext(profile: Profile, drawnCardIds: string[]) {
  const wire = toWireProfile(profile, drawnCardIds);
  const groups = ([['birth', wire.birthCard], ['year', wire.yearCard], ['name', wire.nameCard]] as const)
    .flatMap(([via, number]) => number === null ? [] : [{via, number, cards: cardSet(number).map((id, index) => {
      const card = cards.find((card) => card.id === id);
      if (!card) throw new Error('PROFILE_CARD_NOT_FOUND');
      return {id, name: card.name_vi, number: card.number === 0 ? 22 : card.number,
        role: index === 0 ? 'main' as const : 'companion' as const, meaning: card.summary_up};
    })}]);
  return {groups, facets: Object.entries(wire.facets).map(([kind, number]) => ({kind, number, lens: lookupNumberLens(number)})),
    resonance: wire.resonance.map((hit) => ({...hit, name: cards.find((card) => card.id === hit.cardId)!.name_vi}))};
}
