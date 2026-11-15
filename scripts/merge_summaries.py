#!/usr/bin/env python3
"""Kiểm định + gộp kết quả tóm tắt Giai đoạn 1d vào data/cards.json (chạy local).

  python merge_summaries.py check batches/batch_01_output.json
  python merge_summaries.py merge batches/batch_0*_output.json
  python merge_summaries.py status

Với mỗi batch_XX_output.json cần có batch_XX_input.json cùng thư mục.
Không in nội dung sách; chỉ in id + lỗi.
"""
import json, re, shutil, sys
from pathlib import Path

DATA = Path('data/cards.json')
MAX_SUMMARY, MIN_DEPTH, MAX_DEPTH, MAX_QUOTE = 260, 120, 900, 260
WINDOW = 9  # cụm >= 9 từ trùng nguyên văn với nguồn (ngoài quote) => coi là chép lại


def norm(s):
    return re.sub(r'\s+', ' ', s or '').strip()


def words(s):
    return re.findall(r'\w+', norm(s).lower())


def sentences(s):
    return [x for x in re.split(r'(?<=[.!?…])\s+', norm(s)) if x]


def copies_source(text, source_words_set):
    w = words(text)
    return any(' '.join(w[i:i + WINDOW]) in source_words_set for i in range(len(w) - WINDOW + 1))


def build_ngrams(texts):
    out = set()
    for t in texts:
        w = words(t)
        out.update(' '.join(w[i:i + WINDOW]) for i in range(len(w) - WINDOW + 1))
    return out


def find_ref(quote, paragraphs):
    q = norm(quote)
    for p in paragraphs:
        if q in norm(p['text']):
            return p.get('source_refs', [])
    return None


def check_item(item, src):
    errs = []
    cid = item.get('id')
    up_texts = [src['h_desc_raw']] + [p['text'] for p in src['p_up_paragraphs']]
    rev_texts = [p['text'] for p in src['p_rev_paragraphs']]
    ngr = build_ngrams(up_texts + rev_texts)
    rev_missing = bool(item.get('rev_missing'))

    def need(k):
        v = item.get(k)
        if not isinstance(v, str) or not norm(v):
            errs.append(f'{cid}: thiếu {k}')
            return None
        return norm(v)

    for k in ('summary_up', 'depth_up', 'quote_up'):
        need(k)
    if rev_missing:
        for k in ('summary_rev', 'depth_rev', 'quote_rev'):
            if item.get(k):
                errs.append(f'{cid}: rev_missing=true nhưng vẫn có {k}')
    else:
        for k in ('summary_rev', 'depth_rev', 'quote_rev'):
            need(k)

    for k in ('summary_up', 'summary_rev'):
        v = norm(item.get(k))
        if v and (len(v) > MAX_SUMMARY or len(sentences(v)) > 2):
            errs.append(f'{cid}: {k} quá dài ({len(v)} ký tự, {len(sentences(v))} câu; tối đa {MAX_SUMMARY}/2 câu)')
    for k in ('depth_up', 'depth_rev'):
        v = norm(item.get(k))
        if v and not (MIN_DEPTH <= len(v) <= MAX_DEPTH and len(sentences(v)) <= 5):
            errs.append(f'{cid}: {k} ngoài khoảng {MIN_DEPTH}-{MAX_DEPTH} ký tự / ≤5 câu')
    for k in ('summary_up', 'depth_up', 'summary_rev', 'depth_rev'):
        v = item.get(k)
        if v and copies_source(v, ngr):
            errs.append(f'{cid}: {k} chép nguyên cụm >= {WINDOW} từ từ sách (cần diễn giải lại)')

    q_up, q_rev = norm(item.get('quote_up')), norm(item.get('quote_rev'))
    if q_up:
        if len(q_up) > MAX_QUOTE or len(sentences(q_up)) > 2:
            errs.append(f'{cid}: quote_up quá dài (tối đa {MAX_QUOTE} ký tự/2 câu)')
        ref = find_ref(q_up, [{'text': src['h_desc_raw'], 'source_refs': src['refs'].get('up', [])}] + src['p_up_paragraphs'])
        if ref is None:
            errs.append(f'{cid}: quote_up không phải trích nguyên văn từ nguồn')
        else:
            item['quote_up_ref'] = ref
    if q_rev and not rev_missing:
        if len(q_rev) > MAX_QUOTE or len(sentences(q_rev)) > 2:
            errs.append(f'{cid}: quote_rev quá dài (tối đa {MAX_QUOTE} ký tự/2 câu)')
        ref = find_ref(q_rev, src['p_rev_paragraphs'])
        if ref is None:
            errs.append(f'{cid}: quote_rev không phải trích nguyên văn từ đoạn nghĩa ngược')
        else:
            item['quote_rev_ref'] = ref

    kw = item.get('keywords')
    if src.get('_arcana') == 'minor':
        if not (isinstance(kw, list) and 3 <= len(kw) <= 6 and all(isinstance(x, str) and 0 < len(x) <= 40 for x in kw)):
            errs.append(f'{cid}: Ẩn Phụ cần keywords 3-6 mục (mỗi mục ≤40 ký tự)')
    return errs


