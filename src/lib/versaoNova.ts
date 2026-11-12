/**
 * Quando sai uma versão nova do site (deploy na Vercel), quem estava com a página aberta
 * ainda roda o JavaScript antigo. Ao navegar, o navegador pede pedaços (chunks) dessa versão
 * antiga, que não existem mais, e a página ficava toda azul até a pessoa dar F5.
 *
 * Aqui reconhecemos esse erro e recarregamos a página sozinhos, uma vez, já na versão nova.
 */

const CHAVE = "site:recarregou-versao";
const INTERVALO_MS = 15_000;

export function ehErroDeVersao(erro: unknown): boolean {
  if (!erro) return false;
  const e = erro as { name?: string; message?: string };
  const texto = `${e.name ?? ""} ${e.message ?? String(erro)}`;
  return /ChunkLoadError|Loading (CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    texto,
  );
}

/** Recarrega uma vez (sem entrar em loop se o problema for outro). Devolve se recarregou. */
export function recarregarParaVersaoNova(): boolean {
  try {
    const ultima = Number(sessionStorage.getItem(CHAVE) ?? 0);
    if (Date.now() - ultima < INTERVALO_MS) return false;
    sessionStorage.setItem(CHAVE, String(Date.now()));
  } catch {
    // Sem sessionStorage: recarrega mesmo assim (no pior caso, uma vez a mais).
  }
  window.location.reload();
  return true;
}
