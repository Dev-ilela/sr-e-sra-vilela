import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ehSticker, Sticker } from "@/components/mural/Stickers";
import { casamento, dataCurta } from "@/config/casamento";
import { buscarRecado, type CorPostIt } from "@/lib/recados";
import { svgParaTexto } from "@/lib/svgParaTexto";

export const alt = "Post-it no mural do casamento";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPEL: Record<CorPostIt, [string, string]> = {
  amarelo: ["#fff4a8", "#fce47c"],
  rosa: ["#ffd6e0", "#f9bccb"],
  azul: ["#d3ecfb", "#b5dcf3"],
  verde: ["#e1f4bd", "#c8e79e"],
  laranja: ["#ffdcb0", "#ffc788"],
};

const fonte = (arquivo: string) => readFile(join(process.cwd(), "assets/fontes", arquivo));

/** A arte do post-it para compartilhar (é ela que aparece no WhatsApp). */
export default async function Imagem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recado = await buscarRecado(id);
  const [caveat, bodoni, jost] = await Promise.all([
    fonte("caveat-latin-700-normal.woff"),
    fonte("bodoni-moda-latin-500-italic.woff"),
    fonte("jost-latin-400-normal.woff"),
  ]);

  const mensagem = recado?.mensagem ?? "Deixe um post-it de carinho pros noivos.";
  const nome = recado?.nome ?? `${casamento.noivo} & ${casamento.noiva}`;
  const sticker = recado?.sticker;
  const [c1, c2] = PAPEL[recado?.cor ?? "amarelo"];
  const tamanhoTexto = mensagem.length > 200 ? 30 : mensagem.length > 120 ? 36 : mensagem.length > 60 ? 44 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse 60% 70% at 25% 50%, #22395a 0%, #14233b 75%)",
          padding: "0 70px",
          gap: 70,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: 470,
            height: 470,
            padding: "56px 48px 38px",
            background: `linear-gradient(172deg, ${c1} 0%, ${c1} 55%, ${c2} 100%)`,
            transform: "rotate(-3deg)",
            boxShadow: "14px 26px 40px rgba(0,0,0,.45)",
            color: "#1d2a3e",
            fontFamily: "Caveat",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -14,
              left: 215,
              width: 40,
              height: 40,
              borderRadius: 20,
              background: "radial-gradient(circle at 34% 30%, #ffffff 0%, #f6d9ce 14%, #e2b3a3 48%, #b97a74 100%)",
              boxShadow: "4px 8px 8px rgba(0,0,0,.35)",
            }}
          />
          <div style={{ display: "flex", fontSize: tamanhoTexto, lineHeight: 1.12 }}>{mensagem}</div>
          <div style={{ display: "flex", marginTop: "auto", justifyContent: "flex-end", fontSize: 40, paddingRight: ehSticker(sticker) ? 110 : 0 }}>– {nome}</div>
          {ehSticker(sticker) && (
            <div style={{ position: "absolute", right: -60, bottom: -60, width: 190, height: 190, display: "flex", transform: "rotate(12deg)" }}>
              {/* O gerador de imagem só entende SVG "puro", então o sticker vai como imagem. */}
              <img
                alt=""
                width={190}
                height={190}
                src={`data:image/svg+xml;base64,${Buffer.from(svgParaTexto(Sticker({ id: sticker })).replace("<svg ", '<svg width="380" height="380" ')).toString("base64")}`}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: "#fafbfc" }}>
          <div style={{ display: "flex", fontFamily: "Jost", fontSize: 22, letterSpacing: 6, color: "#e2b3a3", textTransform: "uppercase" }}>
            Mural de post-its
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 18, fontFamily: "Bodoni", fontSize: 76, lineHeight: 1 }}>
            <span>{casamento.noivo}</span>
            <span style={{ color: "#e2b3a3", marginLeft: 16 }}>&</span>
            <span>{casamento.noiva}</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "Bodoni", fontSize: 34, color: "#d6dbe1" }}>Registro de {nome}</div>
          <div style={{ display: "flex", marginTop: 44, height: 2, width: 260, background: "linear-gradient(90deg, #b97a74, #f3d2c4, #e2b3a3)" }} />
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Jost", fontSize: 26, color: "#d6dbe1" }}>
            {dataCurta.replaceAll("/", ".")} · sr-e-sra-vilela.com.br
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Caveat", data: caveat, weight: 700, style: "normal" },
        { name: "Bodoni", data: bodoni, weight: 500, style: "italic" },
        { name: "Jost", data: jost, weight: 400, style: "normal" },
      ],
    },
  );
}
