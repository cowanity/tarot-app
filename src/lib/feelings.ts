import {detectSensitive} from './detectSensitive';
export const FEELINGS = [
  {id:'lo_lang',label:'Lo lắng',group:'Nặng nề'}, {id:'so_hai',label:'Sợ hãi',group:'Nặng nề'},
  {id:'buon',label:'Buồn',group:'Nặng nề'}, {id:'co_don',label:'Cô đơn',group:'Nặng nề'},
  {id:'tui_than',label:'Tủi thân',group:'Nặng nề'}, {id:'gian',label:'Giận',group:'Nặng nề'},
  {id:'that_vong',label:'Thất vọng',group:'Nặng nề'}, {id:'toi_loi',label:'Tội lỗi',group:'Nặng nề'},
  {id:'xau_ho',label:'Xấu hổ',group:'Nặng nề'}, {id:'kiet_suc',label:'Kiệt sức',group:'Nặng nề'},
  {id:'trong_rong',label:'Trống rỗng',group:'Nặng nề'}, {id:'be_tac',label:'Bế tắc',group:'Nặng nề'},
  {id:'tuyet_vong',label:'Tuyệt vọng',group:'Nặng nề',care:true},
  {id:'phan_van',label:'Phân vân',group:'Giằng co'}, {id:'roi_bo',label:'Rối bời',group:'Giằng co'},
  {id:'mau_thuan',label:'Mâu thuẫn',group:'Giằng co'}, {id:'chong_chenh',label:'Chông chênh',group:'Giằng co'},
  {id:'ap_luc',label:'Áp lực',group:'Giằng co'}, {id:'ngon_ngang',label:'Ngổn ngang',group:'Giằng co'},
  {id:'hy_vong',label:'Hy vọng',group:'Sáng'}, {id:'hao_huc',label:'Háo hức',group:'Sáng'},
  {id:'biet_on',label:'Biết ơn',group:'Sáng'}, {id:'binh_yen',label:'Bình yên',group:'Sáng'},
  {id:'nhe_nhom',label:'Nhẹ nhõm',group:'Sáng'}, {id:'tu_tin',label:'Tự tin',group:'Sáng'},
  {id:'to_mo',label:'Tò mò',group:'Sáng'}, {id:'yeu_thuong',label:'Yêu thương',group:'Sáng'},
  {id:'kho_goi_ten',label:'Khó gọi tên',group:'Đặc biệt'},
] as const;
export const WANT_LABELS = {clarity:'Muốn rõ hơn', comfort:'Muốn được an ủi', decision:'Muốn cân nhắc quyết định', listen:'Muốn được lắng nghe', curious:'Muốn khám phá'} as const;
export const DURATION_LABELS = {new:'Mới xảy ra', weeks:'Vài tuần', months:'Vài tháng', long:'Đã lâu'} as const;
export interface Feelings {ids: string[]; other?: string; intensity?: 1|2|3|4|5; want?: keyof typeof WANT_LABELS; duration?: keyof typeof DURATION_LABELS}
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu,'').replace(/[đĐ]/g,'d').toLowerCase().trim().replace(/[\s-]+/g,'_');
export function feelingId(value: string): string | undefined {
  const key = fold(value);
  if (key === 'met_moi') return 'kiet_suc';
  if (key === 'binh_tinh') return 'binh_yen';
  return FEELINGS.find(f => f.id === key || fold(f.label) === key)?.id;
}
/** Legacy labels/arrays are accepted only at local migration boundaries. */
export function sanitizeFeelings(raw: unknown): Feelings {
  const obj = Array.isArray(raw) ? {ids: raw} : raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const ids = Array.isArray(obj.ids) ? [...new Set(obj.ids.flatMap(v => typeof v === 'string' ? [feelingId(v)].filter((id): id is string => Boolean(id)) : []))].slice(0,3) : [];
  const out: Feelings = {ids};
  if (typeof obj.other === 'string') {
    const other = obj.other.normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu,' ').replace(/[<>]/g,'').trim().slice(0,40);
    if (other) out.other = other;
  }
  if (typeof obj.intensity === 'number' && Number.isInteger(obj.intensity) && obj.intensity >= 1 && obj.intensity <= 5) out.intensity = obj.intensity as Feelings['intensity'];
  if (typeof obj.want === 'string' && Object.hasOwn(WANT_LABELS,obj.want)) out.want = obj.want as Feelings['want'];
  if (typeof obj.duration === 'string' && Object.hasOwn(DURATION_LABELS,obj.duration)) out.duration = obj.duration as Feelings['duration'];
  return out;
}
export function labelsOf(ids: readonly string[]): string[] {
  return ids.flatMap(id => {const item = FEELINGS.find(f => f.id === feelingId(id)); return item ? [item.label] : [];});
}
export function feelingsCareLevel(feelings: Feelings): 'care'|'none' {
  const f = sanitizeFeelings(feelings);
  return f.ids.includes('tuyet_vong') || (f.intensity === 5 && FEELINGS.some(item => item.group === 'Nặng nề' && f.ids.includes(item.id))) ? 'care' : 'none';
}
export function readingSensitivity(question: string, context: string, raw: unknown): ReturnType<typeof detectSensitive> {
  const f = sanitizeFeelings(raw);
  const sensitive = detectSensitive([question,context,f.other ?? '',...labelsOf(f.ids)].join(' '));
  return sensitive === 'crisis' || feelingsCareLevel(f) === 'care' ? 'crisis' : sensitive;
}
/** Local history never stores freely entered emotion text. */
export function storedFeelings(raw: unknown): Omit<Feelings,'other'> {
  const {other: _other,...safe} = sanitizeFeelings(raw); return safe;
}
