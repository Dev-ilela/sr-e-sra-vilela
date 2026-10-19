import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { CartaoPresente } from "@/components/CartaoPresente";
import { PresentePix } from "@/components/PresentePix";
import { Ramo } from "@/components/Ramo";
import { casamento } from "@/config/casamento";
import { buscarPresentes, type Presente } from "@/lib/presentes";
import { gerarPixCopiaECola, recebedorDoAmbiente } from "@/lib/pix";

// A lista é estática, mas busca o banco de novo a cada 5 minutos
// (o Next exige o número literal aqui; o mesmo valor está em REVALIDAR_PRESENTES).
export const revalidate = 300;

export const metadata: Metadata = {
  title: `Lista de presentes - ${casamento.noivo} & ${casamento.noiva}`,
  description: "Umas coisas para a casa nova e uns mimos para a lua de mel.",
  alternates: { canonical: "/presentes" },
};

async function prepararPix(presentes: Presente[]) {
  const recebedor = recebedorDoAmbiente();
  if (!recebedor) {
    if (presentes.length) console.warn("[presentes] Há presentes Pix, mas as variáveis PIX_* não estão definidas.");
    return [];
  }
  return Promise.all(
    presentes.map(async (presente) => {
      const copiaECola = gerarPixCopiaECola(recebedor, presente.valor);
      const qrSvg = await QRCode.toString(copiaECola, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#14233b", light: "#ffffff" },
      });
      return { presente, copiaECola, qrSvg };
    }),
  );
}

export default async function Presentes() {
  const presentes = await buscarPresentes();
  const daMagalu = presentes?.filter((p) => p.tipo === "magalu") ?? [];
  const pix = await prepararPix(presentes?.filter((p) => p.tipo === "pix") ?? []);

  return (
    <main className="lista">
      <header className="lista__topo">
        <Link href="/" className="lista__voltar">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
          {casamento.noivo} e {casamento.noiva}
        </Link>

        <h1 className="lista__titulo">Lista de presentes</h1>
        <Ramo className="lista__ramo" />
        <div className="lista__intro">
          <p>
            Ter vocês com a gente nesse dia já é presente demais, sério. Ver o começo da nossa história a dois
            cercados de gente tão especial é uma bênção que a gente nem sabe agradecer direito.
          </p>
          <p>
            Mas se você quiser (e puder) deixar sua marca nesse começo, separamos aqui algumas coisas para a casa
            nova e uns mimos para a lua de mel. Sem pressão nenhuma, tá?
          </p>
        </div>
      </header>

      {presentes === null ? (
        <section className="lista__bloco lista__bloco--aviso">
          <p>A lista não carregou agora, mas está toda lá na Magalu.</p>
          <a className="botao" href={casamento.listaMagalu} target="_blank" rel="noopener noreferrer">
            Abrir a lista na Magalu
          </a>
        </section>
      ) : (
        <>
          {daMagalu.length > 0 && (
            <section className="lista__bloco" aria-labelledby="casa-nova">
              <div className="lista__cabeca">
                <h2 id="casa-nova" className="lista__subtitulo">
                  Para a casa nova
                </h2>
                <p className="lista__nota">
                  Esses estão na nossa lista da Magalu. O botão leva pra lá, onde você paga e o presente sai da lista.
                </p>
              </div>
              <ul className="lista__grade">
                {daMagalu.map((presente) => (
                  <CartaoPresente key={presente.id} presente={presente} />
                ))}
              </ul>
            </section>
          )}

          {pix.length > 0 && (
            <section className="lista__bloco" aria-labelledby="lua-de-mel">
              <div className="lista__cabeca">
                <h2 id="lua-de-mel" className="lista__subtitulo">
                  Para a lua de mel
                </h2>
                <p className="lista__nota">Esses caem direto na nossa conta, via Pix.</p>
              </div>
              <ul className="lista__grade">
                {pix.map(({ presente, copiaECola, qrSvg }) => (
                  <PresentePix key={presente.id} presente={presente} copiaECola={copiaECola} qrSvg={qrSvg} />
                ))}
              </ul>
            </section>
          )}

          <p className="lista__rodape">
            Prefere escolher direto na Magalu?{" "}
            <a href={casamento.listaMagalu} target="_blank" rel="noopener noreferrer">
              Abrir a lista completa
            </a>
          </p>
        </>
      )}
    </main>
  );
}
