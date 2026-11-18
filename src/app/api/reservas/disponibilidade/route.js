
import { NextResponse } from "next/server";
import quartos from "../../../../../data/quartos";
import reservas from "../../../../../data/reservas";

// Receber datas de entrada e saida com GET
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const dataEntrada = searchParams.get("entrada");
  const dataSaida = searchParams.get("saida");
  const pessoas = Number(searchParams.get("pessoas") || 1);
  const tipo = searchParams.get("tipo");

  if (!dataEntrada || !dataSaida) {
    return NextResponse.json(
      { erro: "Informe as datas de entrada e saída" },
      { status: 400 }
    );
  }

  const entrada = new Date(`${dataEntrada}T00:00:00Z`);
  const saida = new Date(`${dataSaida}T00:00:00Z`);

  if (
    Number.isNaN(entrada.getTime()) ||
    Number.isNaN(saida.getTime()) ||
    saida <= entrada ||
    pessoas < 1
  ) {
    return NextResponse.json(
      { erro: "Período ou quantidade de pessoas inválidos" },
      { status: 400 }
    );
  }

  const disponiveis = quartos.filter((quarto) => {
    // Não oferecer quartos ocupados ou em manutenção
    if (
      quarto.status === "Ocupado" ||
      quarto.status === "Manutenção"
    ) {
      return false;
    }

    // Verificar capacidade
    if (Number(quarto.capacidade) < pessoas) {
      return false;
    }

    // Filtrar pelo tipo, quando informado
    if (tipo && tipo !== "Todos os tipos" && quarto.tipo !== tipo) {
      return false;
    }

    // Verificar reservas no mesmo período
    const conflito = reservas.some((reserva) => {
      return (
        reserva.quartoId === quarto.id &&
        reserva.status !== "Cancelada" &&
        dataEntrada < reserva.dataSaida &&
        dataSaida > reserva.dataEntrada
      );
    });

    return !conflito;
  });

  return NextResponse.json(disponiveis);
}
