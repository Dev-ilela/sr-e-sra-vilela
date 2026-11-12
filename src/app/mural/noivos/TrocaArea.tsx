import Link from "next/link";

/** Alterna entre o mural e a lista de presentes dentro da área dos noivos. */
export function TrocaArea({ atual }: { atual: "mural" | "presentes" }) {
  return (
    <nav className="noivos__areas" aria-label="Área">
      <Link href="/mural/noivos" className="noivos__area" aria-current={atual === "mural" ? "page" : undefined}>
        Post-its
      </Link>
      <Link href="/mural/noivos/presentes" className="noivos__area" aria-current={atual === "presentes" ? "page" : undefined}>
        Presentes
      </Link>
    </nav>
  );
}
