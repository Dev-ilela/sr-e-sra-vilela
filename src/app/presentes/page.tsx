import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import type { DadosPix } from "@/components/BotaoPix";
import { CartaoPix } from "@/components/CartaoPix";
import { CartaoPresente } from "@/components/CartaoPresente";
import { Ramo } from "@/components/Ramo";
import { casamento } from "@/config/casamento";
import { buscarPresentes } from "@/lib/presentes";
import { gerarPixCopiaECola, recebedorDoAmbiente, type DadosRecebedor } from "@/lib/pix";

// A lista é estática, mas busca o banco de novo a cada 5 minutos
// (o Next exige o número literal aqui; o mesmo valor está em REVALIDAR_PRESENTES).
export const revalidate = 300;

export const metadata: Metadata = {
  title: `Lista de presentes - ${casamento.noivo} & ${casamento.noiva}`,
  description: "Nossa lista para o começo dessa família, com itens para a casa nova e momentos da lua de mel.",
  alternates: { canonical: "/presentes" },
};

async function montarPix(recebedor: DadosRecebedor, valor: number | null): Promise<DadosPix> {
  const copiaECola = gerarPixCopiaECola(recebedor, valor);
  const qrSvg = await QRCode.toString(copiaECola, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#14233b", light: "#ffffff" },
  });
  return { copiaECola, qrSvg, chave: recebedor.chave, titular: recebedor.nome };
}

export default async function Presentes() {
  const presentes = await buscarPresentes();
  const recebedor = recebedorDoAmbiente();

  const daMagalu = presentes?.filter((p) => p.tipo === "magalu") ?? [];
  const soPix = presentes?.filter((p) => p.tipo === "pix") ?? [];

  if (!recebedor && soPix.length) {
    console.warn("[presentes] Há presentes Pix, mas as variáveis PIX_* não estão definidas.");
  }

  // Um Pix por valor diferente: itens com o mesmo preço compartilham o mesmo QR.
  const pixPorValor = new Map<string, DadosPix>();
  const pixDe = async (valor: number | null) => {
    if (!recebedor) return null;
    const chave = valor === null ? "livre" : valor.toFixed(2);
    if (!pixPorValor.has(chave)) pixPorValor.set(chave, await montarPix(recebedor, valor));
    return pixPorValor.get(chave)!;
  };

  const magaluComPix = await Promise.all(daMagalu.map(async (p) => ({ presente: p, pix: await pixDe(p.valor) })));
  // Sem recebedor configurado, a seção só de Pix não aparece.
  const pixLivre = await pixDe(null);
  const pixComQr = pixLivre
    ? await Promise.all(soPix.map(async (p) => ({ presente: p, pix: (await pixDe(p.valor)) as DadosPix })))
    : [];

  return (
    <main className="lista">
      <header className="lista__topo">
        <div className="lista__topo-conteudo">
          <Link href="/" className="lista__voltar">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            {casamento.noivo} e {casamento.noiva}
          </Link>

          <p className="lista__chapeu">Com carinho</p>
          <h1 className="lista__titulo">Lista de presentes</h1>
          <Ramo className="lista__ramo" />
          <div className="lista__intro">
            <p>
              É uma honra ter você com a gente no começo da família que Deus está formando, seja no grande dia ou
              acompanhando de longe. Se desejar nos abençoar neste início, preparamos com carinho a nossa lista.
            </p>
          </div>
        </div>
      </header>

      <div className="lista__corpo">
        {presentes === null ? (
          <section className="lista__bloco lista__bloco--aviso">
            <p>A lista não carregou agora, mas ela está toda lá na Magalu.</p>
            <a className="botao" href={casamento.listaMagalu} target="_blank" rel="noopener noreferrer">
              Abrir a lista na Magalu
            </a>
          </section>
        ) : (
          <>
            {magaluComPix.length > 0 && (
              <section className="lista__bloco" aria-labelledby="casa-nova">
                <div className="lista__cabeca">
                  <h2 id="casa-nova" className="lista__subtitulo">
                    Para a casa nova
                  </h2>
                  <p className="lista__nota">
                    Itens da nossa lista na Magalu. Você pode presentear por lá ou, se preferir, enviar o valor via Pix.
                  </p>
                </div>
                <ul className="lista__grade">
                  {magaluComPix.map(({ presente, pix }) => (
                    <CartaoPresente key={presente.id} presente={presente} pix={pix} />
                  ))}
                </ul>
              </section>
            )}

            {pixLivre && (
              <section className="lista__bloco" aria-labelledby="momentos">
                <div className="lista__cabeca">
                  <h2 id="momentos" className="lista__subtitulo">
                    Momentos e o começo da casa
                  </h2>
                  <p className="lista__nota">Pequenas alegrias dessa nova fase, enviadas direto via Pix.</p>
                </div>
                <ul className="lista__grade lista__grade--pix">
                  {pixComQr.map(({ presente, pix }) => (
                    <CartaoPix
                      key={presente.id}
                      titulo={presente.nome}
                      descricao={presente.descricao}
                      valor={presente.valor}
                      presenteId={presente.id}
                      pix={pix}
                    />
                  ))}
                  <CartaoPix
                    titulo="Do seu jeito"
                    descricao="Prefere escolher o valor? O Pix vai sem valor definido e você digita quanto quiser no app do banco."
                    valor={null}
                    presenteId={null}
                    pix={pixLivre}
                  />
                </ul>
              </section>
            )}

            <p className="lista__rodape">
              Prefere ver tudo direto na Magalu?{" "}
              <a href={casamento.listaMagalu} target="_blank" rel="noopener noreferrer">
                Abrir a lista completa
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
