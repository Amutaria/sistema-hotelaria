
"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import styles from "./sucesso.module.css";

// Recupera os dados do sessionStorage
function obterDadosReserva() {
  return sessionStorage.getItem("dadosReserva");
}

// Formata a data para DD/MM/AAAA
function formatarData(data) {
  if (!data) return "Não informada";

  const texto = String(data).split("T")[0];
  const partes = texto.split("-");

  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }

  return texto;
}

// Formata valores monetários
function formatarMoeda(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "R$ 0,00";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ReservaSucesso() {
  const router = useRouter();

  // Lê os dados da reserva sem usar setState dentro do useEffect
  const dados = useSyncExternalStore(
    () => () => {},
    obterDadosReserva,
    () => null
  );

  // Converte os dados recebidos em objeto
  let reserva = null;

  if (dados) {
    try {
      reserva = JSON.parse(dados);
    } catch (error) {
      console.error("Erro ao ler os dados da reserva:", error);
    }
  }

  // Reserva não encontrada
  if (!reserva || typeof reserva !== "object") {
    return (
      <main className={styles.page}>
        <section className={styles.emptyCard}>
          <h1>Reserva não encontrada</h1>

          <p>
            Não encontramos os dados de uma reserva confirmada.
            Realize uma nova reserva para continuar.
          </p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/reservas")}
          >
            Ir para Reservas
          </button>
        </section>
      </main>
    );
  }

  // Dados da reserva
  const hospede = reserva.hospede || {};
  const valores = reserva.valores || {};

  const numeroQuarto =
    reserva.quartoNumero ??
    reserva.quarto?.numero ??
    reserva.quartoId;

  const tipoQuarto =
    reserva.quartoTipo ??
    reserva.tipoQuarto ??
    reserva.quarto?.tipo ??
    reserva.quarto?.categoria;

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* CONFIRMAÇÃO */}
        <section className={styles.successCard}>
          <div className={styles.successIcon}>
            <span>✓</span>
          </div>

          <span className={styles.successLabel}>
            RESERVA CONFIRMADA
          </span>

          <h1>Reserva realizada com sucesso!</h1>

          <p>
            A reserva foi cadastrada e confirmada no sistema.
            Confira os detalhes da operação abaixo.
          </p>

          <div className={styles.codeBox}>
            <span>CÓDIGO DA RESERVA</span>
            <strong>{reserva.codigo || "Não informado"}</strong>
          </div>
        </section>

        {/* RESUMO DA RESERVA */}
        <section className={styles.detailsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Resumo da Reserva</h2>
              <p>Confira as informações cadastradas.</p>
            </div>

            <span className={styles.status}>
              {reserva.status || "Confirmada"}
            </span>
          </div>

          {/* DADOS DO HÓSPEDE */}
          <div className={styles.infoSection}>
            <h3>Dados do Hóspede</h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Nome completo</span>
                <strong>{hospede.nome || "Não informado"}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>CPF</span>
                <strong>{hospede.cpf || "Não informado"}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>E-mail</span>
                <strong>{hospede.email || "Não informado"}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Telefone</span>
                <strong>{hospede.telefone || "Não informado"}</strong>
              </div>
            </div>
          </div>

          {/* DETALHES DA HOSPEDAGEM */}
          <div className={styles.infoSection}>
            <h3>Detalhes da Hospedagem</h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Acomodação</span>
                <strong>
                  {numeroQuarto
                    ? `Quarto ${numeroQuarto}`
                    : "Não informado"}

                  {tipoQuarto ? ` — ${tipoQuarto}` : ""}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Quantidade de hóspedes</span>
                <strong>
                  {reserva.quantidadePessoas ?? "Não informada"}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Check-in</span>
                <strong>{formatarData(reserva.dataEntrada)}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Check-out</span>
                <strong>{formatarData(reserva.dataSaida)}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Quantidade de diárias</span>
                <strong>{reserva.diarias ?? 0}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Forma de pagamento</span>
                <strong>{reserva.pagamento || "Não informada"}</strong>
              </div>
            </div>
          </div>

          {/* RESUMO FINANCEIRO */}
          <div className={styles.infoSection}>
            <h3>Resumo Financeiro</h3>

            <div className={styles.financeList}>
              <div>
                <span>Valor da diária</span>
                <strong>{formatarMoeda(valores.diaria)}</strong>
              </div>

              <div>
                <span>Valor da hospedagem</span>
                <strong>{formatarMoeda(valores.hospedagem)}</strong>
              </div>

              <div>
                <span>Taxas de serviço</span>
                <strong>{formatarMoeda(valores.taxas)}</strong>
              </div>

              <div className={styles.total}>
                <span>Total da reserva</span>
                <strong>{formatarMoeda(valores.total)}</strong>
              </div>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          {reserva.observacoes && (
            <div className={styles.infoSection}>
              <h3>Observações</h3>

              <p className={styles.observations}>
                {reserva.observacoes}
              </p>
            </div>
          )}

          {/* BOTÕES */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => window.print()}
            >
              Imprimir confirmação
            </button>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => router.push("/reservas")}
            >
              Voltar para Reservas
            </button>
          </div>
        </section>

        <p className={styles.footer}>
          HotelPro Admin • Sistema de Gerenciamento Hoteleiro
        </p>
      </div>
    </main>
  );
}
