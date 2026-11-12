"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { avisar } from "@/components/Avisos";
import { StickerPresente } from "@/components/presentes/StickersPresentes";
import { emReais } from "@/lib/formato";
import type { Presente } from "@/lib/presentes";
import { moderarDoacao, registrarDoacao, type DoacaoPainel, type FormaDoacao, type StatusDoacao } from "./acoes";

const AGRADECIMENTOS = [
  "Muito obrigado! Vai ser usado com muito amor.",
  "Que bênção! Obrigado por fazer parte disso.",
  "Já tem lugar reservado aqui em casa!",
  "Obrigado! Que Deus retribua em dobro.",
];

const MENSAGEM: Record<StatusDoacao, string> = {
  confirmado: "Confirmado! Já aparece como presenteado na lista.",
  recusado: "Aviso recusado.",
  pendente: "Voltou para os avisos.",
};

const BOTOES: Record<StatusDoacao, { status: StatusDoacao; rotulo: string; classe: string }[]> = {
  pendente: [
    { status: "recusado", rotulo: "Não chegou / recusar", classe: "noivos__reprovar" },
    { status: "confirmado", rotulo: "Chegou! Confirmar e agradecer", classe: "botao botao--rose" },
  ],
  confirmado: [
    { status: "recusado", rotulo: "Desfazer baixa", classe: "noivos__reprovar" },
    { status: "confirmado", rotulo: "Salvar agradecimento", classe: "botao" },
  ],
  recusado: [
    { status: "pendente", rotulo: "Voltar para avisos", classe: "noivos__reprovar" },
    { status: "confirmado", rotulo: "Confirmar mesmo assim", classe: "botao botao--rose" },
  ],
};

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function Carregando({ texto }: { texto: string }) {
  return (
    <>
      <span className="carregando" aria-hidden="true" /> {texto}
    </>
  );
}

/** Foto do item com o sticker colado; no Pix, que não tem foto, o próprio sticker aparece grande. */
function Miniatura({ imagem, sticker, nome }: { imagem: string | null; sticker: string | null; nome: string }) {
  if (!imagem) {
    return (
      <div className="painel-presente__foto painel-presente__foto--pix">
        {sticker ? <StickerPresente id={sticker} titulo={nome} /> : <span className="painel-presente__pix">Pix</span>}
      </div>
    );
  }
  return (
    <div className="painel-presente__foto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imagem} alt="" loading="lazy" />
      {sticker && (
        <span className="painel-presente__sticker">
          <StickerPresente id={sticker} titulo={nome} />
        </span>
      )}
    </div>
  );
}

function CampoAgradecimento({ valor, mudar, id }: { valor: string; mudar: (v: string) => void; id: string }) {
  return (
    <>
      <label className="noivos__campo">
        <span>Nosso agradecimento (aparece no card do presente)</span>
        <textarea id={id} rows={2} maxLength={200} value={valor} onChange={(e) => mudar(e.target.value)} />
      </label>
      <div className="noivos__rapidas">
        {AGRADECIMENTOS.map((r) => (
          <button key={r} type="button" onClick={() => mudar(r)}>
            {r}
          </button>
        ))}
      </div>
    </>
  );
}

