"use client";

import { useEffect, useState } from "react";
import { Fogos } from "@/components/Fogos";
import { calcularRestante, plural, type Restante } from "@/lib/contagem";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "contando"; r: Restante }
  | { tipo: "grandeDia" }
  | { tipo: "casados"; dias: number };

const DIA_MS = 86_400_000;

/** Fim do dia do casamento no horário de Brasília. */
function fimDoDia(alvo: Date) {
  const dia = alvo.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  return new Date(`${dia}T23:59:59-03:00`);
}

function calcularEstado(alvo: Date, agora: Date): Estado {
  const r = calcularRestante(alvo, agora);
  if (r) return { tipo: "contando", r };
  if (agora <= fimDoDia(alvo)) return { tipo: "grandeDia" };
  return { tipo: "casados", dias: Math.floor((agora.getTime() - alvo.getTime()) / DIA_MS) };
}

export function Contador({ alvo }: { alvo: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    const data = new Date(alvo);
    // ?previa=grande-dia permite ver a comemoração antes da data.
    const previa = new URLSearchParams(window.location.search).get("previa");
    const tick = () =>
      setEstado(previa === "grande-dia" ? { tipo: "grandeDia" } : calcularEstado(data, new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [alvo]);

  if (estado.tipo === "grandeDia") {
    return (
      <div className="contador contador--pronto">
        <Fogos />
        <p className="contador__chegou">Chegou o grande dia</p>
      </div>
    );
  }

  if (estado.tipo === "casados") {
    return (
      <div className="contador contador--pronto">
        <p className="contador__dias">{estado.dias}</p>
        <p className="contador__resto">{estado.dias === 1 ? "dia" : "dias"} de casados</p>
      </div>
    );
  }

  const r = estado.tipo === "contando" ? estado.r : null;

  return (
    <div className={`contador ${r ? "contador--pronto" : ""}`}>
      <p className="contador__dias" aria-hidden={!r}>
        {r ? r.dias : "000"}
      </p>
      <p className="contador__resto">
        {r ? (
          <>
            {r.dias === 1 ? "dia" : "dias"},{" "}
            <span className="tabular">{plural(r.horas, "hora", "horas")}</span>,{" "}
            <span className="tabular">{plural(r.minutos, "minuto", "minutos")}</span> e{" "}
            <span className="tabular segundos">{plural(r.segundos, "segundo", "segundos")}</span>
          </>
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
