import type { DrawnCard, Element } from '../types';

export function summarizeReading(reading: readonly DrawnCard[]) {
  const summary = {
    total: reading.length, major: 0, minor: 0, reversed: 0,
    elements: { 'Lửa': 0, 'Nước': 0, 'Khí': 0, 'Đất': 0 } as Record<Element, number>,
  };
  for (const { card, reversed } of reading) {
    summary[card.arcana]++;
    if (reversed) summary.reversed++;
    if (card.arcana === 'minor' && card.element) summary.elements[card.element]++;
  }
  return summary;
}
