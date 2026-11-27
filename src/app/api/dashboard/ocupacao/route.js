
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";

// Retorna a data atual no horário de Brasília.
function obterHoje() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const ano = partes.find((p) => p.type === "year").value;
  const mes = partes.find((p) => p.type === "month").value;
  const dia = partes.find((p) => p.type === "day").value;

  return `${ano}-${mes}-${dia}`;
}

// Trabalha com datas sem depender do fuso horário do computador.
function adicionarDias(data, quantidade) {
  const resultado = new Date(`${data}T12:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + quantidade);

  return resultado.toISOString().slice(0, 10);
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

function obterInicioPeriodo(hoje, periodo) {
  switch (periodo) {
    case "7d":
      return adicionarDias(hoje, -6);
    case "1m":
      return adicionarDias(hoje, -29);
    case "3m":
      return adicionarDias(hoje, -89);
    case "6m":
      return adicionarDias(hoje, -179);
    case "1a":
      return adicionarDias(hoje, -364);
    default:
      return null;
  }
}

function agruparPontos(pontos, periodo) {
  if (periodo === "7d" || periodo === "1m") {
    return pontos.map((ponto) => ({
      label: formatarData(ponto.data),
      ocupacao: ponto.ocupacao,
    }));
  }

  const tamanhoGrupo =
    periodo === "3m" ? 7 : periodo === "6m" ? 14 : null;

  const grupos = [];

  if (tamanhoGrupo) {
    for (let i = 0; i < pontos.length; i += tamanhoGrupo) {
      const grupo = pontos.slice(i, i + tamanhoGrupo);
      const media =
        grupo.reduce((total, ponto) => total + ponto.ocupacao, 0) /
        grupo.length;

      grupos.push({
        label: `${formatarData(grupo[0].data)}–${formatarData(
          grupo[grupo.length - 1].data
        )}`,
        ocupacao: Number(media.toFixed(1)),
      });
    }

    return grupos;
  }

  // Para 1 ano, agrupa por mês.
  const meses = new Map();

  for (const ponto of pontos) {
    const mes = ponto.data.slice(0, 7);

    if (!meses.has(mes)) {
      meses.set(mes, []);
    }

    meses.get(mes).push(ponto.ocupacao);
  }

  for (const [mes, valores] of meses) {
    const media =
      valores.reduce((total, valor) => total + valor, 0) /
      valores.length;

    const [ano, numeroMes] = mes.split("-");

    grupos.push({
      label: `${numeroMes}/${ano.slice(2)}`,
      ocupacao: Number(media.toFixed(1)),
    });
  }

  return grupos;
}

export async function GET(request) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get("periodo") || "7d";

    const hoje = obterHoje();
    const dataInicio = obterInicioPeriodo(hoje, periodo);

    if (!dataInicio) {
      return NextResponse.json(
        { erro: "Período inválido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Busca o total de quartos cadastrados.
    const { data: quartos, error: erroQuartos } = await supabase
      .from("quartos")
      .select("id");

    if (erroQuartos) {
      throw erroQuartos;
    }

    const totalQuartos = quartos?.length ?? 0;

    // Busca reservas que cruzam o intervalo selecionado.
    const { data: reservas, error: erroReservas } = await supabase
      .from("reservas")
      .select("id_quarto, data_entrada, data_saida, status")
      .neq("status", "Cancelada")
      .lte("data_entrada", hoje)
      .gt("data_saida", dataInicio);

    if (erroReservas) {
      throw erroReservas;
    }

    // Calcula a ocupação de cada dia.
    const pontosDiarios = [];

    for (
      let data = dataInicio;
      data <= hoje;
      data = adicionarDias(data, 1)
    ) {
      const quartosOcupados = new Set(
        (reservas ?? [])
          .filter(
            (reserva) =>
              reserva.data_entrada <= data &&
              reserva.data_saida > data
          )
          .map((reserva) => reserva.id_quarto)
      );

      const ocupacao =
        totalQuartos > 0
          ? Number(
              ((quartosOcupados.size / totalQuartos) * 100).toFixed(1)
            )
          : 0;

      pontosDiarios.push({
        data,
        ocupacao,
      });
    }

    const pontos = agruparPontos(pontosDiarios, periodo);

    return NextResponse.json({
      periodo,
      dataInicio,
      dataFim: hoje,
      totalQuartos,
      pontos,
    });
  } catch (erro) {
    console.error("Erro na API de ocupação:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao carregar ocupação histórica" },
      { status: 500 }
    );
  }
}
