const formatoReal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function emReais(valor: number) {
  return formatoReal.format(valor);
}
