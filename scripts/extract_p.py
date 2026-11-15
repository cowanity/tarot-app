#!/usr/bin/env python3
"""Extract Pollack locally; never print book text or read the whole file into memory."""
import argparse
import json
import re
from pathlib import Path

PAGE = re.compile(r'^T\s*r\s*a\s*n\s*g\s+(\d+)\s*\|\s*276$')
CARD = re.compile(r'^LÁ (THE [A-Z ]+|KING|QUEEN|KNIGHT|PAGE|TEN|NINE|EIGHT|SEVEN|SIX|FIVE|FOUR|THREE|TWO|ACE)$')
SUIT = re.compile(r'^CHƯƠNG [IVX]+: CÁC LÁ (WAND|CUP|SWORDS|PENTACLE)$')
RANKS = dict(zip('ACE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE TEN PAGE KNIGHT QUEEN KING'.split(), range(1, 15)))
SUITS = {'WAND': 'wands', 'CUP': 'cups', 'SWORDS': 'swords', 'PENTACLE': 'pentacles'}
MAJORS = 'FOOL|MAGICIAN|HIGH PRIESTESS|EMPRESS|EMPEROR|HIEROPHANT|LOVERS|CHARIOT|STRENGTH|HERMIT|WHEEL OF FORTUNE|JUSTICE|HANGED MAN|DEATH|TEMPERANCE|DEVIL|TOWER|STAR|MOON|SUN|JUDEMENT|WORLD'.split('|')
SPREADS = {'THẾ CELTIC CROSS': 'celtic-cross', 'THẾ WORK CYCLE': 'work-cycle', 'THẾ TREE OF LIFE': 'tree-of-life'}


def refs(rows):
    return list(dict.fromkeys(f'P-tr.{page}' for _, _, page in rows if page is not None))


def trim(rows):
    rows = list(rows)
    while rows and not rows[0][1]:
        rows.pop(0)
    while rows and not rows[-1][1]:
        rows.pop()
    return rows


def text(rows):
    # Join only physical wrapped lines; retain explicit paragraph separators.
    chunks, current = [], []
    for _, line, _ in rows:
        if line:
            current.append(line)
        elif current:
            chunks.append(' '.join(current))
            current = []
    if current:
        chunks.append(' '.join(current))
    return '\n\n'.join(chunks)


def paragraphs(rows):
    """Heuristic for PDF text with no indentation; keep provenance for review."""
    result, current = [], []
    for row in trim(rows):
        line = row[1]
        if not line:
            if current:
                result.append(current)
                current = []
            continue
        if current:
            prev = current[-1][1]
            # New uppercase sentence after a terminal mark approximates a paragraph.
            if re.search(r'[.!?…][”"\')\]]*$', prev) and line[0].isupper():
                result.append(current)
                current = []
        current.append(row)
    if current:
        result.append(current)
    return [{'text': text(block), 'line_start': block[0][0],
             'line_end': block[-1][0], 'source_refs': refs(block)} for block in result]


def finish_card(card):
    rows = trim(card.pop('_rows'))
    card['line_end'] = rows[-1][0] if rows else card['line_start']
    if card['arcana'] == 'minor':
        marks = [i for i, row in enumerate(rows) if row[1] == 'NGHĨA NGƯỢC']
        card['reversed_heading_count'] = len(marks)
        cut = marks[0] if marks else len(rows)
        up, rev = trim(rows[:cut]), trim(rows[cut + 1:]) if marks else []
        card['upright_raw'], card['reversed_raw'] = text(up), text(rev)
        card['upright_source_refs'], card['reversed_source_refs'] = refs(up), refs(rev)
        card['upright_paragraphs'], card['reversed_paragraphs'] = paragraphs(up), paragraphs(rev)
    else:
        blocks = paragraphs(rows)
        up = [p for p in blocks if 'ngược' not in p['text'].casefold()]
        rev = [p for p in blocks if 'ngược' in p['text'].casefold()]
        card['upright_raw'] = '\n\n'.join(p['text'] for p in up)
        card['reversed_raw'] = '\n\n'.join(p['text'] for p in rev)
        card['upright_source_refs'] = list(dict.fromkeys(r for p in up for r in p['source_refs']))
        card['reversed_source_refs'] = list(dict.fromkeys(r for p in rev for r in p['source_refs']))
        card['upright_paragraphs'], card['reversed_paragraphs'] = up, rev
        card['paragraph_boundary_method'] = 'explicit blank or terminal punctuation followed by uppercase line; heuristic'
    return card


