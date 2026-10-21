"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animar, caixa, deVolta, esperar, limparAnimacoes, semMovimento } from "@/lib/animar";
import { enviadosNaUltimaHora, enviarRecado, guardarMeuRecado, type MeuRecado } from "@/lib/meusRecados";
import { CORES, LIMITE_MENSAGEM, LIMITE_NOME, MOSTRAR_CONTADOR_EM, NOME_DA_COR, type CorPostIt } from "@/lib/recados";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";

type Props = {
  /** A folha de cima do bloquinho, de onde o post-it sai. */
  origem: HTMLElement | null;
  aoEnviar: (meu: MeuRecado) => void;
  aoFechar: () => void;
};

type Fase = "escrevendo" | "enviando" | "guardando" | "recebido";

const ERROS = {
  vazio: "Escreve um recadinho e seu nome antes de colar.",
  repetido: "Esse recado já chegou pra gente!",
  muitos: "Muita gente escrevendo agora. Tenta de novo daqui a pouco?",
  limite: "Recebemos vários post-its seus agora há pouco. Que tal esperar um tempinho?",
  rede: "Não deu pra enviar agora. Confere a internet e tenta de novo?",
};

/**
 * Escrever um post-it: a folha de cima do bloquinho se destaca, vem para o centro e
 * vira o próprio formulário. Ao enviar, ganha o carimbo "pros noivos", entra num
 * envelope, a aba fecha e o envelope sai voando até os noivos.
 */
