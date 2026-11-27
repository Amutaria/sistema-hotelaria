import { createClient } from "@/app/lib/supabase/server";

export async function getAuthenticatedSupabase() {
  const supabase = await createClient();

  // Valida a sessão com o servidor de Auth do Supabase.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Não autenticado.", status: 401 };
  }

  // O token é usado apenas depois da validação do usuário acima,
  // para encaminhar as operações REST com a identidade autenticada.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (sessionError || !token) {
    return { error: "Sessão inválida ou expirada.", status: 401 };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { error: "Supabase não configurado no servidor.", status: 500 };
  }

  const baseUrl = url.replace(/\/$/, "");

  return {
    user,
    async request(path, options = {}) {
      const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
        ...options,
        headers: {
          apikey: key,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        cache: "no-store",
      });

      const responseText = await response.text();
      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = responseText;
      }

      return { response, data };
    },
  };
}

export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export function normalizeGuestPayload(input = {}) {
  const fields = [
    "nome",
    "cpf",
    "nascimento",
    "genero",
    "nacionalidade",
    "email",
    "telefone",
    "documento",
    "cep",
    "rua",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
    "observacoes",
  ];

  const guest = {};

  for (const field of fields) {
    const value = input[field];
    guest[field] = value === "" || value === undefined ? null : value;
  }

  guest.nome = String(input.nome || "").trim();
  guest.cpf = String(input.cpf || "").trim();
  guest.email = String(input.email || "").trim();
  guest.telefone = String(input.telefone || "").trim();
  guest.estado = guest.estado
    ? String(guest.estado).trim().toUpperCase()
    : null;

  return guest;
}

export function isValidCpf(value) {
  const cpf = String(value || "").replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base, factor) => {
    let total = 0;
    for (const digit of base) total += Number(digit) * factor--;
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const first = calculateDigit(cpf.slice(0, 9), 10);
  const second = calculateDigit(cpf.slice(0, 10), 11);
  return first === Number(cpf[9]) && second === Number(cpf[10]);
}

export function normalizeCompanions(input) {
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (item) =>
        item &&
        (String(item.nome || "").trim() || String(item.cpf || "").trim())
    )
    .map((item) => ({
      nome: String(item.nome || "").trim(),
      cpf: String(item.cpf || "").trim() || null,
    }));
}
