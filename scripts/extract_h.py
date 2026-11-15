#!/usr/bin/env python3
"""Stream Huggens into static raw data; print only one validation line."""
import argparse
import json
import re
from pathlib import Path
from extract_p import MAJORS

ROMANS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
          'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']
MAJOR_NAMES = {
    'fool': 0, 'magician': 1, 'high priestess': 2, 'empress': 3, 'emperor': 4,
    'hierophant': 5, 'lovers': 6, 'chariot': 7, 'strength': 8, 'hermit': 9,
    'wheel of fortune': 10, 'justice': 11, 'hanged man': 12, 'death': 13,
    'temperance': 14, 'devil': 15, 'tower': 16, 'star': 17, 'moon': 18,
    'sun': 19, 'judgement': 20, 'world': 21,
}
SUITS = {'Tiền': 'pentacles', 'Cốc': 'cups', 'Kiếm': 'swords', 'Gậy': 'wands'}
RANKS = dict(zip(['Át', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười'],
                 ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']))
COURTS = {'Tiểu đồng': ('page', 11), 'Hiệp sĩ': ('knight', 12),
          'Hoàng hậu': ('queen', 13), 'Vua': ('king', 14)}
# Reviewed boundaries prevent a short first prose line being mistaken for a wrapped title.
COURT_BODY_STARTS = {
    'pentacles-page': 7371, 'pentacles-knight': 7392, 'pentacles-queen': 7410, 'pentacles-king': 7435,
    'cups-page': 7490, 'cups-knight': 7513, 'cups-queen': 7534, 'cups-king': 7560,
    'swords-page': 7764, 'swords-knight': 7792, 'swords-queen': 7823, 'swords-king': 7858,
    'wands-page': 7918, 'wands-knight': 7954, 'wands-queen': 7986, 'wands-king': 8018,
}
MAJOR_TITLE = re.compile(r'^(0|[IVX]+) (?:The )?([A-Za-z ]+?)(?:\s*\([^)]*\))?$', re.I)
TOC = re.compile(r'^(0|[IVX]+) .+? - (.+)$')
MINOR_TITLE = re.compile(r'^(Át|Hai|Ba|Bốn|Năm|Sáu|Bảy|Tám|Chín|Mười) (Tiền|Cốc|Kiếm|Gậy)$')
COURT_TITLE = re.compile(r'^(Tiểu đồng|Hiệp sĩ|Hoàng hậu|Vua) bộ (Tiền|Cốc|Kiếm|Gậy):')
SUIT_TITLE = re.compile(r'^Chất bài (Tiền/Đất|Cốc/Nước|Kiếm/Khí|Gậy/Lửa)$')
PERSON = re.compile(r'^Với (?:tư|tự) cách cá nhân:')
STOP = re.compile(r'^(?:\*?\s*BÀI TẬP\b|Các câu hỏi cho nhật ký\b|Đọc thêm\b)', re.I)
LITERATURE = re.compile(r'^Trong văn (?:học|chương) và phim ảnh:')
ELEMENTS = {'ĐẤT': ('Đất', 'earth'), 'KHÍ': ('Khí', 'air'),
            'LỬA': ('Lửa', 'fire'), 'NƯỚC': ('Nước', 'water')}
ELEMENT_FIELDS = {'Màu sắc': 'colors', 'Phẩm tính': 'qualities',
                  'Cung hoàng đạo': 'zodiac_signs', 'Mùa trong năm': 'season'}
PAGE_NOTE = 'Số trang ước lượng: đếm ký tự form feed phía trước + 1.'


def trim(rows):
    rows = list(rows)
    while rows and not rows[0][1]:
        rows.pop(0)
    while rows and not rows[-1][1]:
        rows.pop()
    return rows


def joined(rows):
    return ' '.join(t for _, t, _ in rows if t)


def raw_text(rows):
    blocks, block = [], []
    for row in trim(rows):
        if row[1]:
            block.append(row)
        elif block:
            blocks.append(joined(block))
            block = []
    if block:
        blocks.append(joined(block))
    return '\n\n'.join(blocks)


def refs(rows):
    return list(dict.fromkeys(f'H-tr.{p}' for _, t, p in rows if t))


def major_id(number):
    slug = MAJORS[number].lower().replace(' ', '-')
    return f'major-{number:02d}-' + ('judgement' if slug == 'judement' else slug)


def symbols(rows):
    result, current, pending = [], None, []
    terminal = re.compile(r'[.!?…][”"\')\]]*$')
    for row in trim(rows):
        line = row[1]
        if not line:
            continue
        if ':' in line:
            name, meaning = line.split(':', 1)
            if current:
                result.append(current)
            name_rows = pending + [(row[0], name, row[2])]
            current = {'name': joined(name_rows), 'meaning': meaning.strip(),
                       'source_refs': refs(name_rows + [row]), 'line_start': name_rows[0][0],
                       'line_end': row[0]}
            pending = []
        elif pending or current is None or (terminal.search(current['meaning']) and line[0].isupper()):
            pending.append(row)
        else:
            current['meaning'] = (current['meaning'] + ' ' + line).strip()
            current['source_refs'] = list(dict.fromkeys(current['source_refs'] + refs([row])))
            current['line_end'] = row[0]
    if current:
        # If a capitalized continuation has no subsequent colon, it is still meaning text.
        if pending:
            current['meaning'] += ' ' + joined(pending)
            current['source_refs'] = list(dict.fromkeys(current['source_refs'] + refs(pending)))
            current['line_end'] = pending[-1][0]
        result.append(current)
    return result


def description(rows):
    """Drop the translated title and epigraphs before the author's explanatory prose."""
    rows = trim(rows)
    attributions = [i for i, (_, t, _) in enumerate(rows) if t.startswith(('—', '–'))]
    if attributions:
        start = attributions[-1] + 1
        # Attribution itself may wrap (e.g. a Shakespeare play title).
        while start < len(rows) and rows[start][1]:
            start += 1
        return trim(rows[start:])
    # Wheel of Fortune has an unattributed epigraph: prose follows its blank separator.
    while rows and (re.fullmatch(r'\([^)]*\)', rows[0][1]) or not rows[0][1]):
        rows.pop(0)
    separator = next((i for i, row in enumerate(rows) if not row[1]), None)
    return trim(rows[separator + 1:]) if separator is not None else rows


def finalize_major(card):
    fields = card.pop('_fields')
    desc = description(fields['description'])
    card['description_raw'] = raw_text(desc)
    card['symbols'] = symbols(fields['symbols'])
    card['keywords'] = [v.strip().rstrip('.') for v in joined(fields['keywords']).split(',') if v.strip()]
    card['person_note_raw'] = raw_text(fields['person'])
    card['field_source_refs'] = {
        'description_raw': refs(desc), 'symbols': refs(fields['symbols']),
        'keywords': refs(fields['keywords']), 'person_note_raw': refs(fields['person'])}
    card['source_refs'] = list(dict.fromkeys([card['source_ref']] +
                             [r for values in card['field_source_refs'].values() for r in values]))
    card['line_end'] = max([card['line_start']] + [row[0] for rows in fields.values() for row in rows])
    return card


def finalize_minor(card):
    rows = trim(card.pop('_rows'))
    if card.pop('_court', False):
        # Wrapped court correspondences are a heading, not prose. Keep them separately.
        body_line = COURT_BODY_STARTS[card['id']]
        start = next((i for i, row in enumerate(rows) if row[0] >= body_line and row[1]), len(rows))
        if start == len(rows) or rows[start][0] != body_line or not rows[start][1]:
            raise ValueError(f"Court heading layout changed: {card['id']}")
        card['court_correspondence_raw'] = raw_text(rows[:start])
        rows = trim(rows[start:])
    card['description_raw'] = raw_text(rows)
    card['keywords'] = []
    card['source_refs'] = list(dict.fromkeys([card['source_ref']] + refs(rows)))
    card['field_source_refs'] = {'description_raw': refs(rows)}
    card['line_end'] = rows[-1][0] if rows else card['line_start']
    return card


def new_card(cid, name, arcana, suit, number, row):
    ln, _, page = row
    return {'id': cid, 'name_vi': name, 'arcana': arcana, 'suit': suit, 'number': number,
            'line_start': ln, 'source_ref': f'H-tr.{page}', 'source_page_note': PAGE_NOTE}


def extract(source, output):
    cards, toc_names, toc_refs = [], {}, {}
    major, mode, minor = None, None, None
    suit_scope, appendix, element, element_field = None, False, None, None
    elements, element_rows, keyword_anchors = {}, {}, []
    page = 1

    with source.open(encoding='utf-8-sig') as stream:
        for lineno, original in enumerate(stream, 1):
            # Form feeds can be attached to text or occur multiple times on one line.
            for fragment_index, fragment in enumerate(original.split('\f')):
                if fragment_index:
                    page += 1
                line = fragment.strip()
                row = (lineno, line, page)
                if 1106 <= lineno <= 8272 and line.startswith('Từ khóa:'):
                    keyword_anchors.append(lineno)
                if 1138 <= lineno <= 1160:
                    tm = TOC.fullmatch(line)
                    if tm and tm[1] in ROMANS:
                        n = ROMANS.index(tm[1])
                        toc_names[n] = tm[2].split('/')[0]
                        toc_refs[n] = f'H-tr.{page}'

                mt = MAJOR_TITLE.fullmatch(line) if 1106 <= lineno <= 8272 else None
                label = mt[2].strip().casefold() if mt else None
                if label in MAJOR_NAMES:
                    if major:
                        cards.append(finalize_major(major))
                    n = MAJOR_NAMES[label]
                    if ROMANS.index(mt[1].upper()) != n:
                        raise ValueError(f'Unexpected major numbering at line {lineno}')
                    major = new_card(major_id(n), toc_names[n], 'major', None, n, row)
                    major['name_source_ref'] = toc_refs[n]
                    major['title_raw'] = line
                    major['_fields'] = {k: [] for k in ['description', 'symbols', 'keywords', 'person']}
                    mode = 'description'
                    continue
                if major:
                    if STOP.match(line):
                        cards.append(finalize_major(major))
                        major, mode = None, None
                    elif line == 'CÁC BIỂU TƯỢNG PHỔ BIẾN':
                        mode = 'symbols'
                    elif line.startswith('Từ khóa:'):
                        mode = 'keywords'
                        major['_fields'][mode].append((lineno, line.split(':', 1)[1].strip(), page))
                    elif LITERATURE.match(line):
                        mode = 'skip'
                    elif PERSON.match(line):
                        mode = 'person'
                        major['_fields'][mode].append((lineno, line.split(':', 1)[1].strip(), page))
                        if line.startswith('Với tự'):
                            major['normalization_notes'] = ['Nhận diện nhãn gốc “Với tự cách cá nhân” như “Với tư cách cá nhân”.']
                    elif mode != 'skip':
                        major['_fields'][mode].append(row)
                    continue

                sm = SUIT_TITLE.fullmatch(line) if 8520 <= lineno <= 9700 else None
                cm = COURT_TITLE.match(line) if 7340 <= lineno <= 8055 else None
                nm = MINOR_TITLE.fullmatch(line) if suit_scope and 8520 <= lineno <= 9700 else None
                if sm:
                    if minor:
                        cards.append(finalize_minor(minor))
                        minor = None
                    suit_scope = sm[1].split('/')[0]
                    continue
                if cm or (nm and nm[2] == suit_scope):
                    if minor:
                        cards.append(finalize_minor(minor))
                    rank_vi, suit_vi = (cm[1], cm[2]) if cm else (nm[1], nm[2])
                    rank, number = COURTS[rank_vi] if cm else (RANKS[rank_vi], list(RANKS).index(rank_vi) + 1)
                    suit = SUITS[suit_vi]
                    minor = new_card(f'{suit}-{rank}', f'{rank_vi} {suit_vi}', 'minor', suit, number, row)
                    minor['_court'], minor['_rows'] = bool(cm), []
                    minor['title_raw'] = line
                    if cm:
                        minor['extraction_region'] = 'Chương các lá Hoàng gia; sách không lặp các lá này trong mục Át–Mười.'
                        minor['_rows'].append((lineno, line.split(':', 1)[1].strip(), page))
                    continue
                if minor:
                    if STOP.match(line) or line.startswith('Các lá Hoàng gia bộ '):
                        cards.append(finalize_minor(minor))
                        minor = None
                        suit_scope = None
                    else:
                        minor['_rows'].append(row)
                    continue

                if line == 'Phụ lục I':
                    appendix = True
                elif line == 'Phụ lục II':
                    appendix, element, element_field = False, None, None
                elif appendix:
                    if line in ELEMENTS:
                        name, english = ELEMENTS[line]
                        element = name
                        elements[name] = {'name_vi': name, 'name_en': english, 'source_ref': f'H-tr.{page}',
                                          'source_page_note': PAGE_NOTE, 'line_start': lineno}
                        element_rows[name] = {key: [] for key in ELEMENT_FIELDS.values()}
                        element_field = None
                    elif element and ':' in line:
                        field, value = line.split(':', 1)
                        element_field = ELEMENT_FIELDS.get(field)
                        if element_field:
                            element_rows[element][element_field].append((lineno, value.strip(), page))
                    elif element and element_field and line:
                        element_rows[element][element_field].append(row)
    if major:
        cards.append(finalize_major(major))
    if minor:
        cards.append(finalize_minor(minor))

    expected = {major_id(n) for n in range(22)} | {
        f'{s}-{r}' for s in SUITS.values() for r in list(RANKS.values()) + [v[0] for v in COURTS.values()]}
    actual = [c['id'] for c in cards]
    missing = sorted(expected - set(actual))
    duplicates = sorted({cid for cid in actual if actual.count(cid) > 1})
    incomplete = [c['id'] for c in cards if not c['description_raw'] or
                  (c['arcana'] == 'major' and not c['keywords'])]
    errors = []
    if missing:
        errors.append('thiếu id: ' + ', '.join(missing))
    if duplicates:
        errors.append('trùng id: ' + ', '.join(duplicates))
    if set(actual) - expected:
        errors.append('id ngoài danh mục')
    if incomplete:
        errors.append('thiếu description/keywords: ' + ', '.join(incomplete))
    if len(keyword_anchors) != 22:
        errors.append(f'{len(keyword_anchors)}/22 neo Từ khóa')
    if len(toc_names) != 22:
        errors.append('thiếu bảng tên Ẩn Chính')
    if set(elements) != {v[0] for v in ELEMENTS.values()}:
        errors.append('thiếu nguyên tố')
    for name, info in elements.items():
        fields = element_rows[name]
        for field, rows in fields.items():
            value = joined(rows)
            info[field] = value if field == 'season' else [v.strip() for v in value.split(',') if v.strip()]
            if not value:
                errors.append(f'thiếu {name}.{field}')
        info['field_source_refs'] = {field: refs(rows) for field, rows in fields.items()}
        info['source_refs'] = list(dict.fromkeys([info['source_ref']] +
                                 [r for values in info['field_source_refs'].values() for r in values]))
        info['line_end'] = max(row[0] for rows in fields.values() for row in rows)
    if errors:
        print('[H] FAIL; ' + '; '.join(errors) + '.')
        return 1
    cards.sort(key=lambda c: (c['arcana'] != 'major', list(SUITS.values()).index(c['suit'])
                             if c['suit'] else -1, c['number']))
    output.mkdir(parents=True, exist_ok=True)
    for filename, content in [('raw_h.json', cards), ('element_info.json', elements)]:
        (output / filename).write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('[H] Đủ 78/78 lá; thiếu description/keywords: 0; đủ 4/4 nguyên tố (trang ước lượng).')
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1] /
                        'project_sources/01-TAROT-Nha-p-Mo-n-Kim-Huggens-Thie-n-Huy-di-ch-.txt')
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'data')
    args = parser.parse_args()
    try:
        status = extract(args.source, args.output)
    except (ValueError, KeyError, OSError) as error:
        print(f'[H] FAIL; {error}.')
        status = 1
    raise SystemExit(status)
