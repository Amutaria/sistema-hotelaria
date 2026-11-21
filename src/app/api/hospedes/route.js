import { getAuthenticatedSupabase, jsonError, normalizeGuestPayload, normalizeCompanions } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const db = await getAuthenticatedSupabase(request);
  if (db.error) return jsonError(db.error, db.status);
  const { response, data } = await db.request("hospedes?select=*,acompanhantes(*)&order=created_at.desc");
  if (!response.ok) return jsonError(data?.message || "Não foi possível listar os hóspedes.", response.status);
  return Response.json(data || []);
}

export async function POST(request) {
  const db = await getAuthenticatedSupabase(request);
  if (db.error) return jsonError(db.error, db.status);

  let input;
  try { input = await request.json(); } catch { return jsonError("Corpo da requisição inválido."); }
  const guest = normalizeGuestPayload(input);
  if (!guest.nome || !guest.cpf || !guest.email || !guest.telefone) {
    return jsonError("Preencha nome, CPF, e-mail e telefone.");
  }
  if (guest.estado && guest.estado.length !== 2) return jsonError("O estado deve conter a sigla de 2 letras.");

  const inserted = await db.request("hospedes?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(guest),
  });
  if (!inserted.response.ok) {
    const message = inserted.data?.code === "23505"
      ? "Já existe um hóspede cadastrado com este CPF."
      : inserted.data?.message || "Não foi possível cadastrar o hóspede.";
    return jsonError(message, inserted.response.status);
  }
  const created = inserted.data?.[0];
  if (!created) return jsonError("O banco não retornou o hóspede cadastrado.", 500);

  const companions = normalizeCompanions(input.acompanhantes).map((item) => ({ ...item, hospede_id: created.id }));
  if (companions.length) {
    const companionResult = await db.request("acompanhantes", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(companions),
    });
    if (!companionResult.response.ok) {
      await db.request(`hospedes?id=eq.${created.id}`, { method: "DELETE" });
      return jsonError(companionResult.data?.message || "Falha ao salvar acompanhantes. O cadastro do hóspede foi revertido.", companionResult.response.status);
    }
  }

  const complete = await db.request(`hospedes?id=eq.${created.id}&select=*,acompanhantes(*)`);
  return Response.json(complete.data?.[0] || created, { status: 201 });
}
