
import { NextResponse } from "next/server";
import reservas from "../../../../../data/reservas";
import quartos from "../../../../../data/quartos";

// Implementar consulta de uma reserva com GET pelo ID
export async function GET(request, { params }) {
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

  return NextResponse.json(reserva);
}

// Alterar uma reserva com PUT
export async function PUT(request, { params }) {
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
      { erro: "Somente reservas confirmadas podem ser alteradas" },
      { status: 409 }
    );
  }

  const dados = await request.json();

  const dataEntrada = dados.dataEntrada || reserva.dataEntrada;
  const dataSaida = dados.dataSaida || reserva.dataSaida;
  const quartoId = Number(dados.quartoId || reserva.quartoId);

  const entrada = new Date(`${dataEntrada}T00:00:00Z`);
  const saida = new Date(`${dataSaida}T00:00:00Z`);

  if (
    Number.isNaN(entrada.getTime()) ||
    Number.isNaN(saida.getTime()) ||
    saida <= entrada
  ) {
    return NextResponse.json(
      { erro: "Período de reserva inválido" },
      { status: 400 }
    );
  }

  const quarto = quartos.find(
  (q) => q.id === quartoId
  );

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  if (
    quarto.status === "Ocupado" ||
    quarto.status === "Manutenção"
  ) {
    return NextResponse.json(
      { erro: "Quarto indisponível" },
      { status: 409 }
    );
  }

  const conflito = reservas.some((r) =>
    r.id !== Number(id) &&
    r.quartoId === quartoId &&
    r.status !== "Cancelada" &&
    dataEntrada < r.dataSaida &&
    dataSaida > r.dataEntrada
  );

  if (conflito) {
    return NextResponse.json(
      { erro: "Já existe reserva para esse quarto nesse período" },
      { status: 409 }
    );
  }

  const diarias = Math.round(
    (saida - entrada) / 86400000
  );

  const valorDiaria = Number(quarto.diaria);
  const hospedagem = diarias * valorDiaria;
  const taxas = 45;

  reserva.quartoId = quartoId;
  reserva.quartoNumero = quarto.numero;
  reserva.dataEntrada = dataEntrada;
  reserva.dataSaida = dataSaida;
  reserva.diarias = diarias;
  reserva.valores = {
    diaria: valorDiaria,
    hospedagem,
    taxas,
    total: hospedagem + taxas,
  };

  reserva.observacoes =
    dados.observacoes ?? reserva.observacoes;

  reserva.pagamento =
    dados.pagamento ?? reserva.pagamento;

  return NextResponse.json(reserva);
}

// Cancelar uma reserva com DELETE
export async function DELETE(request, { params }) {
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
      { erro: "Essa reserva não pode ser cancelada" },
      { status: 409 }
    );
  }

  reserva.status = "Cancelada";

  return NextResponse.json({
    mensagem: "Reserva cancelada com sucesso",
    reserva,
  });
}