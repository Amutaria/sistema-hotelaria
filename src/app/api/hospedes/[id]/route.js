import { getAuthenticatedSupabase, jsonError, normalizeGuestPayload, normalizeCompanions } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function getId(context) {
  const params = await context.params;
  const id = Number(params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(request, context) {
  const db = await getAuthenticatedSupabase(request);
  if (db.error) return jsonError(db.error, db.status);
  const id = await getId(context);
  if (!id) return jsonError("ID de hóspede inválido.", 400);
  const { response, data } = await db.request(`hospedes?id=eq.${id}&select=*,acompanhantes(*)`);
  if (!response.ok) return jsonError(data?.message || "Não foi possível consultar o hóspede.", response.status);
  if (!data?.length) return jsonError("Hóspede não encontrado.", 404);
  return Response.json(data[0]);
}

export async function PUT(request, context) {
  const db = await getAuthenticatedSupabase(request);
  if (db.error) return jsonError(db.error, db.status);
  const id = await getId(context);
  if (!id) return jsonError("ID de hóspede inválido.", 400);

  let input;
  try { input = await request.json(); } catch { return jsonError("Corpo da requisição inválido."); }
  const guest = normalizeGuestPayload(input);
  if (!guest.nome || !guest.cpf || !guest.email || !guest.telefone) {
    return jsonError("Preencha nome, CPF, e-mail e telefone.");
  }
  if (guest.estado && guest.estado.length !== 2) return jsonError("O estado deve conter a sigla de 2 letras.");

  const updated = await db.request(`hospedes?id=eq.${id}&select=id`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(guest),
  });
  if (!updated.response.ok) {
    const message = updated.data?.code === "23505"
      ? "Já existe outro hóspede cadastrado com este CPF."
      : updated.data?.message || "Não foi possível atualizar o hóspede.";
    return jsonError(message, updated.response.status);
  }
  if (!updated.data?.length) return jsonError("Hóspede não encontrado.", 404);

  const removed = await db.request(`acompanhantes?hospede_id=eq.${id}`, { method: "DELETE" });
  if (!removed.response.ok) return jsonError(removed.data?.message || "Os dados foram atualizados, mas não foi possível substituir os acompanhantes.", removed.response.status);

  const companions = normalizeCompanions(input.acompanhantes).map((item) => ({ ...item, hospede_id: id }));
  if (companions.length) {
    const inserted = await db.request("acompanhantes", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(companions),
    });
    if (!inserted.response.ok) return jsonError(inserted.data?.message || "Hóspede atualizado, mas houve falha ao salvar os acompanhantes.", inserted.response.status);
  }

  const complete = await db.request(`hospedes?id=eq.${id}&select=*,acompanhantes(*)`);
  return Response.json(complete.data?.[0] || { id, ...guest, acompanhantes: companions });
}

export async function DELETE(request, context) {
  const db = await getAuthenticatedSupabase(request);
  if (db.error) return jsonError(db.error, db.status);
  const id = await getId(context);
  if (!id) return jsonError("ID de hóspede inválido.", 400);

  const { response, data } = await db.request(`hospedes?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=representation" } });
  if (!response.ok) return jsonError(data?.message || "Não foi possível excluir o hóspede.", response.status);
  if (!data?.length) return jsonError("Hóspede não encontrado.", 404);
  return Response.json({ message: "Hóspede excluído com sucesso." });
}
