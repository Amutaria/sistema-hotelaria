import { NextResponse } from "next/server";
import reservas from "../../../../data/reservas";
import quartos from "../../../../data/quartos";

// GET: listar todas as reservas
export async function GET() {
  return NextResponse.json(reservas);
}

// POST: cadastrar uma nova reserva
export async function POST(request) {
  const dados = await request.json();

  const {
    hospede,
    quartoId,
    dataEntrada,
    dataSaida,
    quantidadePessoas,
    observacoes,
    pagamento,
  } = dados;

  // Verificar campos obrigatórios
  if (
    !hospede?.nome ||
    !hospede?.cpf ||
    !hospede?.email ||
    !quartoId ||
    !dataEntrada ||
    !dataSaida ||
    !quantidadePessoas
  ) {
    return NextResponse.json(
      { erro: "Preencha todos os campos obrigatórios" },
      { status: 400 }
    );
  }

  // Validar datas
  const entrada = new Date(`${dataEntrada}T00:00:00Z`);
  const saida = new Date(`${dataSaida}T00:00:00Z`);

  if (
    Number.isNaN(entrada.getTime()) ||
    Number.isNaN(saida.getTime()) ||
    saida <= entrada
  ) {
    return NextResponse.json(
      { erro: "A data de saída deve ser posterior à entrada" },
      { status: 400 }
    );
  }

  // Procurar o quarto
  const quarto = quartos.find(
    (q) => q.id === Number(quartoId)
  );

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  // Impedir reserva de quarto ocupado ou em manutenção
  if (
    quarto.status === "Ocupado" ||
    quarto.status === "Manutenção"
  ) {
    return NextResponse.json(
      { erro: "Este quarto não está disponível para reserva" },
      { status: 409 }
    );
  }

  // Verificar capacidade
  if (Number(quantidadePessoas) > Number(quarto.capacidade)) {
    return NextResponse.json(
      { erro: "A quantidade de hóspedes excede a capacidade do quarto" },
      { status: 400 }
    );
  }

  // Verificar conflito de datas
  const conflito = reservas.some((r) => {
    return (
      r.quartoId === Number(quartoId) &&
      r.status !== "Cancelada" &&
      dataEntrada < r.dataSaida &&
      dataSaida > r.dataEntrada
    );
  });

  if (conflito) {
    return NextResponse.json(
      { erro: "Este quarto já possui uma reserva nesse período" },
      { status: 409 }
    );
  }

  // Calcular quantidade de diárias
  const diarias = Math.round(
    (saida - entrada) / 86400000
  );

  // Calcular valores no servidor
  const valorDiaria = Number(quarto.diaria);
  const valorHospedagem = diarias * valorDiaria;
  const taxaServico = 45;

  const novaReserva = {
    id: reservas.length
      ? Math.max(...reservas.map((r) => r.id)) + 1
      : 1,

    codigo: `RES-${Date.now()}`,
    hospede,
    quartoId: Number(quartoId),
    quartoNumero: quarto.numero,
    dataEntrada,
    dataSaida,
    quantidadePessoas: Number(quantidadePessoas),
    diarias,
    observacoes: observacoes || "",
    pagamento: pagamento || "",
    valores: {
      diaria: valorDiaria,
      hospedagem: valorHospedagem,
      taxas: taxaServico,
      total: valorHospedagem + taxaServico,
    },
    status: "Confirmada",
    criadoEm: new Date().toISOString(),
  };

  reservas.push(novaReserva);

  return NextResponse.json(novaReserva, { status: 201 });
}
