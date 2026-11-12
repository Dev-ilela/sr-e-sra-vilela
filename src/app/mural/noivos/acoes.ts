"use server";

import { cookies } from "next/headers";
import { COOKIE, rpc, SessaoInvalida, token } from "./sessao";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ehSticker } from "@/components/mural/Stickers";
import type { Recado } from "@/lib/recados";

/** Área dos noivos: entrar, sair e moderar o mural. A sessão fica em ./sessao. */

export type Status = "pendente" | "aprovado" | "recusado";

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
  // Volta para a tela de onde veio (mural ou presentes), sempre dentro da área dos noivos.
  const voltar = String(dados.get("voltar") ?? "");
  redirect(voltar === "/mural/noivos/presentes" ? voltar : "/mural/noivos");
}

export async function sair() {
  const t = await token();
  if (t) await rpc("mural_sair", { token: t }).catch(() => null);
  (await cookies()).delete({ name: COOKIE, path: "/mural/noivos" });
  redirect("/mural/noivos");
}

export type ResultadoModeracao = { ok: true } | { ok: false; erro: string };

/**
 * Aprova, reprova ou volta para pendente. Recebe o status direto (não depende de
 * qual botão enviou o formulário) e devolve o resultado para a tela avisar.
 */
export async function moderar(dados: { id: string; status: Status; resposta: string; sticker: string }): Promise<ResultadoModeracao> {
  const t = await token();
  if (!t) return { ok: false, erro: "Sua sessão acabou. Entre de novo." };

  const { id, status } = dados;
  if (!["pendente", "aprovado", "recusado"].includes(status) || !/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false, erro: "Pedido inválido." };
  }

  try {
    await rpc("mural_moderar", {
      token: t,
      recado_id: id,
      novo_status: status,
      nova_resposta: dados.resposta.trim().slice(0, 200) || null,
      novo_sticker: ehSticker(dados.sticker) ? dados.sticker : null,
    });
  } catch (erro) {
    if (erro instanceof SessaoInvalida) return { ok: false, erro: "Sua sessão acabou. Entre de novo." };
    console.error("[mural] Falha ao moderar", erro);
    const detalhe = erro instanceof Error ? ` (${erro.message.slice(0, 120)})` : "";
    return { ok: false, erro: `Não deu para salvar agora. Tente de novo.${detalhe}` };
  }

  // O mural, a home e a página do post-it mostram a mudança na hora.
  revalidateTag("recados");
  revalidatePath("/");
  revalidatePath("/mural");
  revalidatePath(`/mural/${id}`);
  revalidatePath("/mural/noivos");
  return { ok: true };
}
