#!/usr/bin/env python3
"""Annotate the existing P extraction without reopening or extracting the book."""
import json
from pathlib import Path

# Reviewed paragraph starts: each discusses the current card's reversed meaning.
# A match on the word 'ngược' alone is deliberately insufficient.
EXPLICIT_STARTS = {
    0: {940, 948, 951, 957},
    1: {1127, 1132, 1135, 1155},
    2: {1383},
    3: {1548},
    4: {1724},
    5: {1890},
    6: {2122, 2128},
    7: {2319},
    8: {2562},
    9: {2754, 2759, 2761},
    10: {3009},
    11: {3194, 3195, 3200},
    12: {3308, 3314},
    13: {3471},
    14: {3597},
    15: {3823, 3841},
    16: {3999},
    17: {4093},
    18: {4223, 4233},
    19: {4355},
    20: {4481},
    21: {4595, 4609},
}


def main():
    path = Path(__file__).resolve().parents[1] / 'data/raw_p.json'
    cards = json.loads(path.read_text(encoding='utf-8'))
    majors = [c for c in cards if c['arcana'] == 'major']
    assert len(majors) == 22
    for card in majors:
        expected = EXPLICIT_STARTS[card['number']]
        actual = {p['line_start'] for p in card['reversed_paragraphs']}
        if not expected <= actual:
            raise ValueError(f"Paragraph layout changed: {card['id']}")
        for paragraph in card['reversed_paragraphs']:
            paragraph['reversed_quality'] = ('explicit' if paragraph['line_start'] in expected else 'weak')
        card['reversed_has_explicit'] = any(p['reversed_quality'] == 'explicit'
                                           for p in card['reversed_paragraphs'])
    six = next(c for c in cards if c['id'] == 'pentacles-six')
    for paragraph in six['upright_paragraphs']:
        if paragraph['line_start'] > 7190:
            paragraph['off_topic'] = True
    path.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"[P] Ẩn Chính thiếu nghĩa ngược explicit: {sum(not c['reversed_has_explicit'] for c in majors)}/22 lá.")


if __name__ == '__main__':
    main()
