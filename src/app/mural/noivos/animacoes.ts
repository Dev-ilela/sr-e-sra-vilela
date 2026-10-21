/**
 * O que acontece com o post-it depois da decisão dos noivos:
 * aprovado vira aviãozinho de papel e voa; reprovado é amassado e jogado longe.
 */
import { animar, semMovimento } from "@/lib/animar";

function coresDo(postit: HTMLElement) {
  const estilo = getComputedStyle(postit);
  return { c1: estilo.getPropertyValue("--c1").trim() || "#fff4a8", c2: estilo.getPropertyValue("--c2").trim() || "#fce47c" };
}

/** Cria um elemento fixo na tela, centrado onde o post-it estava. */
function noLugarDo(postit: HTMLElement, svg: string, tamanho: number) {
  const r = postit.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "noivos__voador";
  el.style.left = `${r.left + r.width / 2 - tamanho / 2}px`;
  el.style.top = `${r.top + r.height / 2 - tamanho / 2}px`;
  el.style.width = `${tamanho}px`;
  el.style.height = `${tamanho}px`;
  el.innerHTML = svg;
  document.body.appendChild(el);
  return el;
}

export async function virarAviao(postit: HTMLElement) {
  if (semMovimento()) return;
  const { c1, c2 } = coresDo(postit);
  // Dobra: o papel fecha e afina até virar o aviãozinho.
  await animar(
    postit,
    [
      { transform: "none", opacity: 1 },
      { transform: "perspective(600px) rotateX(55deg) scale(.7) rotate(-6deg)", opacity: 1, offset: 0.55 },
      { transform: "perspective(600px) rotateX(80deg) scale(.35) rotate(-18deg)", opacity: 0 },
    ],
    { duration: 420, easing: "cubic-bezier(.5,0,.7,.4)" },
  );
  const aviao = noLugarDo(
    postit,
    `<svg viewBox="0 0 120 80" width="100%" height="100%">
      <path d="M4 40 L116 6 L50 52 Z" fill="${c1}" stroke="rgba(20,35,59,.45)" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M50 52 L116 6 L62 74 Z" fill="${c2}" stroke="rgba(20,35,59,.45)" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M50 52 L57 59 L62 74 Z" fill="${c2}" stroke="rgba(20,35,59,.45)" stroke-width="1.6" stroke-linejoin="round" style="filter:brightness(.85)"/>
    </svg>`,
    150,
  );
  const w = window.innerWidth;
  const h = window.innerHeight;
  await animar(
    aviao,
    [
      { transform: "scale(.3) rotate(0deg)", opacity: 0 },
      { transform: "scale(1) rotate(-4deg)", opacity: 1, offset: 0.14 },
      { transform: `translate(${w * 0.08}px, ${h * 0.05}px) rotate(6deg)`, offset: 0.3 },
      { transform: `translate(${w * 0.35}px, ${-h * 0.12}px) rotate(-14deg) scale(.9)`, offset: 0.62 },
      { transform: `translate(${w * 1.1}px, ${-h * 0.5}px) rotate(-26deg) scale(.6)`, opacity: 1 },
    ],
    { duration: 1350, easing: "cubic-bezier(.45,0,.55,1)" },
  );
  aviao.remove();
}

export async function amassarEJogar(postit: HTMLElement) {
  if (semMovimento()) return;
  const { c1, c2 } = coresDo(postit);
  // Amassa: encolhe torto, os cantos somem e vira uma bolinha.
  await animar(
    postit,
    [
      { transform: "none", borderRadius: "0%", filter: "none" },
      { transform: "scale(.82) rotate(6deg) skew(8deg, -6deg)", borderRadius: "18%", filter: "brightness(.95)", offset: 0.35 },
      { transform: "scale(.55) rotate(-10deg) skew(-10deg, 8deg)", borderRadius: "38%", filter: "brightness(.9)", offset: 0.7 },
      { transform: "scale(.28) rotate(20deg)", borderRadius: "50%", opacity: 0 },
    ],
    { duration: 520, easing: "ease-in" },
  );
  const bola = noLugarDo(
    postit,
    `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M50 8 L64 14 L80 12 L86 28 L94 42 L88 58 L92 74 L76 84 L62 94 L46 88 L28 92 L18 78 L8 62 L14 46 L8 30 L22 20 L34 10 Z"
        fill="${c1}" stroke="rgba(20,35,59,.5)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 8 L46 30 L64 44 L50 60 L62 94 M14 46 L34 50 L46 30 M86 28 L64 44 L80 64 L92 74 M28 92 L36 70 L50 60 M36 70 L18 78"
        fill="none" stroke="rgba(20,35,59,.35)" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M46 30 L64 44 L50 60 L34 50 Z" fill="${c2}" opacity=".7"/>
    </svg>`,
    86,
  );
  const w = window.innerWidth;
  const h = window.innerHeight;
  await animar(
    bola,
    [
      { transform: "translate(0, 0) rotate(0deg) scale(.6)", opacity: 0 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 0.08 },
      { transform: `translate(${w * 0.22}px, ${-h * 0.22}px) rotate(260deg)`, offset: 0.42 },
      { transform: `translate(${w * 0.55}px, ${-h * 0.05}px) rotate(520deg)`, offset: 0.7 },
      { transform: `translate(${w * 1.0}px, ${h * 0.45}px) rotate(900deg) scale(.8)`, opacity: 1 },
    ],
    { duration: 1050, easing: "cubic-bezier(.3,0,.7,1)" },
  );
  bola.remove();
}

/** O cartão fecha o espaço dele na lista. */
export async function recolher(cartao: HTMLElement) {
  const altura = cartao.offsetHeight;
  cartao.style.overflow = "hidden";
  await animar(
    cartao,
    [
      { height: `${altura}px`, opacity: 1, marginBottom: "0px" },
      { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px", marginBottom: "-1.5rem" },
    ],
    { duration: 380, easing: "cubic-bezier(.4,0,.2,1)" },
  );
}
