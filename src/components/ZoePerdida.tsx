"use client";

import { useEffect, useState } from "react";

type Foto = { arquivo: string; formato: "redondo" | "recorte"; largura: number; altura: number; frase: string; alt: string };

/** A Zoe "procurando" a página que não existe: uma foto sorteada a cada visita. */
const FOTOS: Foto[] = [
  { arquivo: "tapete", formato: "redondo", largura: 640, altura: 640, frase: "Fiquei deitadinha esperando essa página. Ela não veio.", alt: "Zoe deitada no tapete, olhando pra câmera" },
  { arquivo: "laco", formato: "recorte", largura: 483, altura: 720, frase: "Me arrumei toda e a página nem apareceu.", alt: "Zoe com um laço rosa na cabeça" },
  { arquivo: "pertinho", formato: "recorte", largura: 669, altura: 720, frase: "Tem certeza que o link era esse?", alt: "Zoe bem de pertinho, desconfiada" },
  { arquivo: "filhote", formato: "redondo", largura: 640, altura: 640, frase: "Desde pequenininha procurando essa página.", alt: "Zoe filhote no sofá" },
  { arquivo: "brasil", formato: "recorte", largura: 720, altura: 462, frase: "Entrei em campo, mas essa página não jogou hoje.", alt: "Zoe com a camisa do Brasil" },
  { arquivo: "soninho", formato: "redondo", largura: 640, altura: 640, frase: "Procurei tanto que até deu sono.", alt: "Zoe com os olhos quase fechando de sono" },
  { arquivo: "olhao", formato: "redondo", largura: 640, altura: 640, frase: "Não fui eu que sumi com a página. Juro.", alt: "Zoe com os olhos arregalados, cara de culpada" },
  { arquivo: "assustada", formato: "redondo", largura: 640, altura: 640, frase: "Eu também levei um susto: essa página não existe!", alt: "Zoe de olhos arregalados, assustada" },
];

const CHAVE = "zoe:ultima";

export function ZoePerdida() {
  const [foto, setFoto] = useState<Foto | null>(null);

  useEffect(() => {
    // Sorteia no navegador (a página é estática) e evita repetir a última que a pessoa viu.
    let ultima = -1;
    try {
      ultima = Number(sessionStorage.getItem(CHAVE) ?? -1);
    } catch {}
    let i = Math.floor(Math.random() * FOTOS.length);
    if (i === ultima) i = (i + 1) % FOTOS.length;
    try {
      sessionStorage.setItem(CHAVE, String(i));
    } catch {}
    setFoto(FOTOS[i]);
  }, []);

  return (
    <figure className="zoe" aria-live="polite">
      <div className="zoe__palco">
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={foto.arquivo}
            className={`zoe__foto zoe__foto--${foto.formato}`}
            src={`/fotos/zoe/${foto.arquivo}.webp`}
            width={foto.largura}
            height={foto.altura}
            alt={foto.alt}
            decoding="async"
          />
        )}
      </div>
      <figcaption className="zoe__frase">{foto ? foto.frase : " "}</figcaption>
    </figure>
  );
}
