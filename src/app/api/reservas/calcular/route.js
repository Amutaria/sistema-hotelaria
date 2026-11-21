
import { NextResponse } from "next/server";
import quartos from "../../../../../data/quartos";

const TAXA_SERVICO = 45;

export async function POST(request) {
  const { quartoId, dataEntrada, dataSaida } =
    await request.json();

  if (!quartoId || !dataEntrada || !dataSaida) {
    return NextResponse.json(
      { erro: "Informe o quarto e as datas da hospedagem" },
      { status: 400 }
    );
  }

  const entrada = new Date(`${dataEntrada}T00:00:00Z`);
  const saida = new Date(`${dataSaida}T00:00:00Z`);

  if (
    Number.isNaN(entrada.getTime()) ||
    Number.isNaN(saida.getTime()) ||
    saida <= entrada
  ) {
    return NextResponse.json(
      { erro: "Datas inválidas" },
      { status: 400 }
    );
  }

  const quarto = quartos.find(
    (q) => q.id === Number(quartoId)
  );

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  const diarias = Math.round(
    (saida - entrada) / 86400000
  );

  const valorDiaria = Number(quarto.diaria);
  const valorHospedagem = diarias * valorDiaria;

  return NextResponse.json({
    quarto: quarto.numero,
    diarias,
    valorDiaria,
    valorHospedagem,
    taxaServico: TAXA_SERVICO,
    total: valorHospedagem + TAXA_SERVICO,
  });
}
