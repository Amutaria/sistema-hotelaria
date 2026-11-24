import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";

export async function POST(request, { params }) {
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
    const { id } = await params;

    // Buscar reserva no Supabase
    const { data: reserva, error: erroReserva } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (erroReserva || !reserva) {
      return NextResponse.json(
        { erro: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o check-in foi realizado
    if (reserva.status !== "Em hospedagem") {
      return NextResponse.json(
        {
          erro: "É necessário realizar o check-in antes do check-out"
        },
        { status: 409 }
      );
    }

    // Buscar quarto relacionado à reserva
    const { data: quarto, error: erroQuarto } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", reserva.id_quarto)
      .maybeSingle();

    if (erroQuarto) {
      return NextResponse.json(
        { erro: "Não foi possível consultar o quarto" },
        { status: 500 }
      );
    }

    // Verificar se existe outra reserva confirmada para o quarto
    const { data: reservasFuturas, error: erroFuturas } = await supabase
      .from("reservas")
      .select("id")
      .eq("id_quarto", reserva.id_quarto)
      .eq("status", "Confirmada")
      .neq("id", reserva.id);

    if (erroFuturas) {
      return NextResponse.json(
        { erro: "Não foi possível verificar as reservas do quarto" },
        { status: 500 }
      );
    }

    // Atualizar reserva para Finalizada
    const { data: reservaAtualizada, error: erroAtualizacao } =
      await supabase
        .from("reservas")
        .update({
          status: "Finalizada",
          checkout_em: new Date().toISOString()
        })
        .eq("id", Number(id))
        .select()
        .single();

    if (erroAtualizacao) {
      return NextResponse.json(
        { erro: "Não foi possível finalizar a reserva" },
        { status: 500 }
      );
    }

    // Atualizar situação do quarto
    if (quarto) {
      const novoStatus = reservasFuturas.length > 0
        ? "Reservado"
        : "Livre";

      const { error: erroAtualizacaoQuarto } = await supabase
        .from("quartos")
        .update({ status: novoStatus })
        .eq("id", reserva.id_quarto);

      if (erroAtualizacaoQuarto) {
        // Reverter reserva caso não consiga atualizar o quarto
        await supabase
          .from("reservas")
          .update({
            status: "Em hospedagem",
            checkout_em: null
          })
          .eq("id", Number(id));

        return NextResponse.json(
          { erro: "Não foi possível atualizar a situação do quarto" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      mensagem: "Check-out realizado com sucesso",
      reserva: reservaAtualizada
    });

  } catch (erro) {
    console.error("Erro no check-out:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao realizar check-out" },
      { status: 500 }
    );
  }
}