def finish_spread(spread):
    rows = trim(spread.pop('_rows'))
    spread['raw'] = text(rows)
    spread['source_refs'] = refs(rows)
    spread['line_end'] = rows[-1][0] if rows else spread['line_start']
    # Preserve all section headings verbatim, including examples. No invented positions.
    starts = [i for i, (_, line, _) in enumerate(rows)
              if line and ((line.isupper() and len(line) <= 100)
                           or re.match(r'^\d{1,2}\. [A-ZĐ]', line))]
    sections = []
    for n, start in enumerate(starts):
        end = starts[n + 1] if n + 1 < len(starts) else len(rows)
        section = trim(rows[start + 1:end])
        ln, title, page = rows[start]
        sections.append({'title': title, 'raw': text(section),
                         'source_ref': f'P-tr.{page}', 'source_refs': refs([rows[start]] + section),
                         'line_start': ln, 'line_end': rows[end - 1][0]})
    spread['sections'] = sections
    return spread


def extract(source, output):
    cards, spreads = [], []
    page, suit, active, spread, in_spreads = None, None, None, None, False
    # Metadata/header blanks must not split a sentence continued on the next page.
    pending_blanks = []
    page_framing = False
    with source.open(encoding='utf-8-sig') as stream:
        for lineno, original in enumerate(stream, 1):
            line = original.strip().replace('\f', '').strip()
            match = PAGE.fullmatch(line)
            if match:
                page = int(match[1])
                pending_blanks.clear()
                page_framing = True
                continue
            if line == 'TAROT 78 ĐỘ MINH TRIẾT' or '\f' in original:
                pending_blanks.clear()
                page_framing = True
                continue
            if not line:
                if not page_framing:
                    pending_blanks.append((lineno, '', page))
                continue
            page_framing = False
            structural = line.startswith(('CHƯƠNG ', 'PHẦN ')) and '...' not in line
            if structural:
                if active:
                    cards.append(finish_card(active))
                    active = None
                if spread:
                    spreads.append(finish_spread(spread))
                    spread = None
                pending_blanks.clear()
                sm = SUIT.fullmatch(line)
                suit = SUITS[sm[1]] if sm else None
                in_spreads = line == 'CHƯƠNG VI: CÁC THẾ BÀI'
                continue
            cm = CARD.fullmatch(line)
            if cm:
                if active:
                    cards.append(finish_card(active))
                label = cm[1]
                major = label.startswith('THE ')
                if major:
                    number = MAJORS.index(label[4:])
                    slug = label[4:].lower().replace(' ', '-')
                    if slug == 'judement':
                        slug = 'judgement'
                    cid = f'major-{number:02d}-{slug}'
                else:
                    if not suit:
                        raise ValueError(f'No suit at line {lineno}')
                    number, cid = RANKS[label], f'{suit}-{label.lower()}'
                active = {'id': cid, 'name_en': label if major else f'{label.title()} of {suit.title()}',
                          'title_raw': line, 'arcana': 'major' if major else 'minor',
                          'suit': None if major else suit, 'number': number,
                          'source_ref': f'P-tr.{page}', 'line_start': lineno, '_rows': []}
                pending_blanks.clear()
                continue
            if in_spreads and line in SPREADS:
                if spread:
                    spreads.append(finish_spread(spread))
                spread = {'id': SPREADS[line], 'title_raw': line, 'source_ref': f'P-tr.{page}',
                          'line_start': lineno, '_rows': []}
                pending_blanks.clear()
                continue
            target = active or spread
            if target:
                target['_rows'].extend(pending_blanks)
                target['_rows'].append((lineno, line, page))
            pending_blanks.clear()
    if active:
        cards.append(finish_card(active))
    if spread:
        spreads.append(finish_spread(spread))

    expected = {f'major-{i:02d}-' + ('judgement' if name == 'JUDEMENT' else name.lower().replace(' ', '-'))
                for i, name in enumerate(MAJORS)}
    expected |= {f'{s}-{r.lower()}' for s in SUITS.values() for r in RANKS}
    actual = {c['id'] for c in cards}
    missing = sorted(expected - actual)
    incomplete = [c['id'] for c in cards if not c['upright_raw'] or not c['reversed_raw']
                  or not c['upright_source_refs'] or not c['reversed_source_refs']]
    if len(cards) != len(actual) or actual - expected:
        raise ValueError('Duplicate or unexpected card IDs')
    if any(c.get('reversed_heading_count', 1) != 1 for c in cards):
        raise ValueError('Expected exactly one reversed heading per minor card')
    if {s['id'] for s in spreads} != set(SPREADS.values()):
        raise ValueError('Missing spread section')
    output.mkdir(parents=True, exist_ok=True)
    for filename, value in [('raw_p.json', cards), ('spreads_raw.json', {
            'book': 'P', 'source_file': source.name,
            'page_rule': 'nearest preceding printed page marker',
            'spreads': spreads})]:
        (output / filename).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    total_missing = len(set(missing + incomplete))
    print(f'[P] Đủ {len(cards) - len(incomplete)}/78 lá; thiếu {total_missing}'
          + (': ' + ', '.join(missing + incomplete) if total_missing else '') + '.')
    return total_missing


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1] / 'project_sources/02-TAROT-78-O-MINH-TRIE-T.txt')
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'data')
    args = parser.parse_args()
    raise SystemExit(1 if extract(args.source, args.output) else 0)
