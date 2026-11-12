import type { Metadata } from "next";
import Link from "next/link";
import { Avisos } from "@/components/Avisos";
import { FormularioEntrar } from "../Moderacao";
import { sair } from "../acoes";
import { TrocaArea } from "../TrocaArea";
import { CartaoDoacao, DarBaixa } from "./Painel";
import { listarDoacoes, listarPresentes, type StatusDoacao } from "./acoes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Área dos noivos - Presentes",
  robots: { index: false, follow: false },
};

type Aba = StatusDoacao | "baixa";

const ABAS: { aba: Aba; rotulo: string; vazio: string }[] = [
  { aba: "pendente", rotulo: "Avisos", vazio: "Nenhum aviso esperando. Tudo conferido!" },
  { aba: "confirmado", rotulo: "Presenteados", vazio: "Nenhum presente confirmado ainda." },
  { aba: "baixa", rotulo: "Dar baixa", vazio: "" },
  { aba: "recusado", rotulo: "Recusados", vazio: "Nenhum aviso recusado." },
];

export default async function PainelPresentes({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba: pedida } = await searchParams;
  const aba = ABAS.find((a) => a.aba === pedida) ?? ABAS[0];

  const statusLista: StatusDoacao = aba.aba === "baixa" ? "confirmado" : aba.aba;
  const [lista, pendentes, presentes] = await Promise.all([
    listarDoacoes(statusLista),
    aba.aba === "pendente" ? null : listarDoacoes("pendente"),
    aba.aba === "baixa" ? listarPresentes() : null,
  ]);

  if (lista === null) {
    return (
      <main className="noivos noivos--fora">
        <FormularioEntrar />
      </main>
    );
  }

  const qtdPendentes = (aba.aba === "pendente" ? lista : pendentes)?.length ?? 0;

  return (
    <main className="noivos">
      <header className="noivos__topo">
        <div>
          <p className="noivos__chapeu">Área dos noivos</p>
          <h1 className="noivos__titulo">Lista de presentes</h1>
        </div>
        <div className="noivos__topo-acoes">
          <Link href="/presentes" className="noivos__ver">
            Ver a lista
          </Link>
          <form action={sair}>
            <button type="submit" className="noivos__sair">
              Sair
            </button>
          </form>
        </div>
      </header>

      <TrocaArea atual="presentes" />

      <nav className="noivos__abas" aria-label="Filtrar presentes">
        {ABAS.map((a) => (
          <Link
            key={a.aba}
            href={a.aba === "pendente" ? "/mural/noivos/presentes" : `/mural/noivos/presentes?aba=${a.aba}`}
            className="noivos__aba"
            aria-current={a.aba === aba.aba ? "page" : undefined}
          >
            {a.rotulo}
            {a.aba === "pendente" && qtdPendentes > 0 && <span className="noivos__bolinha">{qtdPendentes}</span>}
          </Link>
        ))}
      </nav>

      {aba.aba === "baixa" ? (
        <DarBaixa presentes={presentes ?? []} confirmadas={lista} />
      ) : lista.length === 0 ? (
        <p className="noivos__vazio">{aba.vazio}</p>
      ) : (
        <ul className="noivos__lista">
          {lista.map((d) => (
            <CartaoDoacao key={`${d.id}-${aba.aba}`} doacao={d} aba={statusLista} />
          ))}
        </ul>
      )}

      <Avisos />
    </main>
  );
}
