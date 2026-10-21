import { Fragment, isValidElement, type ReactNode } from "react";

/**
 * Transforma um SVG feito em JSX em texto, sem react-dom/server (que o Next não
 * deixa usar nas rotas de imagem). Serve para os stickers, que são SVG simples.
 */

// Atributos do SVG que continuam em camelCase.
const EM_CAMELCASE = new Set(["viewBox", "stdDeviation", "preserveAspectRatio", "gradientUnits", "gradientTransform", "patternUnits"]);

function nomeDoAtributo(nome: string) {
  if (nome === "className") return "class";
  if (EM_CAMELCASE.has(nome)) return nome;
  return nome.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);
}

const escapar = (texto: string) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function svgParaTexto(no: ReactNode): string {
  if (no === null || no === undefined || typeof no === "boolean") return "";
  if (typeof no === "string" || typeof no === "number") return escapar(String(no));
  if (Array.isArray(no)) return no.map(svgParaTexto).join("");
  if (!isValidElement(no)) return "";

  const props = (no.props ?? {}) as Record<string, unknown> & { children?: ReactNode };
  if (no.type === Fragment) return svgParaTexto(props.children);
  if (typeof no.type === "function") return svgParaTexto((no.type as (p: unknown) => ReactNode)(props));
  if (typeof no.type !== "string") return "";

  const atributos = Object.entries(props)
    .filter(([nome, valor]) => nome !== "children" && valor !== undefined && valor !== null && valor !== false)
    .map(([nome, valor]) => ` ${nomeDoAtributo(nome)}="${escapar(String(valor))}"`)
    .join("");
  const extra = no.type === "svg" ? ' xmlns="http://www.w3.org/2000/svg"' : "";
  return `<${no.type}${extra}${atributos}>${svgParaTexto(props.children)}</${no.type}>`;
}
