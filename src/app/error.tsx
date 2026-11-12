"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ehErroDeVersao, recarregarParaVersaoNova } from "@/lib/versaoNova";

/** Algo deu errado numa página: em vez de tela vazia, um aviso no estilo do site e um jeito de seguir. */
export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [recarregando, setRecarregando] = useState(false);

  useEffect(() => {
    // Versão nova do site no ar: recarrega sozinho, sem a pessoa ver nada.
    if (ehErroDeVersao(error) && recarregarParaVersaoNova()) setRecarregando(true);
    else console.error(error);
  }, [error]);

  return (
    <main className="perdido">
      <div className="perdido__conteudo" role="alert">
        <p className="perdido__chapeu">{recarregando ? "Atualizando" : "Ops"}</p>
        <h1 className="perdido__titulo">{recarregando ? "Carregando a versão nova..." : "Algo não carregou direito"}</h1>
        {!recarregando && (
          <>
            <p className="perdido__texto">Pode ter sido a internet. Tenta de novo?</p>
            <div className="perdido__acoes">
              <button type="button" className="botao botao--rose" onClick={() => window.location.reload()}>
                Tentar de novo
              </button>
              <Link href="/" className="perdido__link" onClick={() => reset()}>
                Voltar pro início
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
