
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";

export async function POST(request, { params }) {
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

    // Buscar reserva no Supabase
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
        { erro: "Essa reserva não pode realizar check-in" },
        { status: 409 }
      );
    }

    // Buscar quarto no Supabase
    const { data: quarto, error: erroQuarto } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", reserva.id_quarto)
      .maybeSingle();

    if (erroQuarto) {
      console.error("Erro ao buscar quarto:", erroQuarto);

      return NextResponse.json(
        { erro: "Não foi possível buscar o quarto" },
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
      quarto.status === "Manutenção" ||
      quarto.status === "Ocupado"
    ) {
      return NextResponse.json(
        { erro: "Quarto indisponível para check-in" },
        { status: 409 }
      );
    }

    // Atualizar quarto para Ocupado
    const { error: erroAtualizarQuarto } = await supabase
      .from("quartos")
      .update({ status: "Ocupado" })
      .eq("id", quarto.id);

    if (erroAtualizarQuarto) {
      console.error("Erro ao atualizar quarto:", erroAtualizarQuarto);

      return NextResponse.json(
        { erro: "Não foi possível atualizar o status do quarto" },
        { status: 500 }
      );
    }

    // Atualizar reserva para Em hospedagem
    const { data: reservaAtualizada, error: erroAtualizarReserva } =
      await supabase
        .from("reservas")
        .update({
          status: "Em hospedagem",
          checkin_em: new Date().toISOString()
        })
        .eq("id", reserva.id)
        .select("*")
        .single();

    if (erroAtualizarReserva) {
      console.error("Erro ao atualizar reserva:", erroAtualizarReserva);

      // Restaurar o status anterior do quarto
      await supabase
        .from("quartos")
        .update({ status: quarto.status })
        .eq("id", quarto.id);

      return NextResponse.json(
        { erro: "Não foi possível atualizar a reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mensagem: "Check-in realizado com sucesso",
      reserva: reservaAtualizada,
    });

  } catch (erro) {
    console.error("Erro na API de check-in:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao realizar check-in" },
      { status: 500 }
    );
  }
}
