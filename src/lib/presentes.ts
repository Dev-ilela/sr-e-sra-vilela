/**
 * Leitura dos presentes cadastrados no Supabase.
 *
 * Usa a API REST direto (sem SDK): é só uma leitura pública, protegida por RLS,
 * e assim a página continua estática com revalidação periódica.
 */

export type TipoPresente = "magalu" | "pix";

export type Presente = {
  id: string;
  tipo: TipoPresente;
  nome: string;
  descricao: string | null;
  valor: number;
  imagem_url: string | null;
  link_url: string | null;
  /** Sticker do tipo de item, que aparece quando ele é presenteado. */
  sticker: string | null;
};

/** Doação confirmada pelos noivos, como o site vê (sem o nome de quem pediu anonimato). */
export type Doacao = {
  id: string;
  presente_id: string | null;
  nome_publico: string | null;
  forma: "pix" | "objeto";
  agradecimento: string | null;
  confirmado_em: string;
};

/** De quanto em quanto tempo (segundos) o site busca de novo a lista no banco. */
export const REVALIDAR_PRESENTES = 300;

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Presentes ativos, na ordem cadastrada. Se o banco não responder, devolve null
 * para a página cair no plano B (link direto para a lista da Magalu).
 */
export async function buscarPresentes(): Promise<Presente[] | null> {
  if (!URL_SUPABASE || !CHAVE_PUBLICA) {
    console.warn("[presentes] Variáveis do Supabase ausentes; exibindo só o link da lista.");
    return null;
  }

  const campos = "id,tipo,nome,descricao,valor,imagem_url,link_url,sticker";
  const url = `${URL_SUPABASE}/rest/v1/presentes?select=${campos}&order=ordem.asc,created_at.asc`;

  try {
    const resposta = await fetch(url, {
      headers: { apikey: CHAVE_PUBLICA, Accept: "application/json" },
      next: { revalidate: REVALIDAR_PRESENTES, tags: ["presentes"] },
    });
    if (!resposta.ok) {
      console.error(`[presentes] Supabase respondeu ${resposta.status}`);
      return null;
    }
    const linhas: Presente[] = await resposta.json();
    // numeric chega como número pelo PostgREST, mas garantimos o tipo.
    return linhas.map((p) => ({ ...p, valor: Number(p.valor) }));
  } catch (erro) {
    console.error("[presentes] Falha ao buscar presentes", erro);
    return null;
  }
}

/**
 * Doações já confirmadas, agrupadas por presente. Se o banco não responder, a lista
 * aparece sem nenhum item marcado (melhor do que não aparecer).
 */
export async function buscarDoacoes(): Promise<Map<string, Doacao[]>> {
  const porPresente = new Map<string, Doacao[]>();
  if (!URL_SUPABASE || !CHAVE_PUBLICA) return porPresente;

  const campos = "id,presente_id,nome_publico,forma,agradecimento,confirmado_em";
  const url = `${URL_SUPABASE}/rest/v1/doacoes?select=${campos}&order=confirmado_em.asc`;
  try {
    const resposta = await fetch(url, {
      headers: { apikey: CHAVE_PUBLICA, Accept: "application/json" },
      next: { revalidate: REVALIDAR_PRESENTES, tags: ["presentes"] },
    });
    if (!resposta.ok) {
      console.error(`[presentes] Supabase respondeu ${resposta.status} nas doações`);
      return porPresente;
    }
    const linhas: Doacao[] = await resposta.json();
    for (const d of linhas) {
      const chave = d.presente_id ?? "livre";
      porPresente.set(chave, [...(porPresente.get(chave) ?? []), d]);
    }
  } catch (erro) {
    console.error("[presentes] Falha ao buscar doações", erro);
  }
  return porPresente;
}

/** "Ana", "Ana e João", "Ana, João e mais 2" (quem pediu anonimato conta, mas não aparece). */
export function quemPresenteou(doacoes: Doacao[]): string {
  const nomes = doacoes.map((d) => d.nome_publico).filter((n): n is string => !!n);
  const anonimos = doacoes.length - nomes.length;
  if (nomes.length === 0) return anonimos > 1 ? `${anonimos} pessoas especiais` : "alguém especial";
  const mostrados = nomes.slice(0, 2);
  const resto = doacoes.length - mostrados.length;
  if (resto === 0) return mostrados.length === 2 ? `${mostrados[0]} e ${mostrados[1]}` : mostrados[0];
  return `${mostrados.join(", ")} e mais ${resto}`;
}
