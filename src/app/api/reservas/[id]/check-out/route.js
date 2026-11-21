
import { NextResponse } from "next/server";
import reservas from "../../../../../../data/reservas";
import quartos from "../../../../../../data/quartos";

export async function POST(request, { params }) {
  const { id } = await params;

  const reserva = reservas.find(
    (r) => r.id === Number(id)
  );

  if (!reserva) {
    return NextResponse.json(
      { erro: "Reserva não encontrada" },
      { status: 404 }
    );
  }

  if (reserva.status !== "Em hospedagem") {
    return NextResponse.json(
      { erro: "É necessário realizar o check-in antes do check-out" },
      { status: 409 }
    );
  }

  const quarto = quartos.find(
    (q) => q.id === reserva.quartoId
  );

  reserva.status = "Finalizada";

  if (quarto) {
    // Verificar se há outra reserva confirmada para o quarto
    const temReservaFutura = reservas.some((r) =>
      r.id !== reserva.id &&
      r.quartoId === quarto.id &&
      r.status === "Confirmada"
    );

    quarto.status = temReservaFutura ? "Reservado" : "Livre";
  }

  return NextResponse.json({
    mensagem: "Check-out realizado com sucesso",
    reserva,
  });
}
