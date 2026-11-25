
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request) {
  try {
    // Verificar autenticação
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Receber os filtros da pesquisa
    const { searchParams } = new URL(request.url);

    const dataEntrada = searchParams.get("entrada");
    const dataSaida = searchParams.get("saida");
    const pessoas = Number(searchParams.get("pessoas") || 1);
    const tipo = searchParams.get("tipo");

    // Validar formato das datas
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !dataEntrada ||
      !dataSaida ||
      !formatoData.test(dataEntrada) ||
      !formatoData.test(dataSaida)
    ) {
      return NextResponse.json(
        { erro: "Informe datas válidas no formato AAAA-MM-DD" },
        { status: 400 }
      );
    }

    // Validar se as datas realmente existem
    const entrada = new Date(`${dataEntrada}T00:00:00Z`);
    const saida = new Date(`${dataSaida}T00:00:00Z`);

    if (
      Number.isNaN(entrada.getTime()) ||
      Number.isNaN(saida.getTime()) ||
      entrada.toISOString().slice(0, 10) !== dataEntrada ||
      saida.toISOString().slice(0, 10) !== dataSaida ||
      saida <= entrada ||
      !Number.isInteger(pessoas) ||
      pessoas < 1
    ) {
      return NextResponse.json(
        { erro: "Período ou quantidade de pessoas inválidos" },
        { status: 400 }
      );
    }

    // Buscar quartos cadastrados no Supabase
    const { data: quartos, error: erroQuartos } = await supabase
      .from("quartos")
      .select("*")
      .order("numero", { ascending: true });

    if (erroQuartos) {
      console.error("Erro ao buscar quartos:", erroQuartos);

      return NextResponse.json(
        { erro: "Não foi possível buscar os quartos" },
        { status: 500 }
      );
    }

    // Buscar reservas que tenham conflito com o período informado
    const { data: reservas, error: erroReservas } = await supabase
      .from("reservas")
      .select("id_quarto")
      .neq("status", "Cancelada")
      .lt("data_entrada", dataSaida)
      .gt("data_saida", dataEntrada);

    if (erroReservas) {
      console.error("Erro ao buscar reservas:", erroReservas);

      return NextResponse.json(
        { erro: "Não foi possível verificar as reservas existentes" },
        { status: 500 }
      );
    }

    // Identificar os quartos que já possuem reservas no período
    const quartosReservados = new Set(
      (reservas || []).map((reserva) => Number(reserva.id_quarto))
    );

    // Filtrar os quartos livres
    const disponiveis = (quartos || []).filter((quarto) => {
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

      // Verificar tipo, quando informado
      if (
        tipo &&
        tipo !== "Todos os tipos" &&
        quarto.tipo !== tipo
      ) {
        return false;
      }

      // Verificar se o quarto possui reserva no período
      if (quartosReservados.has(Number(quarto.id))) {
        return false;
      }

      return true;
    });

    return NextResponse.json(disponiveis);

  } catch (erro) {
    console.error("Erro na API de disponibilidade:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar a disponibilidade" },
      { status: 500 }
    );
  }
}
