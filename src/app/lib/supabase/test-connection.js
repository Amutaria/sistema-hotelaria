import { createClient } from "./client";

export async function testConnection() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("teste_conexao")
    .select("mensagem")
    .limit(1);

  if (error) {
    console.error("Erro ao consultar o Supabase:", error.message);
    return;
  }

  console.log("Resposta do Supabase:", data);
}