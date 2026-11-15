import {expect,test} from 'vitest';
import {hasForeignCharacters} from './outputCharacters';
test.each(['canهور','漢字','Привет','ภาษาไทย'])('rejects non-Latin writing: %s',text=>expect(hasForeignCharacters(text)).toBe(true));
test('permits Vietnamese and ordinary punctuation',()=>expect(hasForeignCharacters('Có, nhưng hãy cân nhắc — “một góc nhìn” (2–3 lá).')).toBe(false));
