"""Validate an offline draft; never write partial or invalid lens data. No network."""
import json
from pathlib import Path
import re
import sys
import unicodedata

FIELDS = ('essence', 'gift', 'shadow', 'question')


def fold(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text.lower()) if not unicodedata.combining(c)).replace('đ', 'd')


def validate(data):
    errors, seen = [], set()
    if not isinstance(data, list):
        return ['Toàn bộ: cần mảng JSON 11 mục.']
    for row in data:
        n = row.get('number') if isinstance(row, dict) else None
        if type(n) is not int or not 1 <= n <= 11:
            errors.append('Số ?: number phải là số nguyên 1..11.')
            continue
        if n in seen:
            errors.append(f'Số {n}: trùng số.')
        seen.add(n)
        if set(row) != {'number', *FIELDS}:
            errors.append(f'Số {n}: thiếu/thừa trường (không chấp nhận placeholder).')
        for field in FIELDS:
            text = row.get(field)
            if not isinstance(text, str) or not text.strip() or len(text) > 220:
                errors.append(f'Số {n}: {field} cần chuỗi không rỗng, tối đa 220 ký tự.')
                continue
            # Conservatively require a single final sentence terminator, no abbreviation/ellipsis.
            if not re.fullmatch(r'[^.!?…\r\n]+[.!?]', text.strip()) or (field == 'question' and not text.strip().endswith('?')):
                errors.append(f'Số {n}: {field} cần đúng một câu (question là câu hỏi).')
            if re.search(r'\b(?:may\s+man|xui|dinh\s+menh|chac\s+chan|bat\s+hanh)\b', fold(text)):
                errors.append(f'Số {n}: {field} có từ cấm.')
    errors.extend(f'Số {n}: thiếu mục.' for n in range(1, 12) if n not in seen)
    if len(data) != 11:
        errors.append('Toàn bộ: cần đúng 11 mục.')
    return errors


def main():
    if len(sys.argv) != 2:
        print('Dùng: python3 scripts/check_numberLens.py numberLens_draft.json')
        return 1
    try:
        data = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        print('Toàn bộ: không đọc được JSON hợp lệ.')
        return 1
    errors = validate(data)
    if errors:
        print('\n'.join(errors))
        return 1
    output = Path(__file__).resolve().parents[1] / 'src/data/numberLens.json'
    temp = output.with_suffix('.json.tmp')
    temp.write_text(json.dumps(sorted(data, key=lambda row: row['number']), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(output)
    print('Hợp lệ: đã ghi 11 góc nhìn số.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
