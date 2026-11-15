#!/usr/bin/env python3
"""Merge reviewed raw sources, without printing any book content."""
import argparse
from copy import deepcopy
import json
from pathlib import Path
import re

ELEMENTS = {'pentacles': 'Đất', 'swords': 'Khí', 'wands': 'Lửa', 'cups': 'Nước'}
SUIT_NAMES = {'pentacles': 'Tiền', 'swords': 'Kiếm', 'wands': 'Gậy', 'cups': 'Cốc'}
RANK_NAMES = ['Át', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười',
              'Tiểu đồng', 'Hiệp sĩ', 'Hoàng hậu', 'Vua']
MAJOR_NAMES = ['Chàng Khờ', 'Pháp Sư', 'Nữ Tu', 'Nữ Hoàng', 'Hoàng Đế', 'Tư Tế',
               'Tình Nhân', 'Cỗ Xe', 'Sức Mạnh', 'Ẩn Sĩ', 'Bánh Xe Số Phận', 'Công Lý',
               'Người Bị Treo', 'Cái Chết', 'Tiết Độ', 'Ác Quỷ', 'Tòa Tháp', 'Ngôi Sao',
               'Mặt Trăng', 'Mặt Trời', 'Phán Quyết', 'Thế Giới']
BATCH_FIELDS = ['id', 'name_vi', 'name_en', 'keywords', 'h_desc_raw',
                'p_up_paragraphs', 'p_rev_paragraphs', 'refs']


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def unique(values):
    return list(dict.fromkeys(values))


def paragraphs_refs(paragraphs):
    return unique(ref for p in paragraphs for ref in p['source_refs'])


def key(card):
    return (card['arcana'], card['number']) if card['arcana'] == 'major' else (card['suit'], card['number'])


def index_cards(cards, label):
    ids, keys = set(), {}
    for card in cards:
        k = key(card)
        if card['id'] in ids or k in keys:
            raise ValueError(f'{label}: duplicate id or matching key')
        ids.add(card['id'])
        keys[k] = card
    if len(ids) != 78 or sum(c['arcana'] == 'major' for c in cards) != 22:
        raise ValueError(f'{label}: expected 22 major and 56 minor cards')
    if {c['number'] for c in cards if c['arcana'] == 'major'} != set(range(22)):
        raise ValueError(f'{label}: missing major number')
    for suit in ELEMENTS:
        if {c['number'] for c in cards if c['suit'] == suit} != set(range(1, 15)):
            raise ValueError(f'{label}: incomplete {suit}')
    return keys


def merge_cards(p_cards, h_cards, elements):
    p_index, h_index = index_cards(p_cards, 'P'), index_cards(h_cards, 'H')
    if set(p_index) != set(h_index):
        raise ValueError('P/H matching keys differ')
    if set(ELEMENTS.values()) - set(elements):
        raise ValueError('Missing element information')
    names, cards = [], []
    for p in sorted(p_cards, key=lambda c: (c['arcana'] != 'major', c['id'])):
        h = h_index[key(p)]
        if h['id'] != p['id']:
            raise ValueError(f"P/H id mismatch: {p['id']}")
        is_major = p['arcana'] == 'major'
        expected_name = MAJOR_NAMES[p['number']] if is_major else f"{RANK_NAMES[p['number'] - 1]} {SUIT_NAMES[p['suit']]}"
        confidence = 'check' if (not is_major and p['number'] >= 11) or h['name_vi'] != expected_name else 'high'
        name = {'id': p['id'], 'name_en': p['name_en'], 'name_vi': h['name_vi'],
                'arcana': p['arcana'], 'suit': p['suit'], 'number': p['number'],
                # Neither source supplies a single uniform major-element map here.
                'element': None if is_major else ELEMENTS[p['suit']], 'mapping_confidence': confidence}
        names.append(name)
        up = deepcopy([x for x in p['upright_paragraphs'] if not x.get('off_topic', False)])
        rev = deepcopy([x for x in p['reversed_paragraphs']
                        if not is_major or x.get('reversed_quality') == 'explicit'])
        for paragraph in up + rev:
            if not paragraph.get('source_refs'):
                raise ValueError(f"Missing paragraph references: {p['id']}")
        h_fields = h['field_source_refs']
        h_up_refs = unique(h_fields.get('description_raw', []) +
                           (h_fields.get('keywords', []) + h_fields.get('symbols', []) +
                            h_fields.get('person_note_raw', []) if is_major else []))
        card = {k: v for k, v in name.items() if k != 'mapping_confidence'}
        card.update({'keywords': deepcopy(h['keywords']) if is_major else [],
                     'symbols': deepcopy(h.get('symbols', [])) if is_major else [],
                     'person_note_raw': h.get('person_note_raw', '') if is_major else '',
                     'h_desc_raw': h['description_raw'], 'p_up_paragraphs': up, 'p_rev_paragraphs': rev,
                     **dict.fromkeys(['summary_up', 'summary_rev', 'depth_up', 'depth_rev', 'quote_up', 'quote_rev']),
                     'refs': {'up': unique(h_up_refs + paragraphs_refs(up)), 'rev': paragraphs_refs(rev)},
                     'field_source_refs': {'h_desc_raw': deepcopy(h_fields['description_raw']),
                                          'keywords': deepcopy(h_fields.get('keywords', [])) if is_major else [],
                                          'person_note_raw': deepcopy(h_fields.get('person_note_raw', [])) if is_major else []},
                     'source_notes': {'H': h['source_page_note'],
                                      'element': 'sách không đề cập' if is_major else 'Chất bài và nguyên tố trong H; xem element_info.json.'}})
        if not is_major:
            card['field_source_refs']['element'] = elements[name['element']]['source_refs']
        cards.append(card)
    return names, cards


