const smallWords = new Set(['of', 'the', 'and', 'in', 'on', 'a', 'an', 'to', 'for']);

export function titleCase(name: string): string {
  let first = true;
  return name.toLowerCase().replace(/[a-z]+/g, (word) => {
    const capitalized = first || !smallWords.has(word);
    first = false;
    return capitalized ? word[0].toUpperCase() + word.slice(1) : word;
  });
}
