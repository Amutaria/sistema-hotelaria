
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

  if (reserva.status !== "Confirmada") {
    return NextResponse.json(
      { erro: "Essa reserva não pode realizar check-in" },
      { status: 409 }
    );
  }

  const quarto = quartos.find(
    (q) => q.id === reserva.quartoId
  );

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  if (quarto.status === "Manutenção" || quarto.status === "Ocupado") {
    return NextResponse.json(
      { erro: "Quarto indisponível para check-in" },
      { status: 409 }
    );
  }

  reserva.status = "Em hospedagem";
  quarto.status = "Ocupado";

  return NextResponse.json({
    mensagem: "Check-in realizado com sucesso",
    reserva,
  });
}
