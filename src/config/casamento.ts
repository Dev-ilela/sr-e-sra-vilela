/**
 * Dados centrais do casamento. Tudo que for texto/data do evento vive aqui,
 * para que as páginas nunca tenham valores fixos espalhados.
 */
export const casamento = {
  noivo: "Gabriel",
  noiva: "Bianca",
  // Horário da cerimônia (fuso de Brasília). O contador zera aqui e o site entra no modo "grande dia".
  dataHora: "2027-07-09T18:00:00-03:00",
  // Foto de fundo da entrada. Coloque o arquivo em /public e informe o caminho, ex.: "/fotos/entrada.jpg".
  fotoEntrada: "/fotos/entrada.webp" as string | null,
} as const;

export const dataCasamento = new Date(casamento.dataHora);

export const dataPorExtenso = dataCasamento.toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});
