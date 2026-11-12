"use client";

import { useSyncExternalStore } from "react";

/**
 * Brincadeira "ache as alianças". O estado fica no navegador de cada visitante:
 *  - perdidas:   o solitário dela está caído na página inicial; a aliança dele, na lista de presentes;
 *  - carregando: a pessoa pegou o solitário e está levando até o par (ele acompanha a mão/cursor);
 *  - unidas:     as duas já se encontraram (aparecem juntinhas nos dois lugares).
 */
export type EstadoAliancas = "perdidas" | "carregando" | "unidas";

const CHAVE = "aliancas:estado";
/** Usado só quando o navegador não deixa gravar (navegação privada antiga). */
let memoria: EstadoAliancas | null = null;
const EVENTO = "aliancas:mudou";

/** Pedido para juntar as alianças (o solitário chegou na aliança dele). */
export const EVENTO_UNIR = "aliancas:unir";
/** Ver a cerimônia de novo (clicando nas alianças já juntas). */
export const EVENTO_REVER = "aliancas:rever";

export type DetalheUnir = { noivo: DOMRect; noiva: { x: number; y: number } };

function ler(): EstadoAliancas {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "carregando" || v === "unidas" ? v : "perdidas";
  } catch {
    return "perdidas";
  }
}

export function mudarEstadoAliancas(novo: EstadoAliancas) {
  try {
    localStorage.setItem(CHAVE, novo);
  } catch {
    // Navegação privada: a brincadeira funciona só nesta aba.
    memoria = novo;
  }
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(aviso: () => void) {
  const aoArmazenar = (e: StorageEvent) => e.key === CHAVE && aviso();
  window.addEventListener(EVENTO, aviso);
  window.addEventListener("storage", aoArmazenar);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener("storage", aoArmazenar);
  };
}

/** Estado atual; no servidor (e no primeiro render) as alianças estão perdidas. */
export function useEstadoAliancas(): EstadoAliancas {
  return useSyncExternalStore(
    assinar,
    () => memoria ?? ler(),
    () => "perdidas",
  );
}

/** Última posição do ponteiro, para a aliança sair do centro e ir direto para a "mão". */
export const ponteiro = { x: -100, y: -100, toque: false };

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      ponteiro.x = e.clientX;
      ponteiro.y = e.clientY;
      ponteiro.toque = e.pointerType === "touch";
    },
    { passive: true },
  );
  window.addEventListener(
    "pointerdown",
    (e) => {
      ponteiro.x = e.clientX;
      ponteiro.y = e.clientY;
      ponteiro.toque = e.pointerType === "touch";
    },
    { passive: true },
  );
}

/** Aparelho sem mouse (celular/tablet): a aliança vai para um "bolso" no canto em vez de seguir o cursor. */
export function semMouse() {
  return typeof window !== "undefined" && (ponteiro.toque || window.matchMedia("(hover: none)").matches);
}
