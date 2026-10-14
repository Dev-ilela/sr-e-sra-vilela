"use client";

import { useRef } from "react";

type Props = {
  /** Recorte pequeno que aparece no meio do texto. */
  chip: string;
  /** Foto inteira, aberta ao clicar. */
  grande: string;
  alt: string;
};

const DURACAO = 420;
const CURVA = "cubic-bezier(0.2, 0.75, 0.2, 1)";

/**
 * Foto em pílula no meio do texto. Ao clicar, a foto sai da pílula e cresce até o
 * centro da tela, com o site desfocado atrás. Fecha no X, clicando fora ou com Esc,
 * voltando para a pílula.
 */
export function FotoNoTexto({ chip, grande, alt }: Props) {
  const botao = useRef<HTMLButtonElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const moldura = useRef<HTMLElement>(null);
  const fechando = useRef(false);

  const semMovimento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Transformação que leva a moldura (já no lugar final) para cima da pílula. */
  const deOndeVeio = () => {
    const de = botao.current!.getBoundingClientRect();
    const para = moldura.current!.getBoundingClientRect();
    const dx = de.left + de.width / 2 - (para.left + para.width / 2);
    const dy = de.top + de.height / 2 - (para.top + para.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${de.width / para.width}, ${de.height / para.height})`;
  };

  const abrir = () => {
    dialogo.current?.showModal();
    if (semMovimento() || !moldura.current) return;
    moldura.current.animate(
      [
        { transform: deOndeVeio(), borderRadius: "999px", opacity: 0.6 },
        { transform: "none", borderRadius: "18px", opacity: 1 },
      ],
      { duration: DURACAO, easing: CURVA },
    );
  };

  const fechar = () => {
    if (fechando.current) return;
    if (semMovimento() || !moldura.current) {
      dialogo.current?.close();
      return;
    }
    fechando.current = true;
    dialogo.current?.classList.add("foto-aberta--fechando");
    const anim = moldura.current.animate(
      [
        { transform: "none", borderRadius: "18px", opacity: 1 },
        { transform: deOndeVeio(), borderRadius: "999px", opacity: 0 },
      ],
      { duration: DURACAO * 0.8, easing: CURVA },
    );
    anim.onfinish = () => {
      dialogo.current?.close();
      dialogo.current?.classList.remove("foto-aberta--fechando");
      fechando.current = false;
    };
  };

  return (
    <>
      <button ref={botao} type="button" className="casal__chip" onClick={abrir} aria-label={`Ver foto: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chip} alt="" loading="lazy" />
      </button>

      <dialog
        ref={dialogo}
        className="foto-aberta"
        aria-label={alt}
        onCancel={(e) => {
          // Esc: fecha com a mesma animação de volta.
          e.preventDefault();
          fechar();
        }}
        onClick={(e) => {
          // Clicar fora da foto (no próprio fundo do diálogo) fecha.
          if (e.target === e.currentTarget) fechar();
        }}
      >
        <figure ref={moldura} className="foto-aberta__moldura">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={grande} alt={alt} decoding="async" className="foto-aberta__img" />
          <button type="button" className="foto-aberta__fechar" onClick={fechar} aria-label="Fechar foto">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </figure>
      </dialog>
    </>
  );
}
