export type SourceRef = `P-tr.${number}` | `H-tr.${number}`;
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Element = 'Lửa' | 'Nước' | 'Khí' | 'Đất';

export interface CardSymbol {
  name: string;
  meaning: string;
  source_refs: SourceRef[];
  line_start: number;
  line_end: number;
}

export interface Card {
  id: string;
  name_vi: string;
  name_en: string;
  arcana: 'major' | 'minor';
  suit: Suit | null;
  number: number;
  element: Element | null;
  keywords: string[];
  symbols: CardSymbol[];
  summary_up: string;
  depth_up: string;
  quote_up: string | null;
  quote_up_ref: SourceRef[];
  summary_rev: string | null;
  depth_rev: string | null;
  quote_rev: string | null;
  quote_rev_ref: SourceRef[];
  rev_missing: boolean;
  refs: { up: SourceRef[]; rev: SourceRef[] };
}

export interface SpreadPosition {
  number: number;
  name_vi: string;
  x: number;
  y: number;
  source?: 'app' | 'P';
  source_ref: SourceRef | null;
  needs_review: boolean;
  meaning_short: string;
  geometry_source?: 'app';
  force_upright?: boolean;
  rotation?: number;
  split_from_section?: string;
}

export interface Spread {
  id: string;
  name_vi: string;
  source: 'app' | 'P';
  source_ref: SourceRef | null;
  card_count: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  position: SpreadPosition;
  card: Card;
  reversed: boolean;
}

export interface CardText {
  text: string;
  quote: string | null;
  quote_ref: SourceRef[];
  refs: SourceRef[];
  rev_missing: boolean;
}
