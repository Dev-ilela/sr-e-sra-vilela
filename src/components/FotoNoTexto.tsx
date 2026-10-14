"use client";

import { useRef } from "react";

type Props = {
  /** Recorte pequeno que aparece no meio do texto. */
  chip: string;
  /** Foto inteira, aberta ao clicar. */
  grande: string;
  alt: string;
};

/**
 * Foto em pílula no meio do texto. Ao clicar, abre a foto inteira por cima do site,
 * com o fundo desfocado. Fecha no X, clicando fora ou com Esc.
 */
export function FotoNoTexto({ chip, grande, alt }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);

  const abrir = () => dialogo.current?.showModal();
  const fechar = () => dialogo.current?.close();

  return (
    <>
      <button type="button" className="casal__chip" onClick={abrir} aria-label={`Ver foto: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chip} alt="" loading="lazy" />
      </button>

      <dialog
        ref={dialogo}
        className="foto-aberta"
        aria-label={alt}
        // Clicar fora da foto (no próprio fundo do diálogo) fecha.
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={grande} alt={alt} decoding="async" className="foto-aberta__img" />
        <button type="button" className="foto-aberta__fechar" onClick={fechar} aria-label="Fechar foto">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
