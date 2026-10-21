/** Enquanto a lista dos noivos carrega (trocar de aba, depois de entrar). */
export default function Carregando() {
  return (
    <main className="noivos noivos--carregando" aria-busy="true">
      <span className="carregando carregando--grande" aria-hidden="true" />
      <p>Buscando os post-its...</p>
    </main>
  );
}
