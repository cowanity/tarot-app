import type {ReadingOutput} from './schema';
export function threateningFields(reading: Pick<ReadingOutput,'outlook'|'closing'>): ('outlook'|'closing')[] {
  const forbidden=/(?<![\p{L}])(?:chỉ\s+toàn|sẽ\s+chỉ|mãi\s+mãi|luôn\s+luôn|hao\s+mòn|cạn\s+kiệt)(?![\p{L}])/iu;
  return (['outlook','closing'] as const).filter(field=>forbidden.test(reading[field].normalize('NFC')) ||
    (field==='closing' && /sẽ\s+(?:dẫn\s+đường|bình\s+yên)/iu.test(reading[field])));
}
