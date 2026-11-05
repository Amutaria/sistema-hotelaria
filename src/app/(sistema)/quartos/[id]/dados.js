import { useMemo, useSyncExternalStore } from "react";
 
/* =========================================================
   DADOS COMPARTILHADOS ENTRE "DETALHES" E "ALTERAR STATUS"
   As fotos ficam em: public/quartos/quarto-101.jpg, quarto-102.jpg ...
========================================================= */
 
export const quartosPadrao = {
  101: {
    id: 1,
    numero: "101",
    status: "Livre",
    categoria: "Standard",
    andar: "1º Andar",
    diaria: "R$ 250,00",
    capacidade: "Até 2 pessoas",
    comodidades: ["Wi-Fi Grátis", "Ar Condicionado", "TV a Cabo"],
    historico: [
      { periodo: "10/10 - 14/10", hospede: "Fernanda Rocha", status: "Finalizado", tarifa: "R$ 250,00" },
    ],
  },
  102: {
    id: 2,
    numero: "102",
    status: "Ocupado",
    categoria: "Luxo",
    andar: "1º Andar",
    diaria: "R$ 450,00",
    capacidade: "Até 4 pessoas",
    comodidades: ["Wi-Fi Grátis", "Ar Condicionado", "Frigobar", "TV Cabo 4K", "Vista Mar", "Cama King Size"],
    historico: [
      { periodo: "24/10 - Ativo", hospede: "Mariana Silva Lima", status: "Hospedado", tarifa: "R$ 450,00" },
      { periodo: "18/10 - 22/10", hospede: "Carlos Alberto Souza", status: "Finalizado", tarifa: "R$ 450,00" },
    ],
  },
  103: {
    id: 3,
    numero: "103",
    status: "Reservado",
    categoria: "Suíte",
    andar: "1º Andar",
    diaria: "R$ 600,00",
    capacidade: "Até 3 pessoas",
    comodidades: ["Wi-Fi Grátis", "Ar Condicionado", "Frigobar", "Banheira", "Vista Mar"],
    historico: [
      { periodo: "26/10 - 29/10", hospede: "Ricardo Menezes", status: "Reservado", tarifa: "R$ 600,00" },
      { periodo: "12/10 - 15/10", hospede: "Juliana Prado", status: "Finalizado", tarifa: "R$ 600,00" },
    ],
  },
  104: {
    id: 4,
    numero: "104",
    status: "Manutenção",
    categoria: "Standard",
    andar: "1º Andar",
    diaria: "R$ 250,00",
    capacidade: "Até 2 pessoas",
    comodidades: ["Wi-Fi Grátis", "Ar Condicionado"],
    historico: [
      { periodo: "05/10 - 08/10", hospede: "Paulo Henrique Dias", status: "Finalizado", tarifa: "R$ 250,00" },
    ],
  },
};
 
/* Status possíveis: "valor" é o que fica salvo, "rotulo" é o que aparece no select */
export const opcoesStatus = [
  { valor: "Livre", rotulo: "Livre" },
  { valor: "Ocupado", rotulo: "Ocupado" },
  { valor: "Reservado", rotulo: "Reservado" },
  { valor: "Manutenção", rotulo: "Em Manutenção" },
  { valor: "Bloqueado", rotulo: "Bloqueado" },
];
 
/* Nome da classe CSS de cada status */
export const classeStatus = {
  Livre: "badgeLivre",
  Ocupado: "badgeOcupado",
  Reservado: "badgeReservado",
  Manutenção: "badgeManutencao",
  Bloqueado: "badgeBloqueado",
  Hospedado: "badgeOcupado",
  Finalizado: "badgeLivre",
};
 
/* Converte um quarto criado em "Novo Quarto" para o mesmo formato */
const statusCadastro = {
  "Disponível (Livre)": "Livre",
  "Em Manutenção": "Manutenção",
  Bloqueado: "Bloqueado",
};
 
const converterCadastro = (q) => ({
  id: q.id,
  numero: String(q.numero),
  status: statusCadastro[q.status] || "Livre",
  categoria: q.tipo || "—",
  andar: q.andar || "—",
  diaria: q.diaria || "—",
  capacidade: q.capacidade ? `Até ${String(q.capacidade).replace(/\D/g, "")} pessoas` : "—",
  comodidades: Array.isArray(q.comodidades) ? q.comodidades : [],
  historico: [],
});
 
const converterJSON = (texto, padrao) => {
  try {
    return JSON.parse(texto) ?? padrao;
  } catch {
    return padrao;
  }
};
 
/* ---------- Leitura do sessionStorage sem useEffect ---------- */
const assinarStorage = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};
 
export function useSessionStorage(chave) {
  return useSyncExternalStore(
    assinarStorage,
    () => sessionStorage.getItem(chave),
    () => null
  );
}
 
/* ---------- Busca o quarto já com o status atualizado ---------- */
export function useQuarto(numero) {
  const quartosTexto = useSessionStorage("quartos");
  const statusTexto = useSessionStorage("statusQuartos");
 
  return useMemo(() => {
    let quarto = quartosPadrao[numero] || null;
 
    if (!quarto) {
      const salvos = converterJSON(quartosTexto, []);
      const encontrado = Array.isArray(salvos)
        ? [...salvos].reverse().find((q) => String(q.numero) === String(numero))
        : null;
      quarto = encontrado ? converterCadastro(encontrado) : null;
    }
 
    if (!quarto) return null;
 
    const alteracao = converterJSON(statusTexto, {})[quarto.numero];
    return alteracao ? { ...quarto, status: alteracao.status, alteracaoStatus: alteracao } : quarto;
  }, [numero, quartosTexto, statusTexto]);
}
 
/* ---------- Salva a alteração de status ---------- */
export function salvarStatus(numero, dados) {
  const todos = converterJSON(sessionStorage.getItem("statusQuartos"), {});
  todos[numero] = dados;
  sessionStorage.setItem("statusQuartos", JSON.stringify(todos));
}