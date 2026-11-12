"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { Presente } from "@/lib/presentes";
import { rpc, SessaoInvalida, token } from "../sessao";

export type StatusDoacao = "pendente" | "confirmado" | "recusado";
export type FormaDoacao = "pix" | "objeto";

/** Doação vista pelos noivos: tudo, inclusive o nome de quem pediu anonimato. */
export type DoacaoPainel = {
  id: string;
  presente_id: string | null;
  presente_nome: string | null;
  presente_tipo: "magalu" | "pix" | null;
  presente_imagem: string | null;
  presente_sticker: string | null;
  presente_valor: number | null;
  nome: string;
  mensagem: string | null;
  anonimo: boolean;
  forma: FormaDoacao;
  status: StatusDoacao;
  origem: "convidado" | "noivos";
  agradecimento: string | null;
  created_at: string;
  confirmado_em: string | null;
};

export type Resultado = { ok: true } | { ok: false; erro: string };

const SESSAO_ACABOU = "Sua sessão acabou. Entre de novo.";
const uuid = /^[0-9a-f-]{36}$/i;

/** null = precisa entrar de novo. */
export async function listarDoacoes(status: StatusDoacao): Promise<DoacaoPainel[] | null> {
  const t = await token();
  if (!t) return null;
  try {
    return await rpc<DoacaoPainel[]>("presentes_doacoes_listar", { token: t, filtro: status });
  } catch (erro) {
    if (erro instanceof SessaoInvalida) return null;
    throw erro;
  }
}

/** Todos os presentes ativos, para dar baixa na mão. */
export async function listarPresentes(): Promise<Presente[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) return [];
  const campos = "id,tipo,nome,descricao,valor,imagem_url,link_url,sticker";
  const resposta = await fetch(`${url}/rest/v1/presentes?select=${campos}&order=tipo.asc,ordem.asc,created_at.asc`, {
    headers: { apikey: chave, Accept: "application/json" },
    cache: "no-store",
  });
  if (!resposta.ok) return [];
  return ((await resposta.json()) as Presente[]).map((p) => ({ ...p, valor: Number(p.valor) }));
}

function atualizarSite() {
  revalidateTag("presentes");
  revalidatePath("/presentes");
  revalidatePath("/mural/noivos/presentes");
}

function falha(erro: unknown): Resultado {
  if (erro instanceof SessaoInvalida) return { ok: false, erro: SESSAO_ACABOU };
  console.error("[presentes] Falha no painel", erro);
  const detalhe = erro instanceof Error ? ` (${erro.message.slice(0, 120)})` : "";
  return { ok: false, erro: `Não deu para salvar agora. Tente de novo.${detalhe}` };
}

/** Confirma, recusa ou devolve um aviso para pendente, e salva o agradecimento. */
export async function moderarDoacao(dados: {
  id: string;
  status: StatusDoacao;
  agradecimento: string;
  anonimo: boolean;
}): Promise<Resultado> {
  const t = await token();
  if (!t) return { ok: false, erro: SESSAO_ACABOU };
  if (!uuid.test(dados.id) || !["pendente", "confirmado", "recusado"].includes(dados.status)) {
    return { ok: false, erro: "Pedido inválido." };
  }
  try {
    await rpc("presentes_doacao_moderar", {
      token: t,
      doacao_id: dados.id,
      novo_status: dados.status,
      novo_agradecimento: dados.agradecimento.trim().slice(0, 200) || null,
      novo_anonimo: dados.anonimo,
    });
  } catch (erro) {
    return falha(erro);
  }
  atualizarSite();
  return { ok: true };
}

/** Baixa feita pelos noivos, sem aviso do convidado. */
export async function registrarDoacao(dados: {
  presenteId: string;
  nome: string;
  forma: FormaDoacao;
  agradecimento: string;
  anonimo: boolean;
}): Promise<Resultado> {
  const t = await token();
  if (!t) return { ok: false, erro: SESSAO_ACABOU };
  const nome = dados.nome.trim();
  if (!uuid.test(dados.presenteId) || nome.length < 2 || nome.length > 60 || !["pix", "objeto"].includes(dados.forma)) {
    return { ok: false, erro: "Confira o nome de quem deu (2 a 60 letras)." };
  }
  try {
    await rpc("presentes_doacao_registrar", {
      token: t,
      presente: dados.presenteId,
      nome_doador: nome,
      forma_doacao: dados.forma,
      texto_agradecimento: dados.agradecimento.trim().slice(0, 200) || null,
      doador_anonimo: dados.anonimo,
    });
  } catch (erro) {
    return falha(erro);
  }
  atualizarSite();
  return { ok: true };
}
