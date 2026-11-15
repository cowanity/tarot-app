#!/usr/bin/env python3
"""Tạo dữ liệu gọn cho app từ data/cards.json + data/spreads.json (chạy từ thư mục gốc).

  python3 scripts/build_app_data.py

Đầu ra (data/app/):
  cards.json                    78 lá: chỉ trường tóm tắt/trích ngắn/nguồn, KHÔNG có văn bản sách thô
  spreads.json                  thế bài MVP (1 lá, 3 lá, Celtic Cross), không có văn bản thô
  celtic_meanings_source.json   chỉ để AI diễn giải lại ý nghĩa 10 vị trí (không đưa vào app)
"""
import json
from pathlib import Path

D = Path('data')
OUT = D / 'app'
CARD_KEYS = ['id', 'name_vi', 'name_en', 'arcana', 'suit', 'number', 'element', 'keywords', 'symbols',
             'summary_up', 'depth_up', 'quote_up', 'quote_up_ref',
             'summary_rev', 'depth_rev', 'quote_rev', 'quote_rev_ref', 'rev_missing', 'refs']
MVP_SPREADS = ['one-card', 'past-present-future', 'celtic-cross']
DROP_POS = {'raw_meaning', 'raw_segments', 'source_refs'}


def main():
    cards = json.loads((D / 'cards.json').read_text(encoding='utf-8'))
    unfinished = [c['id'] for c in cards if not c.get('summary_up')]
    if unfinished:
        raise SystemExit(f'Còn {len(unfinished)} lá chưa có tóm tắt (chạy merge_summaries.py status): {unfinished[:5]}...')
    slim = [{k: c.get(k) for k in CARD_KEYS} for c in cards]
    spreads = json.loads((D / 'spreads.json').read_text(encoding='utf-8'))
    spreads = spreads['spreads'] if isinstance(spreads, dict) else spreads
    by_id = {s['id']: s for s in spreads}
    out_spreads, source = [], []
    for sid in MVP_SPREADS:
        s = by_id[sid]
        positions = []
        for p in s['positions']:
            q = {k: v for k, v in p.items() if k not in DROP_POS}
            q.setdefault('meaning_short', None)
            positions.append(q)
            if sid == 'celtic-cross':
                source.append({'number': p['number'], 'name_vi': p['name_vi'],
                               'raw_meaning': p.get('raw_meaning', ''), 'source_ref': p.get('source_ref')})
        out_spreads.append({'id': s['id'], 'name_vi': s['name_vi'], 'source': s.get('source'),
                            'source_ref': s.get('source_ref'), 'card_count': s['card_count'], 'positions': positions})
    OUT.mkdir(parents=True, exist_ok=True)
    for name, val in [('cards.json', slim), ('spreads.json', out_spreads), ('celtic_meanings_source.json', source)]:
        (OUT / name).write_text(json.dumps(val, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    size = (OUT / 'cards.json').stat().st_size // 1024
    print(f'Đã tạo data/app/: {len(slim)} lá ({size} KB), {len(out_spreads)} thế bài, {len(source)} vị trí Celtic cần diễn giải.')


if __name__ == '__main__':
    main()
