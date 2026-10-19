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

  const campos = "id,tipo,nome,descricao,valor,imagem_url,link_url";
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
