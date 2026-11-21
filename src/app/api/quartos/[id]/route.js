import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import quartos from "../../../../../data/quartos";

export async function GET(request, { params }) {

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const quarto = quartos.find((q) => q.id === Number(id));

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(quarto);
}

export async function PUT(request, { params }) {

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const quarto = quartos.find((q) => q.id === Number(id));

  if (!quarto) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  const dados = await request.json();

  const {
    numero,
    tipo,
    andar,
    bloco,
    capacidade,
    diaria,
    status,
    comodidades,
  } = dados;

  if (!numero || !tipo || !capacidade || !diaria || !status) {
    return NextResponse.json(
      {
        erro: "Número, tipo, capacidade, diária e status são obrigatórios",
      },
      { status: 400 }
    );
  }

  const tiposPermitidos = ["Standard", "Luxo", "Suíte"];

  const statusPermitidos = [
    "Livre",
    "Ocupado",
    "Reservado",
    "Manutenção",
  ];

  if (!statusPermitidos.includes(status)) {
    return NextResponse.json(
      { erro: "Status de quarto inválido" },
      { status: 400 }
    );
  }

  if (!tiposPermitidos.includes(tipo)) {
    return NextResponse.json(
      { erro: "Tipo de quarto inválido" },
      { status: 400 }
    );
  }

  if (diaria <= 0) {
    return NextResponse.json(
      { erro: "A diária deve ser maior que zero" },
      { status: 400 }
    );
  }

  const quartoComMesmoNumero = quartos.find(
    (q) => q.numero === Number(numero) && q.id !== Number(id)
  );

  if (quartoComMesmoNumero) {
    return NextResponse.json(
      { erro: "Já existe outro quarto com esse número" },
      { status: 409 }
    );
  }

  quarto.numero = Number(numero);
  quarto.tipo = tipo;
  quarto.andar = andar || "";
  quarto.bloco = bloco || "";
  quarto.capacidade = Number(capacidade);
  quarto.diaria = Number(diaria);
  quarto.status = status;
  quarto.comodidades = Array.isArray(comodidades) ? comodidades : [];

  return NextResponse.json(quarto);
}

export async function DELETE(request, { params }) {

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const indice = quartos.findIndex(
    (q) => q.id === Number(id)
  );

  if (indice === -1) {
    return NextResponse.json(
      { erro: "Quarto não encontrado" },
      { status: 404 }
    );
  }

  const quarto = quartos[indice];

  if (quarto.status === "Ocupado" || quarto.status === "Reservado") {
    return NextResponse.json(
      { erro: "Não é possível excluir um quarto ocupado ou reservado" },
      { status: 409 }
    );
  }

  const quartoExcluido = quartos.splice(indice, 1)[0];

  return NextResponse.json({
    mensagem: "Quarto excluído com sucesso",
    quarto: quartoExcluido,
  });
}