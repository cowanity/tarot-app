"""Probe only synthetic content, never print keys, prompts or provider response bodies.
Docs: https://ai.google.dev/gemini-api/docs/generate-content/thinking
Run from tarot-app/: python3 scripts/check_gemini.py [--schema] (reads local .env if present).
A 200 only confirms parameter acceptance, not interpretation quality.
"""
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request


def response_schema_v2():
    # Probe exactly the schema used by the provider; never load card data.
    return json.loads((Path(__file__).resolve().parents[1] / 'server' / 'geminiResponseSchema.json').read_text(encoding='utf-8'))


def main():
    schema_mode = '--schema' in sys.argv[1:]
    env = dict(os.environ)
    path = Path(__file__).resolve().parents[1] / '.env'
    if path.is_file():
        for line in path.read_text(encoding='utf-8').splitlines():
            match = re.match(r'^\s*(?:export\s+)?(GEMINI_API_KEY|AI_MODEL)\s*=\s*(.*?)\s*$', line)
            if match:
                value = match[2]
                if value[:1] in ('"', "'") and value[-1:] == value[:1]:
                    value = value[1:-1]
                else:
                    value = value.split(' #', 1)[0].strip()
                env.setdefault(match[1], value)
    key = env.get('GEMINI_API_KEY', '').strip()
    if not key:
        print('MISSING_GEMINI_API_KEY: không bật tham số chưa được xác minh.')
        return 1
    model = env.get('AI_MODEL', 'gemini-2.5-flash').strip()
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{0,127}', model):
        print('INVALID_AI_MODEL')
        return 1
    # 2.5 uses budgets; 3+ uses levels. Never send both in one request.
    if schema_mode:
        candidates = [{'responseSchema': response_schema_v2()}]
    elif model.startswith('gemini-2.5-'):
        candidates = [{'thinkingBudget': 128}] if 'pro' in model else [{'thinkingBudget': 0}, {'thinkingBudget': 512}]
    elif re.match(r'^gemini-[3-9](?:[.-])', model):
        candidates = [{'thinkingLevel': 'low'}]
    else:
        print('UNSUPPORTED_MODEL_FAMILY: không thêm tham số.')
        return 1
    url = 'https://generativelanguage.googleapis.com/v1beta/models/' + urllib.parse.quote(model, safe='') + ':generateContent'
    # Do not forward the credential through HTTP redirects.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    opener = urllib.request.build_opener(NoRedirect)
    for config in candidates:
        generation = {'maxOutputTokens': 6500, 'responseMimeType': 'application/json'}
        generation.update(config if schema_mode else {'thinkingConfig': config})
        prompt = 'Return a minimal fictional Vietnamese reading matching the V2 schema with one per_card item at position 1, no personal data.' if schema_mode else 'Return a JSON object with ok set to true.'
        body = {'contents': [{'role': 'user', 'parts': [{'text': prompt}]}],
                'generationConfig': generation}
        request = urllib.request.Request(url, data=json.dumps(body).encode(), method='POST',
                                         headers={'Content-Type': 'application/json', 'x-goog-api-key': key})
        try:
            with opener.open(request, timeout=30) as response:
                status = response.status
        except urllib.error.HTTPError as error:
            status = error.code
            error.close()
        except Exception:
            print('GEMINI_NETWORK: không bật tham số.')
            return 1
        print(json.dumps({'status': status, 'parameter': 'responseSchema' if schema_mode else 'thinkingConfig', 'accepted': status == 200}))
        if status == 200:
            return 0  # Only this configuration is eligible to be added for this exact model.
        if status == 400:
            print('HTTP_400: bỏ tham số đã bị từ chối; thử cấu hình tiếp theo nếu có.')
        else:
            return 1
    return 1


if __name__ == '__main__':
    sys.exit(main())
