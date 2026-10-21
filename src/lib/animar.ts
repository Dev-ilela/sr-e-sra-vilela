/** Pequenos ajudantes de animação (Web Animations API), respeitando "reduzir movimento". */

export function semMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function animar(el: Element | null | undefined, quadros: Keyframe[], opcoes: KeyframeAnimationOptions) {
  if (!el) return;
  const animacao = el.animate(quadros, { fill: "both", ...opcoes, duration: semMovimento() ? 0 : opcoes.duration });
  try {
    await animacao.finished;
  } catch {
    // Animação cancelada (ex.: o diálogo fechou no meio): segue o fluxo.
  }
}

export const esperar = (ms: number) => new Promise((ok) => setTimeout(ok, semMovimento() ? 0 : ms));

/**
 * Transform que leva um elemento já posicionado no destino de volta para a posição de origem
 * (técnica FLIP). Com `topo`, usa o centro do topo como referência (transform-origin: top center).
 */
export function deVolta(origem: Caixa, destino: Caixa, rotacao = 0, topo = false) {
  const escala = origem.width / destino.width;
  const dx = origem.left + origem.width / 2 - (destino.left + destino.width / 2);
  const dy = topo ? origem.top - destino.top : origem.top + origem.height / 2 - (destino.top + destino.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${escala}) rotate(${rotacao}deg)`;
}

/** Remove a animação congelada (fill: both) para o CSS voltar a valer. */
export function limparAnimacoes(el: Element | null | undefined) {
  el?.getAnimations().forEach((a) => a.cancel());
}

export type Caixa = { left: number; top: number; width: number; height: number };

/**
 * Caixa "sem giro" de um elemento: centro real na tela e tamanho do layout.
 * (O getBoundingClientRect de algo inclinado é maior que o papel.)
 */
export function caixa(el: HTMLElement): Caixa {
  const r = el.getBoundingClientRect();
  const width = el.offsetWidth || r.width;
  const height = el.offsetHeight || r.height;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return { left: cx - width / 2, top: cy - height / 2, width, height };
}
