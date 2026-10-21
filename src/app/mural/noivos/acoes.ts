"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ehSticker } from "@/components/mural/Stickers";
import type { Recado } from "@/lib/recados";

/**
 * Área dos noivos. A senha é conferida no próprio banco (funções mural_*), que devolve
 * um token de sessão guardado num cookie só do servidor. Sem chave secreta no site.
 */

const COOKIE = "mural_noivos";
export type Status = "pendente" | "aprovado" | "recusado";

class SessaoInvalida extends Error {}

async function rpc<T>(funcao: string, corpo: Record<string, unknown>): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) throw new Error("Variáveis do Supabase ausentes.");

  const resposta = await fetch(`${url}/rest/v1/rpc/${funcao}`, {
    method: "POST",
    headers: { apikey: chave, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(corpo),
    cache: "no-store",
  });
  const texto = await resposta.text();
  if (!resposta.ok) {
    if (texto.includes("sessão inválida")) throw new SessaoInvalida();
    let mensagem = texto;
    try {
      mensagem = (JSON.parse(texto) as { message?: string }).message ?? texto;
    } catch {}
    throw new Error(mensagem);
  }
  return (texto ? JSON.parse(texto) : null) as T;
}

async function token() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

/** Lista os post-its de um status. null = precisa entrar de novo. */
export async function listarRecados(status: Status): Promise<Recado[] | null> {
  const t = await token();
  if (!t) return null;
  try {
    return await rpc<Recado[]>("mural_listar", { token: t, filtro: status });
  } catch (erro) {
    if (erro instanceof SessaoInvalida) return null;
    throw erro;
  }
}

export async function entrar(_estado: string | null, dados: FormData): Promise<string | null> {
  const senha = String(dados.get("senha") ?? "");
  if (!senha) return "Digite a senha.";
  let t: string | null;
  try {
    t = await rpc<string | null>("mural_entrar", { senha });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "";
    return mensagem.includes("tentativas") ? "Muitas tentativas. Espere uns minutinhos." : "Não deu para entrar agora.";
  }
  if (!t) return "Senha errada.";

  (await cookies()).set(COOKIE, t, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/mural/noivos",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/mural/noivos");
}

export async function sair() {
  const t = await token();
  if (t) await rpc("mural_sair", { token: t }).catch(() => null);
  (await cookies()).delete({ name: COOKIE, path: "/mural/noivos" });
  redirect("/mural/noivos");
}

export async function moderar(dados: FormData) {
  const t = await token();
  if (!t) redirect("/mural/noivos");

  const id = String(dados.get("id") ?? "");
  const status = String(dados.get("status") ?? "") as Status;
  const resposta = String(dados.get("resposta") ?? "").trim().slice(0, 200);
  const sticker = String(dados.get("sticker") ?? "");
  if (!["pendente", "aprovado", "recusado"].includes(status)) return;

  try {
    await rpc("mural_moderar", {
      token: t,
      recado_id: id,
      novo_status: status,
      nova_resposta: resposta || null,
      novo_sticker: ehSticker(sticker) ? sticker : null,
    });
  } catch (erro) {
    if (erro instanceof SessaoInvalida) redirect("/mural/noivos");
    throw erro;
  }

  // O mural, a home e a página do post-it mostram a mudança na hora.
  revalidateTag("recados");
  revalidatePath("/");
  revalidatePath("/mural");
  revalidatePath(`/mural/${id}`);
  revalidatePath("/mural/noivos");
}
