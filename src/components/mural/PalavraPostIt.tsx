/** "post-it" sem quebrar no hífen (nunca "post-" numa linha e "it" na outra). */
export function PalavraPostIt({ plural = false }: { plural?: boolean }) {
  return <span className="whitespace-nowrap">{plural ? "post-its" : "post-it"}</span>;
}
