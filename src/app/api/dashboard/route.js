
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";

export async function GET() {
  try {
    // 1. Verificar autenticação
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 2. Identificar o dia atual no horário de Brasília
    const agora = new Date();

    const partes = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(agora);

    const ano = partes.find((p) => p.type === "year").value;
    const mes = partes.find((p) => p.type === "month").value;
    const dia = partes.find((p) => p.type === "day").value;

    const hoje = `${ano}-${mes}-${dia}`;

    const dataAmanha = new Date(
      Date.UTC(Number(ano), Number(mes) - 1, Number(dia) + 1)
    ).toISOString().slice(0, 10);

    const inicioDia = new Date(
      `${hoje}T00:00:00-03:00`
    ).toISOString();

    const inicioAmanha = new Date(
      `${dataAmanha}T00:00:00-03:00`
    ).toISOString();

    // 3. Buscar quartos
    const { data: quartos, error: erroQuartos } = await supabase
      .from("quartos")
      .select("status");

    if (erroQuartos) {
      throw erroQuartos;
    }

    const totalQuartos = quartos.length;

    const quartosOcupados = quartos.filter(
      (quarto) => quarto.status === "Ocupado"
    ).length;

    const quartosDisponiveis = quartos.filter(
      (quarto) => quarto.status === "Livre"
    ).length;

    const taxaOcupacao =
      totalQuartos > 0
        ? Number(((quartosOcupados / totalQuartos) * 100).toFixed(1))
        : 0;

    // 4. Buscar reservas criadas hoje
    const { count: reservasHoje, error: erroReservas } = await supabase
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .gte("criado_em", inicioDia)
      .lt("criado_em", inicioAmanha);

    if (erroReservas) {
      throw erroReservas;
    }

    // 5. Buscar check-ins realizados hoje
    const { count: checkinsHoje, error: erroCheckins } = await supabase
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .gte("checkin_em", inicioDia)
      .lt("checkin_em", inicioAmanha);

    if (erroCheckins) {
      throw erroCheckins;
    }

    // 6. Buscar check-outs realizados hoje
    const { count: checkoutsHoje, error: erroCheckouts } = await supabase
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .gte("checkout_em", inicioDia)
      .lt("checkout_em", inicioAmanha);

    if (erroCheckouts) {
      throw erroCheckouts;
    }

    // 7. Buscar receitas pagas hoje
    const { data: movimentacoes, error: erroFinanceiro } = await supabase
      .from("movimentacoes_financeiras")
      .select("valor")
      .eq("tipo", "receita")
      .eq("status", "pago")
      .eq("data_movimento", hoje);

    if (erroFinanceiro) {
      throw erroFinanceiro;
    }

    const receitaDiaria = (movimentacoes ?? []).reduce(
      (total, movimentacao) => total + Number(movimentacao.valor || 0),
      0
    );

    // 8. Retornar os indicadores
    return NextResponse.json({
      taxaOcupacao,
      quartosDisponiveis,
      reservasHoje: reservasHoje ?? 0,
      checkinsHoje: checkinsHoje ?? 0,
      checkoutsHoje: checkoutsHoje ?? 0,
      receitaDiaria,
      totalQuartos,
    });

  } catch (erro) {
    console.error("Erro na API do dashboard:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao carregar indicadores" },
      { status: 500 }
    );
  }
}
