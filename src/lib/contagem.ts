export type Restante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

/** Tempo restante até `alvo`. Retorna null quando o momento já chegou. */
export function calcularRestante(alvo: Date, agora: Date = new Date()): Restante | null {
  const diff = alvo.getTime() - agora.getTime();
  if (diff <= 0) return null;

  const totalSegundos = Math.floor(diff / 1000);
  return {
    dias: Math.floor(totalSegundos / 86400),
    horas: Math.floor((totalSegundos % 86400) / 3600),
    minutos: Math.floor((totalSegundos % 3600) / 60),
    segundos: totalSegundos % 60,
  };
}

export function plural(n: number, singular: string, pluralForm: string) {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}
