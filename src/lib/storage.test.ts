import { describe, expect, it, vi } from 'vitest';
import { cards, spreads } from '../data';
import { browserStorage } from './browserStorage';
import { DEFAULT_SETTINGS, SETTINGS_KEY, parseSettings, readSettings, writeSettings } from './settings';
import { HISTORY_KEY, clearAll, deleteReading, listReadings, rebuildReading, saveReading, type SavedReading } from './history';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}
const fixture = (index = 0, spreadId = 'one-card'): SavedReading => {
  const spread = spreads.find((item) => item.id === spreadId)!;
  return { v: 2, feelings: {ids: []}, id: `reading-${index}`, createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
    question: 'Câu hỏi thử nghiệm', topic: 'Tổng quan', spreadId,
    cards: spread.positions.map((position, i) => ({ position: position.number, cardId: cards[i].id, reversed: false })),
  };
};

describe('Cài đặt', () => {
  it('giá trị mặc định và JSON hỏng đều an toàn', () => {
    for (const raw of [null, '', '{broken', 'null', '[]', '1', '"text"', '{}']) expect(parseSettings(raw)).toEqual(DEFAULT_SETTINGS);
  });
  it('kiểm tra từng trường, giữ giá trị đúng và thay giá trị sai', () => {
    expect(parseSettings(JSON.stringify({ motion: 'full', fontScale: 'huge', allowReversedDefault: 'true', autoSave: true })))
      .toEqual({ ...DEFAULT_SETTINGS, effects: DEFAULT_SETTINGS.effects, motion: 'full', fontScale: 'medium', allowReversedDefault: false, autoSave: true, autoInterpret: true });
    expect(parseSettings(JSON.stringify({ motion: 'oops', fontScale: 'large', allowReversedDefault: true, autoSave: 1 })))
      .toEqual({ ...DEFAULT_SETTINGS, effects: DEFAULT_SETTINGS.effects, motion: 'full', fontScale: 'large', allowReversedDefault: true, autoSave: false, autoInterpret: true });
  });
  it('đọc/ghi cài đặt và xử lý bộ nhớ bị chặn', () => {
    const storage = new MemoryStorage();
    const settings = { ...DEFAULT_SETTINGS, motion: 'reduced' as const, fontScale: 'small' as const };
    expect(writeSettings(storage, settings)).toEqual({ ok: true });
    expect(readSettings(storage)).toEqual(settings);
    expect(storage.getItem(SETTINGS_KEY)).not.toBeNull();
    expect(readSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(writeSettings(null, settings)).toEqual({ ok: false });
    vi.spyOn(storage, 'getItem').mockImplementation(() => { throw new Error('Denied'); });
    vi.spyOn(storage, 'setItem').mockImplementation(() => { throw new Error('Quota'); });
    expect(readSettings(storage)).toEqual(DEFAULT_SETTINGS);
    expect(writeSettings(storage, settings)).toEqual({ ok: false });
  });
  it('bắt cả lỗi khi truy cập thuộc tính localStorage', () => {
    vi.stubGlobal('window', { get localStorage() { throw new Error('Blocked'); } });
    try { expect(browserStorage()).toBeNull(); } finally { vi.unstubAllGlobals(); }
  });
});

describe('Lịch sử', () => {
  it('lưu, liệt kê mới nhất trước, xóa một mục và xóa tất cả', () => {
    const storage = new MemoryStorage();
    expect(saveReading(storage, fixture(0))).toEqual({ ok: true });
    expect(saveReading(storage, fixture(1))).toEqual({ ok: true });
    expect(listReadings(storage).map((item) => item.id)).toEqual(['reading-1', 'reading-0']);
    expect(deleteReading(storage, 'reading-1')).toEqual({ ok: true });
    expect(listReadings(storage)).toEqual([fixture(0)]);
    expect(clearAll(storage)).toEqual({ ok: true });
    expect(listReadings(storage)).toEqual([]);
  });
  it('lưu cùng ID không tạo bản trùng, không lưu văn bản ngoài schema', () => {
    const storage = new MemoryStorage();
    const saved = { ...fixture(), summary_up: 'Không lưu nội dung này', depth_up: 'Không lưu' };
    saveReading(storage, saved); saveReading(storage, saved);
    expect(listReadings(storage)).toHaveLength(1);
    expect(JSON.parse(storage.getItem(HISTORY_KEY)!)).toEqual([fixture()]);
  });
  it('giới hạn 100 mục và bỏ mục cũ nhất', () => {
    const storage = new MemoryStorage();
    for (let i = 0; i <= 100; i++) expect(saveReading(storage, fixture(i)).ok).toBe(true);
    const saved = listReadings(storage);
    expect(saved).toHaveLength(100);
    expect(saved[0].id).toBe('reading-100');
    expect(saved[99].id).toBe('reading-1');
  });
  it('JSON hỏng hoặc sai kiểu trả về mảng rỗng', () => {
    const storage = new MemoryStorage();
    for (const value of ['{broken', '{}', 'null', '"text"', '[null, 1, {}]']) {
      storage.setItem(HISTORY_KEY, value); expect(listReadings(storage)).toEqual([]);
    }
  });
  it('loại schema sai, ID không tồn tại, vị trí thiếu/trùng và lá trùng', () => {
    const storage = new MemoryStorage(), valid = fixture(), multi = fixture(1, 'past-present-future');
    storage.setItem(HISTORY_KEY, JSON.stringify([
      valid, { ...valid, v: 3 }, { ...valid, id: 'bad-date', createdAt: 'yesterday' },
      { ...valid, id: 'bad-spread', spreadId: 'missing' },
      { ...valid, id: 'bad-card', cards: [{ ...valid.cards[0], cardId: 'missing' }] },
      { ...valid, id: 'bad-position', cards: [{ ...valid.cards[0], position: 999 }] },
      { ...multi, id: 'missing-position', cards: multi.cards.slice(0, 1) },
      { ...multi, id: 'duplicate-position', cards: multi.cards.map((card) => ({ ...card, position: 1 })) },
      { ...multi, id: 'duplicate-card', cards: multi.cards.map((card) => ({ ...card, cardId: cards[0].id })) },
      { ...valid, id: 'bad-reversed', cards: [{ ...valid.cards[0], reversed: 'yes' }] },
    ]));
    expect(listReadings(storage)).toEqual([valid]);
  });
  it('dựng lại đúng vị trí và lá từ dữ liệu hiện hành', () => {
    const saved = fixture(0, 'past-present-future');
    const rebuilt = rebuildReading({ ...saved, cards: [...saved.cards].reverse() });
    expect(rebuilt.map((item) => item.position.number)).toEqual(saved.cards.map((item) => item.position));
    expect(rebuilt.map((item) => item.card.id)).toEqual(saved.cards.map((item) => item.cardId));
    expect(rebuildReading({ ...saved, spreadId: 'missing' })).toEqual([]);
  });
  it('ghi thất bại hoặc quota trả ok=false, dữ liệu cũ không mất', () => {
    const storage = new MemoryStorage(); saveReading(storage, fixture());
    vi.spyOn(storage, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError'); });
    vi.spyOn(storage, 'removeItem').mockImplementation(() => { throw new Error('Denied'); });
    expect(saveReading(storage, fixture(1))).toEqual({ ok: false });
    expect(deleteReading(storage, fixture().id)).toEqual({ ok: false });
    expect(clearAll(storage)).toEqual({ ok: false });
    expect(listReadings(storage)).toEqual([fixture()]);
  });
  it('không ghi đè khi đọc bị chặn và xử lý Storage=null', () => {
    const storage = new MemoryStorage();
    vi.spyOn(storage, 'getItem').mockImplementation(() => { throw new Error('Denied'); });
    const write = vi.spyOn(storage, 'setItem');
    expect(listReadings(storage)).toEqual([]);
    expect(saveReading(storage, fixture())).toEqual({ ok: false });
    expect(deleteReading(storage, 'any')).toEqual({ ok: false });
    expect(write).not.toHaveBeenCalled();
    expect(saveReading(null, fixture())).toEqual({ ok: false });
    expect(clearAll(null)).toEqual({ ok: false });
  });
});

it('giữ luận giải đã lưu hợp lệ; bỏ bản sai vị trí; không sinh thêm khi đọc lịch sử',()=>{
 const storage=new MemoryStorage(),base=fixture();
 const reading={answer:'Một góc nhìn.',headline:'Góc nhìn',opening:'Nhìn lại.',tension:'Một câu hỏi.',weave:'Nối lại.',unsaid:'',outlook:'Có thể nhìn lại.',closing:'Còn điều muốn hỏi.',question:'Bạn muốn hiểu gì?',experiment:'',
  per_card:base.cards.map(c=>({position:c.position,title:'Một góc nhìn',scene:'Nhìn lại.',notice:'Chú ý.'})),paths:[]};
 const interpretation={kind:'ok' as const,mode:'reflective_only' as const,reading,notes:[]};
 expect(saveReading(storage,{...base,interpretation})).toEqual({ok:true});expect(listReadings(storage)[0].interpretation).toEqual(interpretation);
 saveReading(storage,base);expect(listReadings(storage)[0].interpretation).toEqual(interpretation);
 storage.setItem(HISTORY_KEY,JSON.stringify([{...base,interpretation:{...interpretation,reading:{...reading,per_card:[{...reading.per_card[0],position:999}]}}}]));
 expect(listReadings(storage)[0].interpretation).toBeUndefined();
});
