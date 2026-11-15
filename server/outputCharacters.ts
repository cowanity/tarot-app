/** Latin letters plus combining marks, numbers and ordinary punctuation only. */
export function hasForeignCharacters(text:string):boolean {
 return /[^\p{Script=Latin}\p{M}0-9\p{P}\p{Z}\s+−=<>%&$€£₫°]/u.test(text.normalize('NFC'));
}
