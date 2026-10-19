/**
 * Pix "copia e cola" (BR Code estático), com valor fixo ou livre, no padrão EMV do Banco Central.
 * O mesmo texto vira o QR Code. Não passa por intermediário: o dinheiro cai direto na conta.
 *
 * A chave e o nome do recebedor vêm de variáveis de ambiente (só no servidor), para não
 * ficarem no repositório.
 */

export type DadosRecebedor = {
  chave: string;
  /** Nome do titular da conta, como aparece no banco (até 25 caracteres). */
  nome: string;
  /** Cidade do titular (até 15 caracteres). */
  cidade: string;
};

export function recebedorDoAmbiente(): DadosRecebedor | null {
  const chave = process.env.PIX_CHAVE?.trim();
  const nome = process.env.PIX_RECEBEDOR?.trim();
  const cidade = process.env.PIX_CIDADE?.trim();
  if (!chave || !nome || !cidade) return null;
  return { chave, nome, cidade };
}

/** Sem acentos e só com os caracteres que todo banco aceita, cortado no limite do campo. */
function limpar(texto: string, limite: number) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .\-]/g, "")
    .toUpperCase()
    .slice(0, limite)
    .trim();
}

/** Campo EMV: id de 2 dígitos + tamanho de 2 dígitos + valor. */
function campo(id: string, valor: string) {
  return `${id}${valor.length.toString().padStart(2, "0")}${valor}`;
}

/** CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no fim do BR Code. */
function crc16(texto: string) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** `valor` nulo gera o Pix sem valor: o convidado digita quanto quer no app do banco. */
export function gerarPixCopiaECola(recebedor: DadosRecebedor, valor: number | null) {
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", recebedor.chave);

  const semCrc =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    (valor ? campo("54", valor.toFixed(2)) : "") +
    campo("58", "BR") +
    campo("59", limpar(recebedor.nome, 25)) +
    campo("60", limpar(recebedor.cidade, 15)) +
    campo("62", campo("05", "***")) +
    "6304";

  return semCrc + crc16(semCrc);
}
