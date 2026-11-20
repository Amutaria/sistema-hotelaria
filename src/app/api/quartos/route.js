
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/supabase/auth";
import { createClient } from "@/app/lib/supabase/server";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quartos")
    .select("*")
    .order("numero", { ascending: true });

  if (error) {
    console.error("Erro ao buscar quartos:", error);

    return NextResponse.json(
      { erro: "Erro ao buscar quartos no banco de dados" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

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

  // Validar campos obrigatórios
  if (
    numero == null ||
    numero === "" ||
    !tipo ||
    capacidade == null ||
    capacidade === "" ||
    diaria == null ||
    diaria === ""
  ) {
    return NextResponse.json(
      { erro: "Preencha todos os campos obrigatórios" },
      { status: 400 }
    );
  }

  const tiposPermitidos = ["Standard", "Luxo", "Suíte", "Executivo"];

  const statusPermitidos = [
    "Livre",
    "Ocupado",
    "Reservado",
    "Manutenção",
  ];

  // Validar tipo
  if (!tiposPermitidos.includes(tipo)) {
    return NextResponse.json(
      { erro: "Tipo de quarto inválido" },
      { status: 400 }
    );
  }

  // Validar status
  if (status && !statusPermitidos.includes(status)) {
    return NextResponse.json(
      { erro: "Status de quarto inválido" },
      { status: 400 }
    );
  }

  // Validar número
  const numeroNumerico = Number(numero);

  if (
    !Number.isFinite(numeroNumerico) ||
    !Number.isInteger(numeroNumerico) ||
    numeroNumerico <= 0
  ) {
    return NextResponse.json(
      {
        erro: "Número de quarto inválido. Informe um número inteiro maior que zero.",
      },
      { status: 400 }
    );
  }

  // Validar capacidade
  const capacidadeNumerica = Number(capacidade);

  if (
    !Number.isFinite(capacidadeNumerica) ||
    !Number.isInteger(capacidadeNumerica) ||
    capacidadeNumerica <= 0
  ) {
    return NextResponse.json(
      { erro: "A capacidade deve ser um número inteiro maior que zero" },
      { status: 400 }
    );
  }

  // Validar diária
  const diariaNumerica = Number(diaria);

  if (
    !Number.isFinite(diariaNumerica) ||
    diariaNumerica <= 0
  ) {
    return NextResponse.json(
      { erro: "A diária deve ser um número maior que zero" },
      { status: 400 }
    );
  }

  // Verificar se o número já existe no banco
  const { data: quartoExistente, error: erroConsulta } = await supabase
    .from("quartos")
    .select("id")
    .eq("numero", numeroNumerico)
    .maybeSingle();

  if (erroConsulta) {
    console.error("Erro ao verificar quarto:", erroConsulta);

    return NextResponse.json(
      { erro: "Erro ao verificar quarto no banco de dados" },
      { status: 500 }
    );
  }

  if (quartoExistente) {
    return NextResponse.json(
      { erro: "Já existe um quarto com esse número" },
      { status: 409 }
    );
  }

  // Inserir quarto no Supabase
  const { data, error } = await supabase
    .from("quartos")
    .insert({
      numero: numeroNumerico,
      tipo,
      andar: andar || "",
      bloco: bloco || "",
      capacidade: capacidadeNumerica,
      diaria: diariaNumerica,
      status: status || "Livre",
      comodidades: Array.isArray(comodidades) ? comodidades : [],
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao cadastrar quarto:", error);

    if (error.code === "23505") {
      return NextResponse.json(
        { erro: "Já existe um quarto com esse número" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { erro: "Erro ao cadastrar quarto no banco de dados" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
