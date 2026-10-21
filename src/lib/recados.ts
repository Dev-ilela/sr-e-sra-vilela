/**
 * Mural de post-its: tipos, cores e acesso ao Supabase (API REST, sem SDK).
 * Quem protege os dados é o RLS: o visitante só lê os aprovados e só grava pendentes.
 */

export const CORES = ["amarelo", "rosa", "azul", "verde", "laranja"] as const;
export type CorPostIt = (typeof CORES)[number];

export const NOME_DA_COR: Record<CorPostIt, string> = {
  amarelo: "Amarelo",
  rosa: "Rosa",
  azul: "Azul",
  verde: "Verde",
  laranja: "Laranja",
};

export const LIMITE_MENSAGEM = 280;
/** Cabe "Gabriel Vilela e Bianca Panchorra" com folga. */
export const LIMITE_NOME = 40;
/** A partir de quantos caracteres o contador aparece. */
export const MOSTRAR_CONTADOR_EM = 150;

export type Recado = {
  id: string;
  nome: string;
  mensagem: string;
  cor: CorPostIt;
  resposta: string | null;
  sticker: string | null;
  created_at: string;
  moderado_em: string | null;
};

/** Campos que o visitante pode ler (o status não é exposto). */
export const CAMPOS_PUBLICOS = "id,nome,mensagem,cor,resposta,sticker,created_at,moderado_em";

/** O post-it dos noivos, fixo no mural e na home. */
export const POST_IT_DOS_NOIVOS = {
  id: "dos-noivos",
  mensagem:
    "Animados? Sim. Ansiosos? Muito. Registramos aqui essas emoções e o sentimento que é poder amar e ser amado... uma honra partilhar dessa vida com você.",
  nome: "Gabriel",
  cor: "amarelo" as CorPostIt,
};

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Segundos até o mural buscar de novo no banco (a aprovação também força a atualização). */
export const REVALIDAR_RECADOS = 60;

function configurado() {
  if (!URL_SUPABASE || !CHAVE_PUBLICA) {
    console.warn("[recados] Variáveis do Supabase ausentes.");
    return false;
  }
  return true;
}

async function lerRecados(consulta: string): Promise<Recado[] | null> {
  if (!configurado()) return null;
  try {
    const resposta = await fetch(`${URL_SUPABASE}/rest/v1/recados?select=${CAMPOS_PUBLICOS}&${consulta}`, {
      headers: { apikey: CHAVE_PUBLICA!, Accept: "application/json" },
      next: { revalidate: REVALIDAR_RECADOS, tags: ["recados"] },
    });
    if (!resposta.ok) {
      console.error(`[recados] Supabase respondeu ${resposta.status}`);
      return null;
    }
    return (await resposta.json()) as Recado[];
  } catch (erro) {
    console.error("[recados] Falha ao buscar recados", erro);
    return null;
  }
}

/** Todos os post-its aprovados, do mais recente para o mais antigo. */
export function buscarRecados(limite = 500) {
  return lerRecados(`order=moderado_em.desc.nullslast,created_at.desc&limit=${limite}`);
}

/** Um post-it aprovado (null se não existe ou ainda não foi aprovado). */
export async function buscarRecado(id: string): Promise<Recado | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const linhas = await lerRecados(`id=eq.${id}&limit=1`);
  return linhas?.[0] ?? null;
}

/** Inclinação estável de cada post-it (mesmo id, mesmo ângulo em qualquer tela). */
export function semente(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function inclinacao(id: string, amplitude = 4) {
  return Number(((semente(id) * 2 - 1) * amplitude).toFixed(2));
}

const ALFINETES = ["rose", "ouro", "marinho", "salvia"] as const;
export function corDoAlfinete(id: string) {
  return ALFINETES[Math.floor(semente(id + "alfinete") * ALFINETES.length)];
}

export function dataCurtaDe(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" });
}
