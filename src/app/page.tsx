import { Contador } from "@/components/Contador";
import { Ramo } from "@/components/Ramo";
import { casamento, dataPorExtenso } from "@/config/casamento";

export default function Entrada() {
  return (
    <main className="entrada">
      <div
        className={`entrada__fundo ${casamento.fotoEntrada ? "entrada__fundo--foto" : ""}`}
        style={casamento.fotoEntrada ? { backgroundImage: `url(${casamento.fotoEntrada})` } : undefined}
        aria-hidden="true"
      />
      <div className="entrada__veu" aria-hidden="true" />

      <div className="entrada__conteudo">
        <h1 className="entrada__nomes">
          {casamento.noivo} <span className="entrada__e">e</span> {casamento.noiva}
        </h1>

        <Contador alvo={casamento.dataHora} />

        <div className="entrada__data">
          <Ramo className="entrada__ramo" />
          <p>{dataPorExtenso}</p>
        </div>
      </div>

      <p className="entrada__rodape">Em breve, mais detalhes por aqui.</p>
    </main>
  );
}
