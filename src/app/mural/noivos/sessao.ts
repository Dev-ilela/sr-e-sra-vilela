import { cookies } from "next/headers";

/**
 * Sessão da área dos noivos, usada pelo mural e pela lista de presentes. A senha é
 * conferida no banco (funções mural_*), que devolve um token guardado num cookie só do servidor.
 */

export const COOKIE = "mural_noivos";

export class SessaoInvalida extends Error {}

export async function rpc<T>(funcao: string, corpo: Record<string, unknown>): Promise<T> {
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

export async function token() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}
