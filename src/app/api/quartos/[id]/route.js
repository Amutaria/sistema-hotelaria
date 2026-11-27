
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import { createClient } from "@/app/lib/supabase/server";

const TIPOS_PERMITIDOS = [
  "Standard",
  "Luxo",
  "Suíte",
  "Executivo",
];

const STATUS_PERMITIDOS = [
  "Livre",
  "Ocupado",
  "Reservado",
  "Manutenção",
];

// GET - Buscar um quarto específico
// GET - Buscar um quarto específico com histórico de ocupação
export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      return NextResponse.json(
        { erro: "ID do quarto inválido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Buscar os dados do quarto
    const { data: quarto, error: erroQuarto } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", idNumerico)
      .maybeSingle();

    if (erroQuarto) {
      console.error("Erro ao buscar quarto:", erroQuarto);

      return NextResponse.json(
        { erro: "Erro ao buscar quarto" },
        { status: 500 }
      );
    }

    if (!quarto) {
      return NextResponse.json(
        { erro: "Quarto não encontrado" },
        { status: 404 }
      );
    }

    // Buscar as reservas relacionadas ao quarto
    const { data: reservas, error: erroReservas } = await supabase
      .from("reservas")
      .select(`
        id,
        data_entrada,
        data_saida,
        status,
        valor_diaria,
        hospedes (
          nome
        )
      `)
      .eq("id_quarto", idNumerico)
      .neq("status", "Cancelada")
      .order("data_entrada", { ascending: false });

    if (erroReservas) {
      console.error("Erro ao buscar histórico do quarto:", erroReservas);

      return NextResponse.json(
        { erro: "Erro ao buscar histórico de ocupação" },
        { status: 500 }
      );
    }

    // Formatar data para DD/MM/AAAA
    function formatarData(valor) {
      if (!valor) return "Não informada";

      const [ano, mes, dia] = valor.split("-");

      return `${dia}/${mes}/${ano}`;
    }

    // Organizar os dados para a tabela da página
    const historico = (reservas || []).map((reserva) => ({
      periodo: `${formatarData(reserva.data_entrada)} - ${formatarData(reserva.data_saida)}`,
      hospede: reserva.hospedes?.nome || "Não informado",
      status: reserva.status,
      tarifa: Number(reserva.valor_diaria).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    }));

    return NextResponse.json({
      ...quarto,
      historico,
    });

  } catch (error) {
    console.error("Erro inesperado ao buscar quarto:", error);

    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um quarto
export async function PUT(request, { params }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      return NextResponse.json(
        { erro: "ID do quarto inválido" },
        { status: 400 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { erro: "Dados enviados em formato inválido" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { erro: "Dados do quarto inválidos" },
        { status: 400 }
      );
    }

    const {
    numero,
    tipo,
    andar,
    bloco,
    capacidade,
    diaria,
    status,
    comodidades,
    } = body;

    // Validar campos obrigatórios
    if (
      numero === undefined ||
      tipo === undefined ||
      capacidade === undefined ||
      diaria === undefined ||
      status === undefined
    ) {
      return NextResponse.json(
        { erro: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      );
    }

    // Validar número do quarto
    const numeroNumerico = Number(numero);

    if (
      !Number.isInteger(numeroNumerico) ||
      numeroNumerico <= 0
    ) {
      return NextResponse.json(
        { erro: "O número do quarto deve ser um inteiro positivo" },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!TIPOS_PERMITIDOS.includes(tipo)) {
      return NextResponse.json(
        { erro: "Tipo de quarto inválido" },
        { status: 400 }
      );
    }

    // Validar status
    if (!STATUS_PERMITIDOS.includes(status)) {
      return NextResponse.json(
        { erro: "Status do quarto inválido" },
        { status: 400 }
      );
    }

    // Validar capacidade
    const capacidadeNumerica = Number(capacidade);

    if (
      !Number.isInteger(capacidadeNumerica) ||
      capacidadeNumerica <= 0
    ) {
      return NextResponse.json(
        { erro: "A capacidade deve ser um número inteiro positivo" },
        { status: 400 }
      );
    }

    // Validar diária
    const diariaNumerica = Number(diaria);

    if (
      diaria === null ||
      diaria === "" ||
      !Number.isFinite(diariaNumerica) ||
      diariaNumerica <= 0
    ) {
      return NextResponse.json(
        { erro: "A diária deve ser um valor maior que zero" },
        { status: 400 }
      );
    }

    // Validar comodidades
    if (
      comodidades !== undefined &&
      !Array.isArray(comodidades)
    ) {
      return NextResponse.json(
        { erro: "As comodidades devem ser enviadas em formato de lista" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar se o quarto existe
    const { data: quartoExistente, error: buscaError } = await supabase
      .from("quartos")
      .select("id")
      .eq("id", idNumerico)
      .maybeSingle();

    if (buscaError) {
      console.error("Erro ao verificar quarto:", buscaError);

      return NextResponse.json(
        { erro: "Erro ao verificar quarto" },
        { status: 500 }
      );
    }

    if (!quartoExistente) {
      return NextResponse.json(
        { erro: "Quarto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se outro quarto já utiliza esse número
    const { data: numeroExistente, error: numeroError } = await supabase
      .from("quartos")
      .select("id")
      .eq("numero", numeroNumerico)
      .neq("id", idNumerico)
      .maybeSingle();

    if (numeroError) {
      console.error("Erro ao verificar número:", numeroError);

      return NextResponse.json(
        { erro: "Erro ao verificar número do quarto" },
        { status: 500 }
      );
    }

    if (numeroExistente) {
      return NextResponse.json(
        { erro: "Já existe outro quarto com esse número" },
        { status: 409 }
      );
    }

    const dadosAtualizados = {
  numero: numeroNumerico,
  tipo,
  andar: andar ?? "",
  bloco: bloco ?? "",
  capacidade: capacidadeNumerica,
  diaria: diariaNumerica,
  status,
  comodidades: comodidades ?? [],
};

    const { data, error } = await supabase
      .from("quartos")
      .update(dadosAtualizados)
      .eq("id", idNumerico)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar quarto:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { erro: "Já existe um quarto com esse número" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { erro: "Erro ao atualizar quarto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mensagem: "Quarto atualizado com sucesso",
      quarto: data,
    });
  } catch (error) {
    console.error("Erro inesperado ao atualizar quarto:", error);

    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um quarto
export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { erro: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      return NextResponse.json(
        { erro: "ID do quarto inválido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Buscar quarto antes de excluir
    const { data: quarto, error: buscaError } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", idNumerico)
      .maybeSingle();

    if (buscaError) {
      console.error("Erro ao buscar quarto:", buscaError);

      return NextResponse.json(
        { erro: "Erro ao buscar quarto" },
        { status: 500 }
      );
    }

    if (!quarto) {
      return NextResponse.json(
        { erro: "Quarto não encontrado" },
        { status: 404 }
      );
    }

    // Impedir exclusão de quartos ocupados ou reservados
    if (["Ocupado", "Reservado"].includes(quarto.status)) {
      return NextResponse.json(
        {
          erro: "Não é possível excluir um quarto ocupado ou reservado",
        },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabase
      .from("quartos")
      .delete()
      .eq("id", idNumerico);

   if (deleteError) {
  console.error("Erro ao excluir quarto:", deleteError);

  if (deleteError.code === "23503") {
    return NextResponse.json(
      {
        erro: "Não é possível excluir este quarto porque existem registros vinculados a ele.",
      },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { erro: "Erro ao excluir quarto" },
    { status: 500 }
  );
}

    return NextResponse.json({
      mensagem: "Quarto excluído com sucesso",
      quarto,
    });
  } catch (error) {
    console.error("Erro inesperado ao excluir quarto:", error);

    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