export function Escritor({ origem, aoEnviar, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const papel = useRef<HTMLFormElement>(null);
  const controles = useRef<HTMLDivElement>(null);
  const envelope = useRef<HTMLDivElement>(null);
  const recebido = useRef<HTMLDivElement>(null);
  const fechando = useRef(false);

  const [cor, setCor] = useState<CorPostIt>("amarelo");
  const [mensagem, setMensagem] = useState("");
  const [nome, setNome] = useState("");
  const [fase, setFase] = useState<Fase>("escrevendo");
  const [erro, setErro] = useState<string | null>(null);
  const enviado = useRef<MeuRecado | null>(null);

  // A folha se descola do bloquinho e vem para o centro.
  useLayoutEffect(() => {
    const d = dialogo.current;
    const p = papel.current;
    if (!d || !p) return;
    d.showModal();
    origem?.classList.add("bloquinho__folha--solta");

    const abrir = async () => {
      if (origem) {
        p.style.transformOrigin = "top center";
        const de = deVolta(caixa(origem), caixa(p), -3, true);
        await animar(
          p,
          [
            { transform: de, boxShadow: "0 1px 2px rgba(20,35,59,.2)" },
            // a ponta de baixo levanta, presa só pela cola do topo
            { transform: `${de} perspective(700px) rotateX(-28deg)`, offset: 0.2, boxShadow: "0 18px 18px -10px rgba(20,35,59,.35)" },
            { transform: `${de} perspective(700px) rotateX(-8deg) translateY(-14px)`, offset: 0.32 },
            { transform: "none", boxShadow: "0 40px 70px -26px rgba(20,35,59,.6)" },
          ],
          { duration: 950, easing: "cubic-bezier(.25,.8,.25,1)" },
        );
        limparAnimacoes(p);
        p.style.transformOrigin = "";
      } else {
        await animar(p, [{ transform: "translateY(40px) rotate(-6deg)", opacity: 0 }, { transform: "none", opacity: 1 }], {
          duration: 420,
          easing: "cubic-bezier(.2,.8,.2,1)",
        });
        limparAnimacoes(p);
      }
      origem?.classList.remove("bloquinho__folha--solta");
      // Sem "fill: none": os controles precisam continuar visíveis depois da animação.
      animar(controles.current, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
        duration: 280,
        easing: "ease-out",
      });
      p.querySelector("textarea")?.focus({ preventScroll: true });
    };
    abrir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fechar = useCallback(async () => {
    if (fechando.current) return;
    fechando.current = true;
    const d = dialogo.current;
    const p = papel.current;
    d?.classList.add("escritor--fechando");

    if (enviado.current) {
      // Já enviado: o recado pronto aparece no quadro.
      await animar(recebido.current, [{ opacity: 1 }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 200 });
      d?.close();
      aoEnviar(enviado.current);
      aoFechar();
      return;
    }

    await animar(controles.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 120 });
    if (origem && p) {
      // Desistiu: a folha volta para o bloquinho.
      p.style.transformOrigin = "top center";
      await animar(p, [{ transform: "none" }, { transform: deVolta(caixa(origem), caixa(p), -3, true), opacity: 0.6 }], {
        duration: 460,
        easing: "cubic-bezier(.5,0,.2,1)",
      });
    }
    d?.close();
    aoFechar();
  }, [aoEnviar, aoFechar, origem]);

  useEffect(() => {
    const d = dialogo.current;
    const aoCancelar = (e: Event) => {
      e.preventDefault();
      if (fase === "escrevendo" || fase === "recebido") fechar();
    };
    d?.addEventListener("cancel", aoCancelar);
    return () => d?.removeEventListener("cancel", aoCancelar);
  }, [fase, fechar]);

  const tremer = () =>
    animar(
      papel.current,
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-10px) rotate(-1.5deg)" },
        { transform: "translateX(8px) rotate(1deg)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 380, fill: "none" },
    );

  /** O post-it entra no envelope, a aba fecha e ele voa até os noivos. */
  const guardarNoEnvelope = async () => {
    const p = papel.current;
    const env = envelope.current;
    if (!p || !env) return;
    const pecas = Array.from(env.parentElement!.querySelectorAll<HTMLElement>(".envelope__peca"));
    const fundo = env;
    const aba = pecas.find((x) => x.classList.contains("envelope__aba"));
    const selo = pecas.find((x) => x.classList.contains("envelope__selo"));

    // 1. Carimbo
    await animar(
      p.querySelector(".escritor__carimbo"),
      [
        { opacity: 0, transform: "scale(2.6) rotate(-28deg)" },
        { opacity: 1, transform: "scale(.92) rotate(-12deg)", offset: 0.75 },
        { opacity: 1, transform: "scale(1) rotate(-12deg)" },
      ],
      { duration: 340, easing: "cubic-bezier(.5,0,.75,0)" },
    );
    animar(p, [{ scale: "1" }, { scale: ".97" }, { scale: "1" }], { duration: 200, fill: "none" });
    await esperar(420);

    // 2. O envelope sobe por baixo
    pecas.forEach((x) => (x.style.visibility = "visible"));
    await Promise.all(
      pecas
        .filter((x) => x !== selo)
        .map((x) => {
          // A aba entra aberta (virada para cima).
          const giro = x === aba ? " rotateX(180deg)" : "";
          return animar(x, [{ transform: `translateY(70vh)${giro}` }, { transform: `translateY(0)${giro}` }], {
            duration: 560,
            easing: "cubic-bezier(.2,.9,.25,1.05)",
          });
        }),
    );

    // 3. O post-it diminui e desce para dentro do envelope
    const r = caixa(p);
    const e = caixa(fundo);
    const escala = Math.min((e.width * 0.78) / r.width, (e.height * 0.84) / r.height);
    const cx = e.left + e.width / 2 - (r.left + r.width / 2);
    const altura = r.height * escala;
    const acima = e.top - altura * 0.95 + altura / 2 - (r.top + r.height / 2);
    const dentro = e.top + e.height * 0.1 + altura / 2 - (r.top + r.height / 2);
    await animar(
      p,
      [
        { transform: "none" },
        { transform: `translate(${cx}px, ${acima}px) scale(${escala}) rotate(4deg)`, offset: 0.55 },
        { transform: `translate(${cx}px, ${dentro}px) scale(${escala}) rotate(0deg)` },
      ],
      { duration: 820, easing: "cubic-bezier(.45,.05,.3,1)" },
    );

    // 4. A aba fecha e o selo de coração cola
    if (aba) {
      aba.style.zIndex = "5";
      await animar(aba, [{ transform: "rotateX(180deg)" }, { transform: "rotateX(0deg)" }], {
        duration: 420,
        easing: "cubic-bezier(.6,0,.4,1)",
      });
    }
    p.style.visibility = "hidden";
    await animar(selo, [{ transform: "scale(0) rotate(-40deg)" }, { transform: "scale(1.25) rotate(8deg)", offset: 0.7 }, { transform: "scale(1) rotate(0)" }], {
      duration: 320,
      easing: "ease-out",
    });
    await esperar(260);

    // 5. Lá vai ele, até os noivos
    await Promise.all(
      pecas.map((x) =>
        animar(
          x,
          [
            { transform: "translateY(0) rotate(0)", opacity: 1 },
            { transform: "translateY(18px) rotate(-3deg)", opacity: 1, offset: 0.18 },
            { transform: "translate(42vw, -85vh) rotate(24deg) scale(.45)", opacity: 0 },
          ],
          { duration: 900, easing: "cubic-bezier(.5,0,.6,1)" },
        ),
      ),
    );
  };

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (fase !== "escrevendo") return;
    const dados = new FormData(evento.currentTarget);
    const texto = mensagem.trim();
    const quem = nome.trim();

    if (texto.length < 3 || quem.length < 2) {
      setErro(ERROS.vazio);
      tremer();
      return;
    }
    if (enviadosNaUltimaHora() >= 5) {
      setErro(ERROS.limite);
      tremer();
      return;
    }

    setErro(null);
    setFase("enviando");
    const meu: MeuRecado = { id: crypto.randomUUID(), nome: quem, mensagem: texto, cor, em: new Date().toISOString() };

    // Campo escondido preenchido = robô. Finge que deu certo e não grava nada.
    const robo = String(dados.get("site") ?? "") !== "";
    const resultado = robo ? { ok: true as const } : await enviarRecado({ id: meu.id, nome: quem, mensagem: texto, cor });

    if (!resultado.ok) {
      setErro(ERROS[resultado.motivo]);
      setFase("escrevendo");
      tremer();
      return;
    }

    if (!robo) guardarMeuRecado(meu);
    enviado.current = robo ? null : meu;
    setFase("guardando");
    await animar(controles.current, [{ opacity: 1 }, { opacity: 0, transform: "translateY(10px)" }], { duration: 200 });
    if (semMovimento()) {
      papel.current!.style.visibility = "hidden";
    } else {
      await guardarNoEnvelope();
    }
    setFase("recebido");
  };

  useEffect(() => {
    if (fase !== "recebido") return;
    animar(recebido.current, [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], {
      duration: 360,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
    recebido.current?.querySelector("button")?.focus();
  }, [fase]);

  const mostrarContador = mensagem.length >= MOSTRAR_CONTADOR_EM;

  return (
    <dialog ref={dialogo} className="escritor" aria-labelledby="escritor-titulo">
      <h2 id="escritor-titulo" className="sr-only">
        Escrever um post-it pros noivos
      </h2>

      <div className="escritor__palco">
        {/* Envelope em peças separadas: o post-it passa entre o fundo e a frente. */}
        <div ref={envelope} className="envelope__peca envelope__fundo" aria-hidden="true" />
        <div className="envelope__peca envelope__aba" aria-hidden="true" />
        <svg className="envelope__peca envelope__frente" viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 L50 35 L100 0 V64 H0 Z" />
          <path d="M0 64 L40 30 M100 64 L60 30" className="envelope__vinco" />
        </svg>
        <div className="envelope__peca envelope__selo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
          </svg>
        </div>

        <form ref={papel} className={`escritor__papel postit postit--${cor} postit--grande`} onSubmit={enviar} noValidate>
          <label className="sr-only" htmlFor="postit-mensagem">
            Seu recado
          </label>
          <textarea
            id="postit-mensagem"
            name="mensagem"
            className={`escritor__texto ${mensagem.length > 200 ? "escritor__texto--longo" : mensagem.length > 110 ? "escritor__texto--medio" : ""}`}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value.slice(0, LIMITE_MENSAGEM))}
            maxLength={LIMITE_MENSAGEM}
            placeholder="Escreva aqui seu recado pros noivos..."
            readOnly={fase !== "escrevendo"}
          />
          <div className="escritor__assinatura">
            <label className="sr-only" htmlFor="postit-nome">
              Seu nome
            </label>
            <input
              id="postit-nome"
              name="nome"
              className="escritor__nome"
              value={nome}
              onChange={(e) => setNome(e.target.value.slice(0, LIMITE_NOME))}
              maxLength={LIMITE_NOME}
              placeholder="– seu nome (ou do casal)"
              autoComplete="name"
              readOnly={fase !== "escrevendo"}
            />
          </div>
          {mostrarContador && (
            <span className={`escritor__contador ${mensagem.length >= LIMITE_MENSAGEM ? "escritor__contador--cheio" : ""}`} aria-live="polite">
              {mensagem.length}/{LIMITE_MENSAGEM}
            </span>
          )}
          <input className="escritor__isca" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <span className="escritor__carimbo" aria-hidden="true">
            pros noivos
          </span>
        </form>

        <div ref={controles} className="escritor__controles" style={{ opacity: 0 }}>
          <fieldset className="escritor__cores">
            <legend className="sr-only">Cor do post-it</legend>
            {CORES.map((c) => (
              <label key={c} className={`escritor__cor escritor__cor--${c}`} title={NOME_DA_COR[c]}>
                <input type="radio" name="cor" value={c} checked={cor === c} onChange={() => setCor(c)} />
                <span className="sr-only">{NOME_DA_COR[c]}</span>
              </label>
            ))}
          </fieldset>

          <p className="escritor__aviso">A gente lê e aprova antes de colar no quadro, beleza?</p>
          {erro && (
            <p className="escritor__erro" role="alert">
              {erro}
            </p>
          )}

          <div className="escritor__acoes">
            <button type="button" className="escritor__desistir" onClick={fechar} disabled={fase !== "escrevendo"}>
              Desistir
            </button>
            <button
              type="button"
              className="botao botao--rose"
              onClick={() => papel.current?.requestSubmit()}
              disabled={fase !== "escrevendo"}
            >
              {fase === "enviando" ? (
                <>
                  <span className="carregando" aria-hidden="true" /> Colando...
                </>
              ) : (
                "Colar no mural"
              )}
            </button>
          </div>
        </div>

        {fase === "recebido" && (
          <div ref={recebido} className="escritor__recebido" role="status">
            <p className="escritor__recebido-titulo">Recebido!</p>
            <p>Seu <PalavraPostIt /> já está com a gente. Assim que a gente ler, ele vai pro quadro.</p>
            <button type="button" className="botao botao--claro" onClick={fechar}>
              Voltar pro mural
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
