/**
 * Envolve cada página e é recriado a cada navegação: é o que dá a entrada suave
 * (fade com um leve desfoque) em vez da troca seca de uma tela para outra.
 * Só opacidade é animada, para não mexer em elementos fixos (como o bloquinho do mural).
 */
export default function Transicao({ children }: { children: React.ReactNode }) {
  return <div className="pagina">{children}</div>;
}
