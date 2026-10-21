/**
 * Post-its enviados deste aparelho. Ficam no navegador para a pessoa ver o próprio
 * post-it "aguardando os noivos" e receber a devolutiva quando ele for aprovado.
 */
import { CAMPOS_PUBLICOS, type CorPostIt, type Recado } from "@/lib/recados";

export type MeuRecado = { id: string; nome: string; mensagem: string; cor: CorPostIt; em: string };

const CHAVE_MEUS = "mural:meus";
const CHAVE_VISTOS = "mural:devolutivas-vistas";
const VALIDADE_MS = 60 * 86_400_000;

function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Navegação privada ou armazenamento cheio: o mural funciona sem isso.
  }
}

export function meusRecados(): MeuRecado[] {
  const agora = Date.now();
  return ler<MeuRecado[]>(CHAVE_MEUS, []).filter((r) => agora - new Date(r.em).getTime() < VALIDADE_MS);
}

export function guardarMeuRecado(r: MeuRecado) {
  gravar(CHAVE_MEUS, [r, ...meusRecados().filter((m) => m.id !== r.id)].slice(0, 20));
}

export function esquecerMeusRecados(ids: string[]) {
  gravar(
    CHAVE_MEUS,
    meusRecados().filter((m) => !ids.includes(m.id)),
  );
}

export function devolutivaJaVista(id: string) {
  return ler<string[]>(CHAVE_VISTOS, []).includes(id);
}

export function marcarDevolutivaVista(id: string) {
  gravar(CHAVE_VISTOS, [...new Set([id, ...ler<string[]>(CHAVE_VISTOS, [])])].slice(0, 50));
}

/** Quantos post-its este aparelho mandou na última hora (freio leve contra exagero). */
export function enviadosNaUltimaHora() {
  const limite = Date.now() - 3_600_000;
  return meusRecados().filter((r) => new Date(r.em).getTime() > limite).length;
}

/** Dos meus post-its, quais já foram aprovados (o banco só devolve aprovados). */
export async function buscarMeusAprovados(ids: string[]): Promise<Recado[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave || !ids.length) return [];
  try {
    const resposta = await fetch(`${url}/rest/v1/recados?select=${CAMPOS_PUBLICOS}&id=in.(${ids.join(",")})`, {
      headers: { apikey: chave, Accept: "application/json" },
      cache: "no-store",
    });
    return resposta.ok ? ((await resposta.json()) as Recado[]) : [];
  } catch {
    return [];
  }
}

export type ResultadoEnvio = { ok: true } | { ok: false; motivo: "repetido" | "muitos" | "rede" };

/** Grava o post-it como pendente. O id é gerado aqui para a pessoa achar o post-it depois. */
export async function enviarRecado(r: { id: string; nome: string; mensagem: string; cor: CorPostIt }): Promise<ResultadoEnvio> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) return { ok: false, motivo: "rede" };
  try {
    const resposta = await fetch(`${url}/rest/v1/recados`, {
      method: "POST",
      headers: {
        apikey: chave,
        "Content-Type": "application/json",
        // O visitante não lê pendentes, então não pedimos a linha de volta.
        Prefer: "return=minimal",
      },
      body: JSON.stringify(r),
    });
    if (resposta.ok) return { ok: true };
    const corpo = await resposta.text();
    if (corpo.includes("repetido")) return { ok: false, motivo: "repetido" };
    if (corpo.includes("muitos")) return { ok: false, motivo: "muitos" };
    return { ok: false, motivo: "rede" };
  } catch {
    return { ok: false, motivo: "rede" };
  }
}
