"use client";

import { useEffect, useState } from "react";

/**
 * Avisos rápidos (toasts) no padrão do site. Qualquer componente chama `avisar(...)`
 * e o <Avisos /> da página mostra a mensagem por alguns segundos.
 */

export type TipoAviso = "sucesso" | "erro" | "info";
type Aviso = { id: number; texto: string; tipo: TipoAviso };

const EVENTO = "site:aviso";

export function avisar(texto: string, tipo: TipoAviso = "sucesso") {
  window.dispatchEvent(new CustomEvent<Omit<Aviso, "id">>(EVENTO, { detail: { texto, tipo } }));
}

export function Avisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    let proximo = 0;
    const receber = (e: Event) => {
      const { texto, tipo } = (e as CustomEvent<Omit<Aviso, "id">>).detail;
      const id = ++proximo;
      setAvisos((lista) => [...lista.slice(-2), { id, texto, tipo }]);
      setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== id)), tipo === "erro" ? 6000 : 3800);
    };
    window.addEventListener(EVENTO, receber);
    return () => window.removeEventListener(EVENTO, receber);
  }, []);

  return (
    <div className="avisos" role="status" aria-live="polite">
      {avisos.map((a) => (
        <p key={a.id} className={`aviso aviso--${a.tipo}`}>
          <span className="aviso__icone" aria-hidden="true">
            {a.tipo === "sucesso" ? "✓" : a.tipo === "erro" ? "!" : "i"}
          </span>
          {a.texto}
        </p>
      ))}
    </div>
  );
}
