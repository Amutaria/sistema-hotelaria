export default function QuartoCard({ quarto }) {
  return (
    <div>
      <h2>Quarto {quarto.numero}</h2>

      <p>Tipo: {quarto.tipo}</p>

      <p>Capacidade: {quarto.capacidade} pessoas</p>

      <p>Diária: R$ {quarto.diaria}</p>

      <p>
        {quarto.disponivel
          ? "Disponível"
          : "Ocupado"}
      </p>

      {quarto.disponivel && (
        <button>
          Reservar
        </button>
      )}
    </div>
  );
}