def find_section(spread, title):
    candidates = [s for s in spread['sections'] if s['title'].strip('“”"') == title]
    if len(candidates) != 1:
        raise ValueError(f"Section not unique: {spread['id']} / {title}")
    return candidates[0]


def position(number, name, section, raw=None, **extra):
    return {'number': number, 'name_vi': name, 'raw_meaning': section['raw'] if raw is None else raw,
            'source_ref': section['source_ref'], 'source_refs': deepcopy(section['source_refs']),
            'needs_review': False, **extra}


def segment(raw, start, end=None):
    a = raw.find(start)
    b = raw.find(end, a + len(start)) if end else len(raw)
    if a < 0 or b < 0 or b <= a:
        raise ValueError('Reviewed spread text boundary no longer matches')
    return {'start_char': a, 'end_char': b, 'text': raw[a:b]}


def sentence_segment(raw, start):
    a = raw.find(start)
    if a < 0:
        raise ValueError('Reviewed spread sentence not found')
    match = re.search(r'[.!?](?:\s|$)', raw[a:])
    if not match:
        raise ValueError('Spread sentence has no terminal punctuation')
    b = a + match.start() + 1
    return {'start_char': a, 'end_char': b, 'text': raw[a:b]}


def merge_spreads(source):
    originals = {s['id']: s for s in source['spreads']}
    result = []
    celtic = originals['celtic-cross']
    small = find_section(celtic, 'CHỮ THẬP NHỎ')
    center_segments = [segment(small['raw'], 'Ở đây, lá phủ', 'Chúng ta luôn đọc'),
                       segment(small['raw'], 'Lá Đại diện cho thấy', 'Lá bắc ngang thì'),
                       sentence_segment(small['raw'], 'Nói cách khác, lá thứ nhất')]
    crossing_segments = [segment(small['raw'], 'Chúng ta luôn đọc', 'Ví dụ,'),
                         segment(small['raw'], 'Lá bắc ngang thì', 'Nói cách khác,'),
                         sentence_segment(small['raw'], 'lá thứ hai cho thấy')]
    positions = []
    for number, name, pieces in [(1, 'Trung tâm', center_segments), (2, 'chéo qua', crossing_segments)]:
        positions.append(position(number, name, small, '\n\n'.join(p['text'] for p in pieces),
                                  raw_segments=pieces, x=1, y=2, geometry_source='app',
                                  force_upright=number == 2, rotation=90 if number == 2 else 0,
                                  split_from_section='CHỮ THẬP NHỎ'))
    for number, title, x, y in [
        (3, 'NỀN TẢNG', 1, 4), (4, 'QUÁ KHỨ GẦN', 0, 2), (5, 'KẾT QUẢ TRIỂN VỌNG', 1, 0),
        (6, 'TƯƠNG LAI GẦN', 2, 2), (7, 'BẢN NGÃ', 4, 4), (8, 'MÔI TRƯỜNG', 4, 3),
        (9, 'HY VỌNG VÀ NỖI SỢ', 4, 2), (10, 'KẾT QUẢ', 4, 1)]:
        sec = find_section(celtic, title)
        positions.append(position(number, sec['title'].strip('“”"'), sec, x=x, y=y, geometry_source='app'))
    result.append({'id': 'celtic-cross', 'name_vi': 'Celtic Cross', 'source': 'P',
                   'source_ref': celtic['source_ref'], 'card_count': 10, 'positions': positions,
                   'split_method': 'CHỮ THẬP NHỎ: vị trí 1 lấy các câu nói về lá phủ/lá thứ nhất; vị trí 2 lấy các câu nói về lá thứ hai/bắc ngang. Lưu offset từng trích đoạn để đối chiếu; phần ví dụ và diễn giải chung được giữ riêng.',
                   'shared_context_raw': small['raw'], 'shared_context_source_refs': small['source_refs']})

    work = originals['work-cycle']
    layout = find_section(work, 'BỐ CỤC – CÁC VỊ TRÍ VÀ Ý NGHĨA')
    raw = layout['raw']
    cross = segment(raw, raw[:30], 'Sau chữ thập nhỏ')['text']
    beginning = segment(raw, 'Ở mỗi dòng', 'Ba lá tiếp theo')['text']
    activity_start = raw.index('Ba lá tiếp theo')
    result_start = raw.index('Kết quả', activity_start)
    activity, ending = raw[activity_start:result_start], raw[result_start:]
    work_positions = [position(1, 'Trung tâm', layout, cross, shared_meaning=True),
                      position(2, 'bắc ngang', layout, cross, shared_meaning=True),
                      position(3, 'Trải nghiệm Quá khứ', layout, beginning, shared_meaning=True),
                      position(4, 'Mong đợi', layout, beginning, shared_meaning=True)]
    for n in range(5, 8):
        work_positions.append(position(n, 'Hoạt động', layout, activity, shared_meaning=True,
                                       role_note='Nhóm ba lá; không gán riêng Bản ngã/Người khác/Sự kiện.'))
    for n in (8, 9):
        work_positions.append(position(n, None, layout, ending, needs_review=True,
                                       review_reason='Chưa tách chắc chắn tên và nghĩa riêng của hai vị trí cuối; giữ nguyên phần nguồn để duyệt.'))
    result.append({'id': 'work-cycle', 'name_vi': 'Work Cycle', 'source': 'P',
                   'source_ref': work['source_ref'], 'card_count': 9, 'positions': work_positions,
                   'layout_raw': layout['raw'], 'layout_source_refs': layout['source_refs'],
                   'additional_rows': 'optional', 'needs_review': True})

    tree = originals['tree-of-life']
    tree_positions = []
    last = None
    for sec in tree['sections']:
        numbered = re.match(r'^(\d+)\. (.+)$', sec['title'])
        if not numbered:
            continue
        n = int(numbered[1])
        meaning = sec['raw']
        if n == 10:
            last = sec
            boundary = meaning.find('Cuối cùng chúng ta cũng đến Daath')
            if boundary < 0:
                raise ValueError('Missing Daath boundary')
            meaning = meaning[:boundary]
        tree_positions.append(position(n, numbered[2], sec, meaning, position_type='group',
                                       card_count=7))
    if len(tree_positions) != 10 or last is None:
        raise ValueError('Expected ten numbered Sephirah groups')
    daath = segment(last['raw'], 'Cuối cùng chúng ta cũng đến Daath')
    tree_positions.append(position(11, 'Daath', last, daath['text'], position_type='group',
                                   card_count=7, needs_review=True,
                                   review_reason='Daath nằm trong phần cuối mục Malkuth, không có tiêu đề đánh số riêng; cần duyệt nhóm bổ sung.'))
    tree_layout = find_section(tree, 'BỐ CỤC')
    if 'bảy lá' not in tree_layout['raw'] or 'bảy mươi tám' not in tree_layout['raw']:
        raise ValueError('Tree group size not grounded in layout')
    result.append({'id': 'tree-of-life', 'name_vi': 'Tree of Life', 'source': 'P',
                   'source_ref': tree['source_ref'], 'card_count': 78, 'positions': tree_positions,
                   'significator_count': 1, 'layout_raw': tree_layout['raw'],
                   'layout_source_refs': tree_layout['source_refs'], 'needs_review': True})

    for cid, name, labels in [('one-card', '1 lá', ['Lá bài']),
                              ('past-present-future', '3 lá Quá khứ/Hiện tại/Tương lai', ['Quá khứ', 'Hiện tại', 'Tương lai'])]:
        result.append({'id': cid, 'name_vi': name, 'source': 'app', 'source_ref': None,
                       'card_count': len(labels), 'positions': [
                           {'number': n + 1, 'name_vi': label, 'x': n, 'y': 0,
                            'raw_meaning': None, 'source': 'app', 'source_ref': None,
                            'source_refs': [], 'needs_review': False}
                           for n, label in enumerate(labels)]})
    return result


