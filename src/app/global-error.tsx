"use client";

import { useEffect } from "react";
import { ehErroDeVersao, recarregarParaVersaoNova } from "@/lib/versaoNova";

/**
 * Último recurso, quando até o layout quebra. Fica fora do CSS do site, então o estilo vai aqui mesmo.
 * Se for a versão nova do site no ar, recarrega sozinho.
 */
export default function ErroGeral({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    if (!(ehErroDeVersao(error) && recarregarParaVersaoNova())) console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#14233b",
          color: "#fafbfc",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div role="alert">
          <p style={{ letterSpacing: "0.25em", textTransform: "uppercase", fontSize: "0.8rem", color: "#e2b3a3" }}>Ops</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "2rem", margin: "0.6rem 0 1.2rem" }}>
            Algo não carregou direito
          </h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "0.8rem 1.6rem",
              border: 0,
              borderRadius: 999,
              background: "#e2b3a3",
              color: "#14233b",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
