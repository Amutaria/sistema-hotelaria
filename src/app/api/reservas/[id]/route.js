
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";

// Consultar uma reserva pelo ID
export async function GET(request, { params }) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data: reserva, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar reserva:", error);
      return NextResponse.json(
        { erro: "Não foi possível buscar a reserva" },
        { status: 500 }
      );
    }

    if (!reserva) {
      return NextResponse.json(
        { erro: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(reserva);
  } catch (erro) {
    console.error("Erro na consulta da reserva:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar a reserva" },
      { status: 500 }
    );
  }
}

// Editar uma reserva
export async function PUT(request, { params }) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const dados = await request.json();
    const supabase = await createClient();

    // Buscar a reserva atual
    const { data: reserva, error: erroReserva } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (erroReserva) {
      console.error("Erro ao buscar reserva:", erroReserva);

      return NextResponse.json(
        { erro: "Não foi possível buscar a reserva" },
        { status: 500 }
      );
    }

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

    // Manter os dados atuais quando não forem enviados
    const dataEntrada = dados.dataEntrada ?? reserva.data_entrada;
    const dataSaida = dados.dataSaida ?? reserva.data_saida;
    const quartoId = Number(dados.quartoId ?? reserva.id_quarto);
    const quantidadePessoas = Number(
      dados.quantidadePessoas ?? reserva.quantidade_pessoas
    );

    // Validar as datas
    function dataValida(data) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

      const dataObj = new Date(`${data}T00:00:00Z`);

      return (
        !Number.isNaN(dataObj.getTime()) &&
        dataObj.toISOString().slice(0, 10) === data
      );
    }

    if (
      !dataValida(dataEntrada) ||
      !dataValida(dataSaida) ||
      dataSaida <= dataEntrada
    ) {
      return NextResponse.json(
        { erro: "Informe um período válido para a reserva" },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quartoId) ||
      quartoId <= 0 ||
      !Number.isInteger(quantidadePessoas) ||
      quantidadePessoas <= 0
    ) {
      return NextResponse.json(
        { erro: "Quarto ou quantidade de pessoas inválidos" },
        { status: 400 }
      );
    }

    // Buscar o quarto no Supabase
    const { data: quarto, error: erroQuarto } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", quartoId)
      .maybeSingle();

    if (erroQuarto) {
      console.error("Erro ao buscar quarto:", erroQuarto);

      return NextResponse.json(
        { erro: "Não foi possível consultar o quarto" },
        { status: 500 }
      );
    }

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
        { erro: "Quarto indisponível para esse período" },
        { status: 409 }
      );
    }

    if (quantidadePessoas > Number(quarto.capacidade)) {
      return NextResponse.json(
        { erro: "A quantidade de pessoas excede a capacidade do quarto" },
        { status: 400 }
      );
    }

    // Verificar conflito com outras reservas
    const { data: conflitos, error: erroConflito } = await supabase
      .from("reservas")
      .select("id")
      .eq("id_quarto", quartoId)
      .neq("status", "Cancelada")
      .neq("id", reserva.id)
      .lt("data_entrada", dataSaida)
      .gt("data_saida", dataEntrada);

    if (erroConflito) {
      console.error("Erro ao verificar disponibilidade:", erroConflito);

      return NextResponse.json(
        { erro: "Não foi possível verificar a disponibilidade" },
        { status: 500 }
      );
    }

    if (conflitos && conflitos.length > 0) {
      return NextResponse.json(
        { erro: "Já existe outra reserva para esse quarto nesse período" },
        { status: 409 }
      );
    }

    // Recalcular os valores
    const entrada = new Date(`${dataEntrada}T00:00:00Z`);
    const saida = new Date(`${dataSaida}T00:00:00Z`);

    const diarias = Math.round(
      (saida.getTime() - entrada.getTime()) / 86400000
    );

    const valorDiaria = Number(quarto.diaria);
    const valorHospedagem = diarias * valorDiaria;
    const taxas = Number(reserva.taxas ?? 45);
    const valorTotal = valorHospedagem + taxas;

    // Atualizar a reserva no Supabase
    const dadosAtualizados = {
      id_quarto: quartoId,
      data_entrada: dataEntrada,
      data_saida: dataSaida,
      quantidade_pessoas: quantidadePessoas,
      diarias,
      valor_diaria: valorDiaria,
      valor_hospedagem: valorHospedagem,
      taxas,
      valor_total: valorTotal,
      pagamento: dados.pagamento ?? reserva.pagamento,
      observacoes: dados.observacoes ?? reserva.observacoes,
    };

    const { data: reservaAtualizada, error: erroAtualizacao } =
      await supabase
        .from("reservas")
        .update(dadosAtualizados)
        .eq("id", reserva.id)
        .select("*")
        .single();

    if (erroAtualizacao) {
      console.error("Erro ao atualizar reserva:", erroAtualizacao);

      return NextResponse.json(
        { erro: "Não foi possível salvar as alterações da reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mensagem: "Reserva atualizada com sucesso",
      reserva: reservaAtualizada,
    });
  } catch (erro) {
    console.error("Erro na API de edição:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao editar a reserva" },
      { status: 500 }
    );
  }
}

// Cancelar uma reserva
export async function DELETE(request, { params }) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data: reserva, error: erroReserva } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (erroReserva) {
      console.error("Erro ao buscar reserva:", erroReserva);

      return NextResponse.json(
        { erro: "Não foi possível buscar a reserva" },
        { status: 500 }
      );
    }

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

    const { data: reservaAtualizada, error: erroAtualizacao } =
      await supabase
        .from("reservas")
        .update({ status: "Cancelada" })
        .eq("id", reserva.id)
        .select("*")
        .single();

    if (erroAtualizacao) {
      console.error("Erro ao cancelar reserva:", erroAtualizacao);

      return NextResponse.json(
        { erro: "Não foi possível cancelar a reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mensagem: "Reserva cancelada com sucesso",
      reserva: reservaAtualizada,
    });
  } catch (erro) {
    console.error("Erro na API de cancelamento:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao cancelar a reserva" },
      { status: 500 }
    );
  }
}
