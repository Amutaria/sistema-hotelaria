
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import styles from "./periodo.module.css";

/* ---------- Ícones (SVG inline) ---------- */
const Icon = ({ children, size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const icons = {
  user: (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </Icon>
  ),
  pencil: (
    <Icon>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </Icon>
  ),
  check: (
    <Icon size={11}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
  chevronDown: (
    <Icon size={12}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),
};

const etapas = [
  "Dados do Hóspede",
  "Período & Quarto",
  "Revisão & Confirmar",
];

const formasPagamento = [
  "Faturado Empresa (Cartão no Check-out)",
  "Cartão de Crédito (Pré-autorização)",
  "Pix Antecipado",
  "Dinheiro no Check-in",
];

/* Taxa de serviço fixa por reserva */
const TAXA_SERVICO = 45;

/* ---------- Utilitários ---------- */
const converterJSON = (texto, padrao) => {
  try {
    return JSON.parse(texto) ?? padrao;
  } catch {
    return padrao;
  }
};

/* Aceita 180, "180", "R$ 180,00" ou "1.250,50" */
const paraNumero = (valor) => {
  if (typeof valor === "number") return valor;
  if (!valor) return 0;

  const texto = String(valor).replace(/[^\d,.-]/g, "");

  if (texto.includes(",")) {
    return Number(texto.replace(/\./g, "").replace(",", ".")) || 0;
  }

  return Number(texto) || 0;
};

const moeda = (v) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const primeiroValor = (...valores) =>
  valores.find((v) => v !== undefined && v !== null && v !== "");

/* ---------- Leitura do sessionStorage ---------- */
const assinarStorage = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

function useSessionStorage(chave) {
  return useSyncExternalStore(
    assinarStorage,
    () => sessionStorage.getItem(chave),
    () => null
  );
}

/* ---------- Página ---------- */
export default function PeriodoReserva() {
  const router = useRouter();

  const novaReservaTexto = useSessionStorage("novaReserva");
  const hospedeReservaTexto = useSessionStorage("hospedeReserva");
  const quartoTexto = useSessionStorage("reservaSelecionada");

  const [observacoes, setObservacoes] = useState("");
  const [pagamento, setPagamento] = useState(formasPagamento[0]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  /* Hóspede: vem da etapa 1 ou do formato antigo */
  const hospede = useMemo(() => {
    const novaReserva = converterJSON(novaReservaTexto, {});
    return (
      novaReserva?.hospede ||
      converterJSON(hospedeReservaTexto, null)
    );
  }, [novaReservaTexto, hospedeReservaTexto]);

  /* Quarto e datas */
  const quarto = useMemo(
    () => converterJSON(quartoTexto, null),
    [quartoTexto]
  );

  /* Resumo financeiro */
  const resumo = useMemo(() => {
    const novaReserva = converterJSON(novaReservaTexto, {});

    const dataEntrada = primeiroValor(
      quarto?.dataEntrada,
      quarto?.checkin,
      quarto?.entrada,
      novaReserva?.dataEntrada,
      novaReserva?.checkin
    );

    const dataSaida = primeiroValor(
      quarto?.dataSaida,
      quarto?.checkout,
      quarto?.saida,
      novaReserva?.dataSaida,
      novaReserva?.checkout
    );

    let diarias = paraNumero(
      primeiroValor(
        quarto?.diarias,
        quarto?.noites,
        novaReserva?.diarias
      )
    );

    if (!diarias && dataEntrada && dataSaida) {
      diarias = Math.round(
        (new Date(dataSaida) - new Date(dataEntrada)) / 86400000
      );
    }

    if (!diarias || diarias < 1) diarias = 1;

    const valorDiaria = paraNumero(quarto?.diaria);
    const estadia = valorDiaria * diarias;
    const taxas = quarto ? TAXA_SERVICO : 0;

    return {
      dataEntrada,
      dataSaida,
      diarias,
      valorDiaria,
      estadia,
      taxas,
      total: estadia + taxas,
      nomeQuarto:
        quarto?.nome ||
        [quarto?.tipo, quarto?.numero].filter(Boolean).join(" ") ||
        "Quarto selecionado",
    };
  }, [quarto, novaReservaTexto]);

  /* ---------- Confirmar reserva ---------- */
  async function confirmar() {
    if (enviando) return;

    if (!hospede?.nome || !hospede?.cpf || !hospede?.email) {
      setErro("Informe nome, CPF e e-mail do hóspede.");
      return;
    }

    if (!quarto) {
      setErro("Nenhum quarto foi selecionado na disponibilidade.");
      return;
    }

    const quartoId = quarto.quartoId ?? quarto.id;
    const quantidadePessoas = Number(quarto.quantidadePessoas);

    if (!quartoId || !resumo.dataEntrada || !resumo.dataSaida) {
      setErro("Os dados do quarto ou das datas estão incompletos.");
      return;
    }

    if (!quantidadePessoas || quantidadePessoas < 1) {
      setErro("A quantidade de hóspedes é inválida.");
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospede,
          quartoId,
          dataEntrada: resumo.dataEntrada,
          dataSaida: resumo.dataSaida,
          quantidadePessoas,
          observacoes,
          pagamento,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível cadastrar a reserva."
        );
      }

      sessionStorage.setItem(
        "dadosReserva",
        JSON.stringify(dados)
      );

      router.push("/reservas/sucesso");
    } catch (error) {
      setErro(
        error.message || "Erro ao comunicar com o servidor."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* CABEÇALHO */}
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>
            Reservas &gt; Nova Reserva &gt; Finalizar
          </span>

          <h1 className={styles.title}>Realizar Nova Reserva</h1>

          <p className={styles.subtitle}>
            Revise as datas e confirme as observações operacionais da estadia.
          </p>
        </div>

        <div className={styles.userPill}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>

      {/* ETAPAS */}
      <nav className={styles.stepper} aria-label="Etapas da reserva">
        {etapas.map((nome, i) => (
          <div key={nome} className={styles.stepWrapper}>
            {i === 0 ? (
              <button
                type="button"
                className={`${styles.step} ${styles.stepDone}`}
                onClick={() => router.push("/reservas/nova")}
              >
                <span className={styles.stepNumber}>
                  {icons.check}
                </span>

                <span className={styles.stepLabel}>{nome}</span>
              </button>
            ) : (
              <div
                className={`${styles.step} ${
                  i === 1 ? styles.stepActive : ""
                }`}
                aria-current={i === 1 ? "step" : undefined}
              >
                <span className={styles.stepNumber}>{i + 1}</span>
                <span className={styles.stepLabel}>{nome}</span>
              </div>
            )}

            {i < etapas.length - 1 && (
              <span className={styles.stepLine} />
            )}
          </div>
        ))}
      </nav>

      <div className={styles.grid}>
        {/* COLUNA ESQUERDA */}
        <div className={styles.leftColumn}>
          {/* HÓSPEDE */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>
                  {icons.user}
                </span>
                Hóspede Confirmado
              </h2>

              {hospede?.nome && (
                <span className={styles.linked}>Vinculado</span>
              )}
            </div>

            {hospede?.nome ? (
              <div className={styles.guest}>
                <strong>{hospede.nome}</strong>

                <span>
                  CPF: {hospede.cpf || "-"}
                  <i>•</i>
                  {hospede.email || "sem e-mail"}
                </span>
              </div>
            ) : (
              <p className={styles.warning}>
                Nenhum hóspede informado.{" "}
                <button
                  type="button"
                  onClick={() => router.push("/reservas/nova")}
                >
                  Voltar para Dados do Hóspede
                </button>
              </p>
            )}
          </section>

          {/* OBSERVAÇÕES E PAGAMENTO */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>
                {icons.pencil}
              </span>
              Observações e Preferências
            </h2>

            <div className={styles.field}>
              <label htmlFor="observacoes">
                Comentários Operacionais
              </label>

              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Solicita cama de casal extra, check-in tardio previsto para as 21:00, preferência por quarto silencioso longe do elevador."
              />
            </div>

            {/* FORMA DE PAGAMENTO DESTACADA */}
            <div className={`${styles.field} ${styles.paymentField}`}>
              <div className={styles.paymentHeader}>
                <label htmlFor="pagamento">
                  Forma de Garantia / Pagamento
                </label>

                <p>
                  Selecione como será realizado o pagamento da hospedagem.
                </p>
              </div>

              <div
                className={`${styles.selectBox} ${styles.paymentSelectBox}`}
              >
                <select
                  id="pagamento"
                  value={pagamento}
                  onChange={(e) => setPagamento(e.target.value)}
                >
                  {formasPagamento.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>

                <span className={styles.selectIcon}>
                  {icons.chevronDown}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* RESUMO FINANCEIRO */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>
            Resumo Financeiro
          </h2>

          {quarto ? (
            <dl className={styles.summaryList}>
              <div>
                <dt>{resumo.nomeQuarto}</dt>
                <dd>{moeda(resumo.valorDiaria)}</dd>
              </div>

              <div>
                <dt>
                  Estadia ({resumo.diarias}{" "}
                  {resumo.diarias === 1 ? "diária" : "diárias"})
                </dt>
                <dd>{moeda(resumo.estadia)}</dd>
              </div>

              <div>
                <dt>Taxas de Serviço (ISS)</dt>
                <dd>{moeda(resumo.taxas)}</dd>
              </div>
            </dl>
          ) : (
            <p className={styles.noRoom}>
              Nenhum quarto selecionado na disponibilidade.
            </p>
          )}

          <div className={styles.total}>
            <span>Total Geral</span>
            <strong>{moeda(resumo.total)}</strong>
          </div>

          {erro && (
            <p className={styles.warning}>
              {erro}
            </p>
          )}

          <button
            type="button"
            className={styles.confirmButton}
            onClick={confirmar}
            disabled={enviando}
          >
            {enviando
              ? "Cadastrando reserva..."
              : "Confirmar & Gerar Reserva"}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/reservas/nova")}
          >
            Voltar ao Passo Anterior
          </button>
        </aside>
      </div>
    </div>
  );
}
