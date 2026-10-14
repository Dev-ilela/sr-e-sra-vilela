"use client";

import { useEffect, useState } from "react";
import { calcularRestante, plural, type Restante } from "@/lib/contagem";

type Estado = { tipo: "carregando" } | { tipo: "contando"; r: Restante } | { tipo: "chegou" };

export function Contador({ alvo }: { alvo: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    const data = new Date(alvo);
    const tick = () => {
      const r = calcularRestante(data);
      setEstado(r ? { tipo: "contando", r } : { tipo: "chegou" });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [alvo]);

  if (estado.tipo === "chegou") {
    return (
      <div className="contador contador--pronto">
        <p className="contador__chegou">Chegou o grande dia</p>
      </div>
    );
  }

  const r = estado.tipo === "contando" ? estado.r : null;

  return (
    <div className={`contador ${r ? "contador--pronto" : ""}`} aria-live="off">
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
