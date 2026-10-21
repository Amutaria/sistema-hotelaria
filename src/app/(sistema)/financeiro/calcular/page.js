"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./calcular.module.css";

export default function CalcularHospedagem() {

  const router = useRouter();

  const [reserva] = useState(() => {
  if (typeof window === "undefined") {
    return {};
  }

  const dados = sessionStorage.getItem("reservaAtual");

  return dados ? JSON.parse(dados) : {};
});

const quarto = reserva.quarto;
const [desconto, setDesconto] = useState(0);
const [imposto, setImposto] = useState(5);

  const valorDiaria = Number(quarto?.valor || 0);

const noites = (() => {
  if (!reserva.checkIn || !reserva.checkOut) {
    return 0;
  }

  const entrada = new Date(reserva.checkIn);
  const saida = new Date(reserva.checkOut);

  const diferenca =
    saida.getTime() - entrada.getTime();

  return Math.max(
    0,
    Math.ceil(
      diferenca / (1000 * 60 * 60 * 24)
    )
  );
})();

  const subtotal = valorDiaria * noites;

  const descontoValor =
    subtotal * (Number(desconto) / 100);

  const valorComDesconto =
    subtotal - descontoValor;

  const impostoValor =
    valorComDesconto * (Number(imposto) / 100);

  const total =
    valorComDesconto + impostoValor;


  function continuarReserva() {
  const dadosAtuais = {
    ...reserva,

    financeiro: {
      subtotal,
      desconto: descontoValor,
      imposto: impostoValor,
      total
    }
  };

  sessionStorage.setItem(
    "reservaAtual",
    JSON.stringify(dadosAtuais)
  );

  router.push("/reservas/sucesso");
}


  return (
    <div className={styles.page}>


      {/* CABEÇALHO */}

      <header className={styles.header}>

        <div>

          <div className={styles.breadcrumb}>
            🏠　›　FINANCEIRO　›　<strong>CALCULADORA</strong>
          </div>

          <h1>
            Calcular Valor da Hospedagem
          </h1>

          <p>
            Simule orçamentos detalhados, aplique taxas e descontos para fornecer cotações precisas aos hóspedes.
          </p>

        </div>

      </header>


      {/* CONTEÚDO */}

      <main className={styles.content}>


        <div className={styles.leftColumn}>


          {/* DETALHES */}

          <section className={styles.card}>

            <div className={styles.sectionTitle}>

              <div className={styles.icon}>
                🛏️
              </div>

              <div>

                <h2>
                  Detalhes da Estadia
                </h2>

                <p>
                  Selecione as datas, o tipo de acomodação e a quantidade de pessoas.
                </p>

              </div>

            </div>


            <div className={styles.fields}>


              <div>

                <label>
                  Check-in
                </label>

                <input
                  type="date"
                  defaultValue="2024-06-01"
                />

              </div>


              <div>

                <label>
                  Check-out
                </label>

                <input
                  type="date"
                  defaultValue="2024-06-05"
                />

              </div>


              <div>

                <label>
                  Categoria de Quarto
                </label>

                <input
                  type="text"
                  value={quarto?.categoria || ""}
                  readOnly
                />

              </div>


              <div>

                <label>
                  Valor da Diária (R$)
                </label>

                <input
                  type="number"
                  value={valorDiaria}
                  readOnly
                />

              </div>


              <div>

                <label>
                  Quantidade de Hóspedes
                </label>

                <input
                  type="number"
                  defaultValue="2"
                />

              </div>


              <div className={styles.duration}>

                <small>
                  DURAÇÃO CALCULADA
                </small>

                <strong>
                  {noites} noites
                </strong>

              </div>

            </div>

          </section>


          {/* DESCONTOS */}

          <section className={styles.card}>

            <div className={styles.sectionTitle}>

              <div className={styles.icon}>
                %
              </div>

              <div>

                <h2>
                  Descontos e Taxas
                </h2>

                <p>
                  Aplique reduções promocionais ou taxas municipais/estaduais.
                </p>

              </div>

            </div>


            <div className={styles.discountGrid}>


              <div>

                <label>
                  % Desconto Promocional (%)
                </label>

                <input
                  type="number"
                  min="0"
                  value={desconto}
                  onChange={(e) =>
                    setDesconto(e.target.value)
                  }
                />

                <div className={styles.warning}>
                  ⓘ O desconto será aplicado sobre o valor subtotal.
                </div>

              </div>


              <div>

                <label>
                  Taxas de Imposto / ISS (%)
                </label>

                <input
                  type="number"
                  min="0"
                  value={imposto}
                  onChange={(e) =>
                    setImposto(e.target.value)
                  }
                />

                <div className={styles.info}>
                  ⓘ Taxa padrão para serviços hoteleiros nesta unidade é de 5%.
                </div>

              </div>


            </div>

          </section>


        </div>


        {/* RESUMO */}

        <aside className={styles.summary}>

          <div className={styles.summaryHeader}>
            🧮 Resumo Financeiro
          </div>


          <div className={styles.summaryContent}>


            <div className={styles.summarySection}>

              <small>
                ESTADIA BASE
              </small>

              <div>
                {noites} noites × R$ {valorDiaria.toFixed(2)}
              </div>

              <strong>
                R$ {subtotal.toFixed(2)}
              </strong>

            </div>


            <div className={styles.summarySection}>

              <small>
                SERVIÇOS ADICIONAIS
              </small>

              <div>
                Café da Manhã Premium
              </div>

              <strong>
                R$ 180,00
              </strong>

            </div>


            <div className={styles.summarySection}>

              <small>
                AJUSTES
              </small>

              <div>
                Desconto ({desconto}%)
              </div>

              <strong>
                - R$ {descontoValor.toFixed(2)}
              </strong>

              <div>
                Impostos ({imposto}%)
              </div>

              <strong>
                R$ {impostoValor.toFixed(2)}
              </strong>

            </div>


            <div className={styles.totalBox}>

              <small>
                VALOR TOTAL ESTIMADO
              </small>

              <strong>
                R$ {total.toFixed(2)}
              </strong>

            </div>


            <button
              className={styles.continueButton}
              onClick={continuarReserva}
            >
              → Continuar para Reserva
            </button>


            <div className={styles.actionButtons}>

              <button>
                🧮 Calcular
              </button>

              <button>
                ♢ Limpar
              </button>

            </div>

          </div>


          <div className={styles.summaryFooter}>
            HOTELPRO FINANCE
            <span>
              UNIDADE: GRAND PLAZA
            </span>
          </div>

        </aside>

      </main>


      <footer className={styles.footer}>
        HOTELPRO ADMIN • SISTEMA FINANCEIRO V4.2.0
      </footer>

    </div>
  );
}