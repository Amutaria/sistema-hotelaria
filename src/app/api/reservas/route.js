
import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";
import { getAuthenticatedUser } from "../../lib/supabase/auth";

// GET: listar reservas do Supabase
export async function GET(request) {
  try {
    const usuario = await getAuthenticatedUser();

    console.log("USUÁRIO AUTENTICADO:", usuario?.id ?? null);
    console.log("EMAIL:", usuario?.email ?? null);

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    console.log("USUÁRIO NO CLIENTE:", user);
    console.log("ERRO DE AUTH:", authError);

    // Buscar hóspedes cadastrados para a tela de nova reserva
    if (request.nextUrl.searchParams.get("hospedes") === "true") {
      const { data: hospedes, error } = await supabase
        .from("hospedes")
        .select("id, nome, cpf, email, telefone")
        .order("nome", { ascending: true });

      if (error) {
        console.error("Erro ao buscar hóspedes:", error);

        return NextResponse.json(
          { erro: "Não foi possível carregar os hóspedes" },
          { status: 500 }
        );
      }

      return NextResponse.json(hospedes ?? []);
    }

    const { data, error } = await supabase
      .from("reservas")
      .select(`
        *,
        hospede:hospedes(id, nome, cpf, email, telefone),
        quarto:quartos(id, numero, tipo, diaria)
      `)
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao buscar reservas:", error);

      return NextResponse.json(
        { erro: "Não foi possível buscar as reservas" },
        { status: 500 }
      );
    }

    const reservasFormatadas = data.map((reserva) => ({
      id: reserva.id,
      codigo: reserva.codigo,
      hospede: {
        nome: reserva.hospede?.nome ?? "",
        cpf: reserva.hospede?.cpf ?? "",
        email: reserva.hospede?.email ?? "",
        telefone: reserva.hospede?.telefone ?? "",
      },
      quartoId: reserva.id_quarto,
      quartoNumero: reserva.quarto?.numero,
      quartoTipo: reserva.quarto?.tipo,
      quarto: reserva.quarto,
      dataEntrada: reserva.data_entrada,
      dataSaida: reserva.data_saida,
      quantidadePessoas: reserva.quantidade_pessoas,
      diarias: reserva.diarias,
      observacoes: reserva.observacoes ?? "",
      pagamento: reserva.pagamento,
      valores: {
        diaria: Number(reserva.valor_diaria),
        hospedagem: Number(reserva.valor_hospedagem),
        taxas: Number(reserva.taxas),
        total: Number(reserva.valor_total),
      },
      status: reserva.status,
      criadoEm: reserva.criado_em,
    }));

    return NextResponse.json(reservasFormatadas);
  } catch (erro) {
    console.error("Erro na API de reservas:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao buscar reservas" },
      { status: 500 }
    );
  }
}

