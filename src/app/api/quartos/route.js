import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import quartos from "../../../../data/quartos";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json(quartos);
}

export async function POST(request) {

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
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
  } = await request.json();

 const tiposPermitidos = ["Standard", "Luxo", "Suíte"];

 const statusPermitidos = [
  "Livre",
  "Ocupado",
  "Reservado",
  "Manutenção",
];

if (status && !statusPermitidos.includes(status)) {
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

  const quartoExistente = quartos.find(
    (q) => q.numero === Number(numero)
  );

  if (quartoExistente) {
    return NextResponse.json(
      { erro: "Já existe um quarto com esse número" },
      { status: 409 }
    );
  }

const novoQuarto = {
  id: quartos.length + 1,
  numero,
  tipo,
  andar,
  bloco,
  capacidade,
  diaria,
  status,
  comodidades: Array.isArray(comodidades) ? comodidades : [],
};

  quartos.push(novoQuarto);

  return NextResponse.json(novoQuarto, { status: 201 });
}