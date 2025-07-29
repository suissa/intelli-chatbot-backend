
import { fuzzyMatch, matchBySoundex, soundex } from "./medicamentos_match_utils";
import { keyboardDistance } from "./keyboard_distance";

// Simulação de chamada à OpenAI (substitua pela real)
async function fallbackOpenAI(query: string): Promise<string[]> {
  // Aqui você chamaria a API da OpenAI com função de recuperação
  // Exemplo fictício:
  return ["OpenAI sugeriu: " + query];
}

export async function matchCascade(query: string, threshold = 0.85, maxResults = 5): Promise<{ nome: string, score: number }[]> {
  const sxCode = soundex(query);
  const candidatos = matchBySoundex(query);

  if (candidatos.length > 0) {
    const scored = candidatos.map(nome => ({
      nome,
      score: keyboardDistance(query, nome)
    }));

    const filtrados = scored
      .map(r => ({
        ...r,
        similarity: 1 - r.score / Math.max(query.length, r.nome.length)
      }))
      .filter(r => r.similarity >= threshold)
      .sort((a, b) => a.score - b.score)
      .slice(0, maxResults)
      .map(r => ({ nome: r.nome, score: r.similarity }));

    if (filtrados.length > 0) return filtrados;
  }

  // Fallback inteligente com fuzzyMatch
  const fuzzy = fuzzyMatch(query, maxResults).filter(r => r.score <= 3);
  if (fuzzy.length > 0) return fuzzy;

  // Fallback final: chama OpenAI
  const openaiResults = await fallbackOpenAI(query);
  return openaiResults.map(nome => ({ nome, score: 1 }));
}
