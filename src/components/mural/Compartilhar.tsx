"use client";

import { useEffect, useState } from "react";
import { casamento } from "@/config/casamento";

/** Botões para espalhar um post-it: copiar link, WhatsApp e o compartilhar do celular. */
export function Compartilhar({ id, nome, className = "" }: { id: string; nome: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);
  const [nativo, setNativo] = useState(false);

  useEffect(() => setNativo(typeof navigator !== "undefined" && "share" in navigator), []);

  const link = `${casamento.site}/mural/${id}`;
  const texto = `Um post-it de ${nome} pro ${casamento.noivo} e a ${casamento.noiva}:`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copie o link:", link);
    }
  };

  const compartilhar = async () => {
    try {
      await navigator.share({ title: `${casamento.noivo} & ${casamento.noiva}`, text: texto, url: link });
    } catch {
      // A pessoa fechou a folha de compartilhar.
    }
  };

  return (
    <div className={`compartilhar ${className}`}>
      <button type="button" className="compartilhar__botao" onClick={copiar}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        {copiado ? "Link copiado!" : "Copiar link"}
      </button>
      <a
        className="compartilhar__botao"
        href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${link}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8A5 5 0 0 1 11.2 11l.8-1-1-2L9.5 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        WhatsApp
      </a>
      {nativo && (
        <button type="button" className="compartilhar__botao" onClick={compartilhar}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 15V4M8 8l4-4 4 4M5 12v7h14v-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Compartilhar
        </button>
      )}
    </div>
  );
}
