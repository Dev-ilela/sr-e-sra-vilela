import { StickerPresente } from "@/components/presentes/StickersPresentes";
import { quemPresenteou, type Doacao } from "@/lib/presentes";

/** Selo redondo com o check, no canto da foto. */
export function CheckDoado() {
  return (
    <span className="presente__check" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Sticker colado na foto do item já presenteado. */
export function StickerColado({ id, nome }: { id: string | null; nome: string }) {
  if (!id) return null;
  return (
    <span className="presente__sticker">
      <StickerPresente id={id} titulo={nome} />
    </span>
  );
}

/** Bilhetinho com quem deu e o agradecimento dos noivos. */
export function Agradecimento({ doacoes }: { doacoes: Doacao[] }) {
  const ultimo = [...doacoes].reverse().find((d) => d.agradecimento);
  return (
    <div className="presente__bilhete">
      <p className="presente__por">
        Presenteado por <strong>{quemPresenteou(doacoes)}</strong>
      </p>
      {ultimo?.agradecimento && <p className="presente__obrigado">“{ultimo.agradecimento}”</p>}
    </div>
  );
}