// POST: cadastrar uma reserva no Supabase
export async function POST(request) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { erro: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const dados = await request.json();

    const {
      hospede,
      quartoId,
      dataEntrada,
      dataSaida,
      quantidadePessoas,
      observacoes,
      pagamento,
    } = dados;

    // Validar campos obrigatórios
    if (
      !hospede?.nome ||
      !hospede?.cpf ||
      !hospede?.email ||
      !quartoId ||
      !dataEntrada ||
      !dataSaida ||
      !quantidadePessoas
    ) {
      return NextResponse.json(
        { erro: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      );
    }

    // Validar datas
    const entrada = new Date(`${dataEntrada}T00:00:00Z`);
    const saida = new Date(`${dataSaida}T00:00:00Z`);

    if (
      Number.isNaN(entrada.getTime()) ||
      Number.isNaN(saida.getTime()) ||
      saida <= entrada
    ) {
      return NextResponse.json(
        { erro: "A data de saída deve ser posterior à entrada" },
        { status: 400 }
      );
    }

    const pessoas = Number(quantidadePessoas);
    const idQuarto = Number(quartoId);

    if (
      !Number.isInteger(pessoas) ||
      pessoas <= 0 ||
      !Number.isInteger(idQuarto) ||
      idQuarto <= 0
    ) {
      return NextResponse.json(
        { erro: "Quarto ou quantidade de pessoas inválidos" },
        { status: 400 }
      );
    }

   const supabase = await createClient();

   const {
    data: { session },
    error: sessionError,
   } = await supabase.auth.getSession();

   const { data: { user }, error: authError } =
    await supabase.auth.getUser();

   console.log("DEBUG POST - USUÁRIO:", user?.id);
   console.log("DEBUG POST - ROLE:", user?.role);
   console.log("DEBUG POST - ERRO:", authError);

   console.log("DEBUG SESSÃO - USUÁRIO:", session?.user?.id);
   console.log(
    "DEBUG SESSÃO - TOKEN:",
    session?.access_token ? "PRESENTE" : "AUSENTE"
   );
   console.log("DEBUG SESSÃO - ERRO:", sessionError);
    // Buscar hóspede já cadastrado no Supabase
    const cpfLimpo = String(hospede.cpf || "").replace(/\D/g, "");

    const cpfFormatado = cpfLimpo.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4"
    );

    let consultaHospede = supabase
      .from("hospedes")
      .select("id, nome, cpf, email, telefone");

    // Primeiro tenta localizar pelo ID do hóspede
    if (hospede.id) {
      consultaHospede = consultaHospede.eq("id", hospede.id);
    } else {
      // Caso não tenha ID, tenta pelo CPF com e sem formatação
      consultaHospede = consultaHospede.in("cpf", [
        cpfLimpo,
        cpfFormatado,
        hospede.cpf,
      ]);
    }

    const { data: hospedeEncontrado, error: erroHospede } =
      await consultaHospede.maybeSingle();

    if (erroHospede) {
      console.error("Erro ao buscar hóspede:", erroHospede);

      return NextResponse.json(
        { erro: "Não foi possível localizar o hóspede" },
        { status: 500 }
      );
    }

    if (!hospedeEncontrado) {
      return NextResponse.json(
        {
          erro: "Hóspede não encontrado no Supabase. Verifique se ele já foi cadastrado.",
        },
        { status: 404 }
      );
    }

    // Buscar quarto no Supabase
    const { data: quarto, error: erroQuarto } = await supabase
      .from("quartos")
      .select("*")
      .eq("id", idQuarto)
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
        { erro: "Quarto não encontrado no Supabase" },
        { status: 404 }
      );
    }

    // Verificar situação do quarto
    if (
      quarto.status === "Ocupado" ||
      quarto.status === "Manutenção"
    ) {
      return NextResponse.json(
        { erro: "Este quarto não está disponível para reserva" },
        { status: 409 }
      );
    }

    // Verificar capacidade
    if (pessoas > Number(quarto.capacidade)) {
      return NextResponse.json(
        {
          erro: "A quantidade de hóspedes excede a capacidade do quarto",
        },
        { status: 400 }
      );
    }

    // Verificar conflito de datas no Supabase
    const { data: conflito, error: erroConflito } = await supabase
      .from("reservas")
      .select("id")
      .eq("id_quarto", idQuarto)
      .neq("status", "Cancelada")
      .lt("data_entrada", dataSaida)
      .gt("data_saida", dataEntrada)
      .limit(1);

    if (erroConflito) {
      console.error("Erro ao verificar disponibilidade:", erroConflito);

      return NextResponse.json(
        { erro: "Não foi possível verificar a disponibilidade do quarto" },
        { status: 500 }
      );
    }

    if (conflito.length > 0) {
      return NextResponse.json(
        { erro: "Este quarto já possui uma reserva nesse período" },
        { status: 409 }
      );
    }

    // Calcular valores
    const diarias = Math.round(
      (saida.getTime() - entrada.getTime()) / 86400000
    );

    const valorDiaria = Number(quarto.diaria);
    const valorHospedagem = diarias * valorDiaria;
    const taxas = 45;
    const valorTotal = valorHospedagem + taxas;

    // Inserir reserva no Supabase
    const { data: novaReserva, error: erroReserva } = await supabase
      .from("reservas")
      .insert({
        id_hospede: hospedeEncontrado.id,
        id_quarto: quarto.id,
        data_entrada: dataEntrada,
        data_saida: dataSaida,
        quantidade_pessoas: pessoas,
        diarias,
        valor_diaria: valorDiaria,
        valor_hospedagem: valorHospedagem,
        taxas,
        valor_total: valorTotal,
        pagamento: pagamento || "",
        observacoes: observacoes || "",
        status: "Confirmada",
      })
      .select("*")
      .single();

    if (erroReserva) {
      console.error("Erro ao cadastrar reserva:", erroReserva);

      if (erroReserva.code === "23P01") {
        return NextResponse.json(
          { erro: "Este quarto já possui uma reserva nesse período" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { erro: "Não foi possível cadastrar a reserva no Supabase" },
        { status: 500 }
      );
    }

    // Manter o formato esperado pela tela de sucesso
    return NextResponse.json(
      {
        id: novaReserva.id,
        codigo: novaReserva.codigo,
        hospede: {
          nome: hospedeEncontrado.nome,
          cpf: hospedeEncontrado.cpf,
          email: hospedeEncontrado.email,
          telefone: hospedeEncontrado.telefone ?? "",
        },
        quartoId: quarto.id,
        quartoNumero: quarto.numero,
        quartoTipo: quarto.tipo,
        quarto,
        dataEntrada: novaReserva.data_entrada,
        dataSaida: novaReserva.data_saida,
        quantidadePessoas: novaReserva.quantidade_pessoas,
        diarias: novaReserva.diarias,
        observacoes: novaReserva.observacoes ?? "",
        pagamento: novaReserva.pagamento,
        valores: {
          diaria: Number(novaReserva.valor_diaria),
          hospedagem: Number(novaReserva.valor_hospedagem),
          taxas: Number(novaReserva.taxas),
          total: Number(novaReserva.valor_total),
        },
        status: novaReserva.status,
        criadoEm: novaReserva.criado_em,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro na API de reservas:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao processar a reserva" },
      { status: 500 }
    );
  }
}