/** Um aviso de presente (ou uma baixa já feita) para conferir. */
export function CartaoDoacao({ doacao, aba }: { doacao: DoacaoPainel; aba: StatusDoacao }) {
  const [agradecimento, setAgradecimento] = useState(doacao.agradecimento ?? "");
  const [anonimo, setAnonimo] = useState(doacao.anonimo);
  const [salvando, iniciar] = useTransition();
  const [clicado, setClicado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [saiu, setSaiu] = useState(false);
  const router = useRouter();

  const nomeItem = doacao.presente_nome ?? "Pix de valor livre";
  const sticker = doacao.presente_sticker ?? (doacao.presente_id ? null : "presente");

  const salvar = (status: StatusDoacao, rotulo: string) => {
    setErro(null);
    setClicado(rotulo);
    iniciar(async () => {
      const r = await moderarDoacao({ id: doacao.id, status, agradecimento, anonimo });
      if (!r.ok) {
        setErro(r.erro);
        avisar(r.erro, "erro");
        if (r.erro.includes("sessão")) router.refresh();
        return;
      }
      const mudou = status !== aba;
      avisar(mudou ? MENSAGEM[status] : "Agradecimento salvo!", "sucesso");
      if (mudou) setSaiu(true);
      router.refresh();
    });
  };

  if (saiu) return null;

  return (
    <li className={`noivos__cartao painel-presente ${salvando ? "noivos__cartao--salvando" : ""}`} aria-busy={salvando}>
      <Miniatura imagem={doacao.presente_imagem} sticker={sticker} nome={nomeItem} />

      <div className="noivos__form">
        <p className="painel-presente__item">
          {nomeItem}
          {doacao.presente_valor ? <span> · {emReais(Number(doacao.presente_valor))}</span> : null}
        </p>
        <p className="noivos__quem">
          <strong>{doacao.nome}</strong> · {doacao.forma === "pix" ? "mandou Pix" : "comprou o presente"} ·{" "}
          <span suppressHydrationWarning>{quando(doacao.confirmado_em ?? doacao.created_at)}</span>
          {doacao.origem === "noivos" && <span className="painel-presente__etiqueta">baixa de vocês</span>}
        </p>
        {doacao.mensagem && <p className="noivos__mensagem">“{doacao.mensagem}”</p>}

        <label className="pix__marcar painel-presente__anonimo">
          <input type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)} />
          <span>Não mostrar o nome no site</span>
        </label>

        <CampoAgradecimento valor={agradecimento} mudar={setAgradecimento} id={`agr-${doacao.id}`} />

        {erro && (
          <p className="noivos__erro-cartao" role="alert">
            {erro}
          </p>
        )}

        <div className="noivos__botoes">
          {BOTOES[aba].map((b) => (
            <button key={b.rotulo} type="button" className={b.classe} disabled={salvando} onClick={() => salvar(b.status, b.rotulo)}>
              {salvando && clicado === b.rotulo ? <Carregando texto="Salvando..." /> : b.rotulo}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}

/** Formulário de baixa manual, aberto embaixo do item escolhido. */
function FormularioBaixa({ presente, fechar }: { presente: Presente; fechar: () => void }) {
  const [nome, setNome] = useState("");
  const [forma, setForma] = useState<FormaDoacao>(presente.tipo === "pix" ? "pix" : "objeto");
  const [agradecimento, setAgradecimento] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [salvando, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    iniciar(async () => {
      const r = await registrarDoacao({ presenteId: presente.id, nome, forma, agradecimento, anonimo });
      if (!r.ok) {
        setErro(r.erro);
        avisar(r.erro, "erro");
        if (r.erro.includes("sessão")) router.refresh();
        return;
      }
      avisar(`Baixa dada: ${presente.nome}`, "sucesso");
      fechar();
      router.refresh();
    });
  };

  return (
    <form className="painel-baixa__form" onSubmit={salvar} aria-busy={salvando}>
      <label className="noivos__campo">
        <span>Quem deu</span>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} maxLength={60} autoFocus />
      </label>
      <fieldset className="painel-baixa__forma">
        <legend>Como chegou</legend>
        {(["objeto", "pix"] as const).map((f) => (
          <label key={f} className="pix__marcar">
            <input type="radio" name={`forma-${presente.id}`} checked={forma === f} onChange={() => setForma(f)} />
            <span>{f === "objeto" ? "Presente comprado" : "Pix"}</span>
          </label>
        ))}
      </fieldset>
      <label className="pix__marcar">
        <input type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)} />
        <span>Não mostrar o nome no site</span>
      </label>
      <CampoAgradecimento valor={agradecimento} mudar={setAgradecimento} id={`agr-baixa-${presente.id}`} />
      {erro && (
        <p className="noivos__erro-cartao" role="alert">
          {erro}
        </p>
      )}
      <div className="noivos__botoes">
        <button type="button" className="noivos__reprovar" onClick={fechar} disabled={salvando}>
          Cancelar
        </button>
        <button type="submit" className="botao botao--rose" disabled={salvando}>
          {salvando ? <Carregando texto="Salvando..." /> : "Dar baixa"}
        </button>
      </div>
    </form>
  );
}

/** Todos os itens da lista, com busca, para marcar quem deu sem precisar de aviso. */
export function DarBaixa({ presentes, confirmadas }: { presentes: Presente[]; confirmadas: DoacaoPainel[] }) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  const dadosPor = useMemo(() => {
    const mapa = new Map<string, string[]>();
    for (const d of confirmadas) {
      if (!d.presente_id) continue;
      mapa.set(d.presente_id, [...(mapa.get(d.presente_id) ?? []), d.nome]);
    }
    return mapa;
  }, [confirmadas]);

  const termo = busca
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  const visiveis = presentes.filter(
    (p) =>
      !termo ||
      p.nome
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .includes(termo),
  );

  return (
    <section className="painel-baixa">
      <label className="noivos__campo painel-baixa__busca">
        <span>Buscar presente</span>
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="geladeira, jantar, toalha..." />
      </label>
      <ul className="painel-baixa__lista">
        {visiveis.map((p) => {
          const quem = dadosPor.get(p.id) ?? [];
          const fechado = p.tipo === "magalu" && quem.length > 0;
          return (
            <li key={p.id} className={`painel-baixa__item ${fechado ? "painel-baixa__item--dado" : ""}`}>
              <div className="painel-baixa__linha">
                <Miniatura imagem={p.imagem_url} sticker={p.sticker} nome={p.nome} />
                <div className="painel-baixa__texto">
                  <p className="painel-presente__item">{p.nome}</p>
                  <p className="noivos__quem">
                    {p.tipo === "pix" ? "Pix" : "Magalu"} · {emReais(p.valor)}
                    {quem.length > 0 && <> · dado por {quem.join(", ")}</>}
                  </p>
                </div>
                {aberto !== p.id && (
                  <button type="button" className={fechado ? "noivos__reprovar" : "botao"} onClick={() => setAberto(p.id)}>
                    {fechado ? "Dar outra baixa" : "Dar baixa"}
                  </button>
                )}
              </div>
              {aberto === p.id && <FormularioBaixa presente={p} fechar={() => setAberto(null)} />}
            </li>
          );
        })}
        {visiveis.length === 0 && <p className="noivos__vazio">Nenhum presente com esse nome.</p>}
      </ul>
    </section>
  );
}
