import type { Metadata } from "next";
import Link from "next/link";
import { listarRecados, sair, type Status } from "./acoes";
import { Avisos } from "@/components/Avisos";
import { CartaoModeracao, FormularioEntrar } from "./Moderacao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Área dos noivos",
  robots: { index: false, follow: false },
};

const ABAS: { status: Status; rotulo: string; vazio: string }[] = [
  { status: "pendente", rotulo: "Pendentes", vazio: "Nenhum post-it esperando. Tudo lido!" },
  { status: "aprovado", rotulo: "No mural", vazio: "Nenhum post-it aprovado ainda." },
  { status: "recusado", rotulo: "Reprovados", vazio: "Nenhum post-it reprovado." },
];

export default async function AreaDosNoivos({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba: abaPedida } = await searchParams;
  const aba = ABAS.find((a) => a.status === abaPedida) ?? ABAS[0];

  const [lista, pendentes] = await Promise.all([
    listarRecados(aba.status),
    aba.status === "pendente" ? null : listarRecados("pendente"),
  ]);

  if (lista === null) {
    return (
      <main className="noivos noivos--fora">
        <FormularioEntrar />
      </main>
    );
  }

  const qtdPendentes = (aba.status === "pendente" ? lista : pendentes)?.length ?? 0;

  return (
    <main className="noivos">
      <header className="noivos__topo">
        <div>
          <p className="noivos__chapeu">Área dos noivos</p>
          <h1 className="noivos__titulo">Mural de post-its</h1>
        </div>
        <div className="noivos__topo-acoes">
          <Link href="/mural" className="noivos__ver">
            Ver o mural
          </Link>
          <form action={sair}>
            <button type="submit" className="noivos__sair">
              Sair
            </button>
          </form>
        </div>
      </header>

      <nav className="noivos__abas" aria-label="Filtrar post-its">
        {ABAS.map((a) => (
          <Link
            key={a.status}
            href={a.status === "pendente" ? "/mural/noivos" : `/mural/noivos?aba=${a.status}`}
            className="noivos__aba"
            aria-current={a.status === aba.status ? "page" : undefined}
          >
            {a.rotulo}
            {a.status === "pendente" && qtdPendentes > 0 && <span className="noivos__bolinha">{qtdPendentes}</span>}
          </Link>
        ))}
      </nav>

      {lista.length === 0 ? (
        <p className="noivos__vazio">{aba.vazio}</p>
      ) : (
        <ul className="noivos__lista">
          {lista.map((r) => (
            <CartaoModeracao key={`${r.id}-${aba.status}`} recado={r} aba={aba.status} />
          ))}
        </ul>
      )}

      <Avisos />
    </main>
  );
}