def text_characters(card):
    return sum(len(card[k]) for k in ('name_vi', 'name_en', 'h_desc_raw')) + sum(map(len, card['keywords'])) + \
           sum(len(p['text']) for k in ('p_up_paragraphs', 'p_rev_paragraphs') for p in card[k])


def split_batches(cards, count=6):
    # Ordered minimax partition: minimise the largest text payload, then mixed-arcana groups.
    payloads = [{key: deepcopy(c[key]) for key in BATCH_FIELDS} for c in cards]
    sizes = [text_characters(c) for c in payloads]
    prefix = [0]
    for size in sizes:
        prefix.append(prefix[-1] + size)
    n = len(cards)
    dp = {(0, 0): (0, 0, ())}
    for b in range(1, count + 1):
        for end in range(b, n + 1):
            best = None
            for start in range(b - 1, end):
                previous = dp.get((b - 1, start))
                if previous is None:
                    continue
                mixed = len({c['arcana'] for c in cards[start:end]}) > 1
                candidate = (max(previous[0], prefix[end] - prefix[start]),
                             previous[1] + int(mixed), previous[2] + ((start, end),))
                if best is None or candidate < best:
                    best = candidate
            dp[b, end] = best
    return payloads, sizes, dp[count, n][2]


def main(data_dir, batch_dir, print_courts):
    p, h = read(data_dir / 'raw_p.json'), read(data_dir / 'raw_h.json')
    names, cards = merge_cards(p, h, read(data_dir / 'element_info.json'))
    spreads = merge_spreads(read(data_dir / 'spreads_raw.json'))
    payloads, sizes, partitions = split_batches(cards)
    manifest = {'requested_batch_count': 6, 'requested_text_char_limit': 60000,
                'text_char_definition': 'Python len: tên Việt/Anh + keywords + h_desc_raw + text của các đoạn P; không tính JSON/provenance.',
                'ordering': 'Ẩn Chính trước, rồi id tăng dần; mỗi lô là một khoảng liên tiếp.',
                'total_text_characters': sum(sizes), 'minimum_batches_by_total_size': (sum(sizes) + 59999) // 60000,
                'limit_status': 'infeasible_with_six_full_source_batches' if sum(sizes) > 360000 else 'feasible',
                'policy': 'Giữ đủ chuỗi nguồn và đúng 6 lô; tối thiểu hóa dung lượng lô lớn nhất, ưu tiên ít lô trộn Ẩn Chính/Ẩn Phụ.',
                'batches': []}
    # Validate before writing anything.
    for card in cards:
        original_h = next(c for c in h if c['id'] == card['id'])
        assert card['h_desc_raw'] == original_h['description_raw']
        assert all(isinstance(r, str) and r.startswith(('H-tr.', 'P-tr.')) for r in card['refs']['up'])
        assert all(r.startswith('P-tr.') for r in card['refs']['rev'])
    missing = [c['id'] for c in cards if not c['h_desc_raw'] or not c['p_up_paragraphs'] or not c['p_rev_paragraphs']]
    if missing:
        raise ValueError('Missing card data: ' + ', '.join(missing))
    for filename, content in [('name_map.json', names), ('cards.json', cards), ('spreads.json', spreads)]:
        write(data_dir / filename, content)
    for b, (start, end) in enumerate(partitions, 1):
        filename = f'batch_{b:02d}_input.json'
        group = payloads[start:end]
        write(batch_dir / filename, group)
        chars = sum(sizes[start:end])
        manifest['batches'].append({'file': filename, 'ids': [c['id'] for c in group],
                                    'card_count': len(group), 'text_characters': chars,
                                    'json_characters': len((batch_dir / filename).read_text(encoding='utf-8')),
                                    'over_requested_limit_by': max(0, chars - 60000),
                                    'mixed_arcana': len({c['arcana'] for c in cards[start:end]}) > 1})
    manifest['largest_batch_text_characters'] = max(b['text_characters'] for b in manifest['batches'])
    write(batch_dir / 'manifest.json', manifest)
    # Optional separate name-only display; validation output remains exactly three lines.
    if print_courts:
        for name in names:
            if name['arcana'] == 'minor' and name['number'] >= 11:
                print(f"{name['id']} | {name['name_en']} | {name['name_vi']}")
    print(f"[1c] cards.json: {len(cards)} lá; thiếu h_desc_raw/p_up_paragraphs/p_rev_paragraphs: {len(missing)}.")
    print(f"[1c] mapping_confidence=check: {sum(x['mapping_confidence'] == 'check' for x in names)} lá.")
    print('[1c] Vị trí / needs_review: ' + '; '.join(
        f"{s['id']} {len(s['positions'])}/{sum(p['needs_review'] for p in s['positions'])}" for s in spreads) + '.')


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', type=Path, default=root / 'data')
    parser.add_argument('--batches', type=Path, default=root / 'batches')
    parser.add_argument('--print-courts', action='store_true', help='Print only the 16 court-name mapping rows before validation.')
    args = parser.parse_args()
    main(args.data, args.batches, args.print_courts)
