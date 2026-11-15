import type { Card, CardText } from '../types';

export type TextDepth = 'summary' | 'depth';
export const MISSING_REVERSED = 'Sách không bàn rõ nghĩa ngược của lá này';

export function getCardText(card: Card, reversed: boolean, depth: TextDepth = 'summary'): CardText {
  if (reversed && (card.rev_missing || !card.summary_rev || !card.depth_rev)) {
    return {
      text: `${MISSING_REVERSED}. ${card.summary_up}`,
      quote: card.quote_up,
      quote_ref: card.quote_up_ref,
      refs: card.refs.up,
      rev_missing: true,
    };
  }
  const side = reversed ? 'rev' : 'up';
  return {
    text: card[`${depth}_${side}`] ?? card.summary_up,
    quote: card[`quote_${side}`],
    quote_ref: card[`quote_${side}_ref`],
    refs: card.refs[side],
    rev_missing: false,
  };
}
