import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import { createClient } from "@/app/lib/supabase/server";

const TAXA_SERVICO = 45;

export async function POST(request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

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

  const { data: quarto, error } = await supabase
    .from("quartos")
    .select("id, numero, diaria")
    .eq("id", Number(quartoId))
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar quarto:", error);

    return NextResponse.json(
      { erro: "Erro ao buscar quarto no banco de dados" },
      { status: 500 }
    );
  }

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