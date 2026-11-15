#!/usr/bin/env python3
"""Tải 78 ảnh RWS (bộ quét Pam-A/TaionWC) và đổi sang WebP.

python3 -m pip install pillow
python3 download_cards.py --dry
python3 download_cards.py

Mặc định đọc src/data/cards.json nếu có; nếu không, dùng danh sách 78 ID
đã đối chiếu với cards.json đính kèm. Chạy từ thư mục gốc dự án.
Nguồn: https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(TaionWC)
Không khẳng định niên đại của bản in chỉ từ năm ra đời thiết kế RWS.
"""
import argparse
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

MAJOR = ['Fool', 'Magician', 'High Priestess', 'Empress', 'Emperor',
         'Hierophant', 'Lovers', 'Chariot', 'Strength', 'Hermit',
         'Wheel of Fortune', 'Justice', 'Hanged Man', 'Death', 'Temperance',
         'Devil', 'Tower', 'Star', 'Moon', 'Sun', 'Judgement', 'World']
PREFIX = {'cups': 'Cups', 'pentacles': 'Pents', 'swords': 'Swords', 'wands': 'Wands'}
RANK = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
        'nine', 'ten', 'page', 'knight', 'queen', 'king']
UA = os.environ.get('TAROT_USER_AGENT', 'TarotVietImageDownloader/1.0 (personal project)')


def bundled_cards():
    cards = [dict(id=f'major-{n:02d}-' + name.lower().replace(' ', '-'),
                  arcana='major', number=n, suit=None) for n, name in enumerate(MAJOR)]
    cards += [dict(id=f'{suit}-{rank}', arcana='minor', number=n, suit=suit)
              for suit in PREFIX for n, rank in enumerate(RANK, 1)]
    return cards


def filename(card):
    n = card['number']
    if card['arcana'] == 'major':
        return f'RWS Tarot {n:02d} {MAJOR[n]}.jpg'
    return f"{PREFIX[card['suit']]}{n:02d}.jpg"


def validate(cards):
    if not isinstance(cards, list) or len(cards) != 78:
        raise ValueError('Cần danh sách đúng 78 lá.')
    ids, faces = set(), set()
    for c in cards:
        cid, n = c['id'], c['number']
        if not isinstance(cid, str) or not re.fullmatch(r'[a-z0-9_-]+', cid) or cid in ids:
            raise ValueError(f'ID không hợp lệ hoặc trùng: {cid}')
        ids.add(cid)
        if type(n) is not int:
            raise ValueError(f'number phải là số nguyên: {cid}')
        if c['arcana'] == 'major' and 0 <= n <= 21:
            face = ('major', n)
        elif c['arcana'] == 'minor' and c.get('suit') in PREFIX and 1 <= n <= 14:
            face = (c['suit'], n)
        else:
            raise ValueError(f'arcana/suit/number không hợp lệ: {cid}')
        if face in faces:
            raise ValueError(f'Lá bị lặp: {cid}')
        faces.add(face)


def page_url(name):
    return 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(name.replace(' ', '_'))


def fetch(name):
    # Lấy ảnh gốc rồi resize tại máy, tránh phụ thuộc kích thước thumbnail server.
    url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(name.replace(' ', '_'))
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as response:
                return response.read()
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise
            retry = exc.headers.get('Retry-After', '')
            # Nếu server yêu cầu đợi lâu, dừng để người dùng chạy lại sau.
            if retry.isdigit() and int(retry) > 60:
                raise
            time.sleep(max(2 ** (attempt + 1), int(retry) if retry.isdigit() else 0))
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(2 ** (attempt + 1))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--cards', type=Path, help='Đường dẫn cards.json khác')
    parser.add_argument('--out', type=Path, default=Path('public/cards'))
    parser.add_argument('--width', type=int, default=700)
    parser.add_argument('--dry', action='store_true', help='Chỉ kiểm tra tên file, không truy cập mạng')
    args = parser.parse_args()
    if args.width < 1:
        parser.error('--width phải lớn hơn 0')
    source = args.cards or Path('src/data/cards.json')
    cards = json.loads(source.read_text(encoding='utf-8')) if args.cards or source.exists() else bundled_cards()
    validate(cards)
    if args.dry:
        for c in cards:
            print(f"{c['id']}.webp -> {filename(c)}")
        print(f'{len(cards)} lá hợp lệ. Chưa tải ảnh.')
        return 0
    try:
        from PIL import Image, ImageOps
    except ImportError:
        parser.error('Cài Pillow trước: python3 -m pip install pillow')
    args.out.mkdir(parents=True, exist_ok=True)
    failed, skipped, saved = [], 0, 0
    for index, c in enumerate(cards):
        dest = args.out / (c['id'] + '.webp')
        if dest.exists():
            try:
                with Image.open(dest) as old:
                    old.verify()
                skipped += 1
                continue
            except (OSError, ValueError):
                pass  # Ảnh hỏng sẽ được tải lại.
        temp = dest.with_suffix('.webp.tmp')
        try:
            data = fetch(filename(c))
            with Image.open(io.BytesIO(data)) as original:
                img = ImageOps.exif_transpose(original).convert('RGB')
                if img.width > args.width:
                    img = img.resize((args.width, max(1, round(img.height * args.width / img.width))), Image.Resampling.LANCZOS)
                img.save(temp, 'WEBP', quality=85, method=6)
            temp.replace(dest)
            saved += 1
            print('OK', dest.name, img.size, flush=True)
        except (OSError, ValueError) as exc:
            failed.append({'id': c['id'], 'source': page_url(filename(c)), 'error': str(exc)})
            print('THIẾU', c['id'], str(exc), flush=True)
            if isinstance(exc, urllib.error.HTTPError) and exc.code in (403, 429):
                failed.extend({'id': rest['id'], 'source': page_url(filename(rest)),
                               'error': 'Chưa thử: đã dừng vì HTTP 403/429.'}
                              for rest in cards[index + 1:] if not (args.out / (rest['id'] + '.webp')).exists())
                print('Máy chủ từ chối/giới hạn tải. Dừng; hãy chạy lại sau hoặc tải thủ công từ source.')
                break
        finally:
            temp.unlink(missing_ok=True)
            time.sleep(1)
    (args.out / 'download-failures.json').write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding='utf-8')
    credits = ['Rider-Waite-Smith — Pamela Colman Smith / A. E. Waite.',
               'Nguồn ảnh: bộ quét Pam-A do TaionWC đăng trên Wikimedia Commons.',
               'Xem nguồn gốc và giấy phép cụ thể tại các trang ảnh dưới đây.', '']
    credits += [f"{c['id']}.webp\t{page_url(filename(c))}" for c in cards]
    (args.out / 'CREDITS.txt').write_text('\n'.join(credits) + '\n', encoding='utf-8')
    print(f'Đã tải mới: {saved}; bỏ qua ảnh hợp lệ: {skipped}; lỗi/chưa tải: {len(failed)}.')
    return 1 if failed else 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f'Lỗi: {exc}', file=sys.stderr)
        sys.exit(1)
