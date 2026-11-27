import { getAuthenticatedSupabase, jsonError, normalizeGuestPayload, normalizeCompanions, isValidCpf } from "@/lib/supabase-server";

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
  if (!isValidCpf(guest.cpf)) return jsonError("Informe um CPF válido.");
  if (guest.estado && guest.estado.length !== 2) return jsonError("O estado deve conter a sigla de 2 letras.");

  const companions = normalizeCompanions(input.acompanhantes);
  const saved = await db.request("rpc/atualizar_hospede_com_acompanhantes", {
    method: "POST",
    body: JSON.stringify({
      p_hospede_id: id,
      p_hospede: guest,
      p_acompanhantes: companions,
    }),
  });

  if (!saved.response.ok) {
    const message = saved.data?.code === "23505"
      ? "Já existe outro hóspede cadastrado com este CPF."
      : saved.data?.code === "P0002"
        ? "Hóspede não encontrado."
        : saved.data?.message || "Não foi possível atualizar o hóspede e seus acompanhantes.";
    return jsonError(message, saved.data?.code === "P0002" ? 404 : saved.response.status);
  }

  return Response.json(saved.data);
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
