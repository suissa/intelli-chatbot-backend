export class HyperPhoneticMatcher {
  private medicamentos: string[];
  private soundexMap: Record<string, string[]> = {};

  constructor(medicamentos: string[]) {
    this.medicamentos = medicamentos;
    this.buildSoundexMap();
  }

  private phoneticNormalize(word: string): string {
    return word
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ph/g, 'f')
      .replace(/ch|sh|x/g, 'x')
      .replace(/ss|ç|sc|s/g, 's')
      .replace(/z/g, 's')
      .replace(/qu|k/g, 'k')
      .replace(/lh/g, 'l')
      .replace(/nh/g, 'n')
      .replace(/gu/g, 'g')
      .replace(/[^a-z]/g, '')
      .trim();
  }

  private soundex(value: string): string {
    const cleaned = this.phoneticNormalize(value).toUpperCase();
    if (!cleaned) return '';
    const firstLetter = cleaned[0];
    const mappings: Record<string, string> = {
      B: '1', F: '1', P: '1', V: '1',
      C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
      D: '3', T: '3',
      L: '4',
      M: '5', N: '5',
      R: '6',
    };
    let encoded = '';
    for (let i = 1; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (!char) continue;
      const code = mappings[char] || '';
      if (code && code !== mappings[cleaned[i - 1] || '']) {
        encoded += code;
      }
    }
    return (firstLetter + encoded).padEnd(4, '0').slice(0, 4);
  }

  private buildSoundexMap() {
    for (const nome of this.medicamentos) {
      const code = this.soundex(nome);
      if (!this.soundexMap[code]) this.soundexMap[code] = [];
      this.soundexMap[code].push(nome);
    }
  }

  public match(query: string): { soundexMatches: string[], fuzzyMatches: string[] } {
    const queryNorm = this.phoneticNormalize(query);
    const soundexMatches = this.soundexMap[this.soundex(query)] || [];
    const fuzzyMatches = this.fuzzyMatch(queryNorm);
    return { soundexMatches, fuzzyMatches };
  }

  private fuzzyMatch(query: string, maxResults = 5): string[] {
    return this.medicamentos
      .map(nome => ({
        nome,
        score: this.levenshtein(query, this.phoneticNormalize(nome)),
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, maxResults)
      .map(r => r.nome);
  }

  private levenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i]![0] = i || 0;
    for (let j = 0; j <= b.length; j++) dp[0]![j] = j || 0;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i]![j] = dp[i - 1]![j - 1] || 0;
        } else {
          dp[i]![j] = 1 + Math.min(dp[i - 1]![j] || 0, dp[i]![j - 1] || 0, dp[i - 1]![j - 1] || 0);
        }
      }
    }
    return dp[a.length]![b.length] || 0;
  }
}