def load_batch(out_path):
    out_path = Path(out_path)
    in_path = out_path.with_name(out_path.name.replace('_output', '_input'))
    items = json.loads(out_path.read_text(encoding='utf-8'))
    src_list = json.loads(in_path.read_text(encoding='utf-8'))
    return items, {s['id']: s for s in src_list}


def run(paths, merge):
    cards = json.loads(DATA.read_text(encoding='utf-8'))
    by_id = {c['id']: c for c in cards}
    total_err, merged = 0, 0
    for path in paths:
        items, src = load_batch(path)
        errs = []
        ids = [i.get('id') for i in items]
        errs += [f'{path}: id lạ {x}' for x in ids if x not in src]
        errs += [f'{path}: thiếu {x}' for x in src if x not in ids]
        errs += [f'{path}: trùng id {x}' for x in set(ids) if ids.count(x) > 1]
        for it in items:
            if it.get('id') in src:
                s = dict(src[it['id']])
                s['_arcana'] = by_id[it['id']]['arcana']
                errs += check_item(it, s)
        print(f'{path}: {len(items)} lá, {len(errs)} lỗi')
        for e in errs:
            print('  -', e)
        total_err += len(errs)
        if merge and not errs:
            for it in items:
                c = by_id[it['id']]
                for k in ('summary_up', 'depth_up', 'quote_up', 'quote_up_ref'):
                    c[k] = norm(it[k]) if isinstance(it[k], str) else it[k]
                rm = bool(it.get('rev_missing'))
                c['rev_missing'] = rm
                for k in ('summary_rev', 'depth_rev', 'quote_rev'):
                    c[k] = None if rm else norm(it[k])
                c['quote_rev_ref'] = None if rm else it.get('quote_rev_ref')
                if c['arcana'] == 'minor':
                    c['keywords'] = [norm(x) for x in it['keywords']]
                merged += 1
    if merge:
        if merged:
            shutil.copy(DATA, str(DATA) + '.bak')
            DATA.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Đã gộp {merged} lá (batch lỗi bị bỏ qua).')
    return total_err


def status():
    cards = json.loads(DATA.read_text(encoding='utf-8'))
    todo = [c['id'] for c in cards if not c.get('summary_up')]
    miss_rev = [c['id'] for c in cards if c.get('rev_missing')]
    print(f'Xong {78 - len(todo)}/78 lá; còn {len(todo)}. Lá sách không bàn rõ nghĩa ngược: {len(miss_rev)} {miss_rev}')


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('check', 'merge', 'status'):
        sys.exit(__doc__)
    if sys.argv[1] == 'status':
        status()
    else:
        sys.exit(1 if run(sys.argv[2:], sys.argv[1] == 'merge') else 0)
