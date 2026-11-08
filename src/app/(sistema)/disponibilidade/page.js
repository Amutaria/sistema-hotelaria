"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./disponibilidade.module.css";

export default function Disponibilidade() {

  const router = useRouter();

  const [dataEntrada, setDataEntrada] = useState("2024-06-01");
const [dataSaida, setDataSaida] = useState("2024-06-05");
const [tipoQuarto, setTipoQuarto] = useState("Todos os tipos");
const [capacidade, setCapacidade] = useState("2 Pessoas");
const [consultou, setConsultou] = useState(false);

  function consultarDisponibilidade() {
  if (!dataEntrada || !dataSaida) {
    alert("Informe a data de entrada e saída.");
    return;
  }

  if (dataSaida <= dataEntrada) {
    alert("A data de saída deve ser posterior à entrada.");
    return;
  }

  sessionStorage.setItem(
    "periodoReserva",
    JSON.stringify({
      checkIn: dataEntrada,
      checkOut: dataSaida
    })
  );

  setConsultou(true);
}

  function selecionarQuarto(quarto, categoria, valor) {
  const periodo =
    JSON.parse(sessionStorage.getItem("periodoReserva")) || {};

  const reservaAtual = {
    checkIn: periodo.checkIn,
    checkOut: periodo.checkOut,

    quarto: {
      numero: quarto,
      categoria: categoria,
      valor: valor
    }
  };

  sessionStorage.setItem(
    "reservaAtual",
    JSON.stringify(reservaAtual)
  );

  router.push("/reservas/nova");
}


  function novaReserva() {
    router.push("/reservas");
  }


  return (
    <div className={styles.page}>

      {/* CABEÇALHO */}
      <header className={styles.header}>

        <div>

          <div className={styles.breadcrumb}>
            🏠　›　Reservas　›　<strong>Consultar Disponibilidade</strong>
          </div>

          <h1>
            Consulta de Disponibilidade
          </h1>

          <p>
            Verifique o inventário de quartos e realize reservas para períodos futuros.
          </p>

        </div>


        <div className={styles.headerButtons}>

          <button className={styles.calendarButton}>
            📅 Ver Calendário
          </button>

          <button
            className={styles.newButton}
            onClick={novaReserva}
          >
            + Nova Reserva Direta
          </button>

        </div>

      </header>


      {/* PARÂMETROS */}
      <section className={styles.searchCard}>

        <div className={styles.sectionTitle}>

          <div className={styles.icon}>
            🔍
          </div>

          <div>
            <h2>Parâmetros de Busca</h2>

            <p>
              Defina o período e critérios básicos de hospedagem
            </p>
          </div>

        </div>


        <div className={styles.searchFields}>

          <div>
            <label>
              Data de Entrada *
            </label>

            <input
              type="date"
              value={dataEntrada}
            onChange={(e) => setDataEntrada(e.target.value)}
            />
          </div>


          <div>
            <label>
              Data de Saída *
            </label>

            <input
              type="date"
              value={dataSaida}
              onChange={(e) => setDataSaida(e.target.value)}
            />
          </div>


          <div>
            <label>
              Tipo de Quarto
            </label>

            <select value={tipoQuarto}
                    onChange={(e) => setTipoQuarto(e.target.value)}>
              <option>Todos os tipos</option>
              <option>Standard Single</option>
              <option>Standard Double</option>
              <option>Deluxe Suite</option>
              <option>Master Suite</option>
            </select>
          </div>


          <div>
            <label>
              Capacidade (Pessoas)
            </label>

            <select value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}>
              <option>2 Pessoas</option>
              <option>1 Pessoa</option>
              <option>3 Pessoas</option>
              <option>4 Pessoas</option>
            </select>

          </div>


          <button className={styles.searchButton}
                  onClick={consultarDisponibilidade}>
            🔍 Consultar
          </button>

        </div>

      </section>

      {consultou && (
        <>
      {/* RESUMO */}
      <div className={styles.stats}>

        <div className={styles.statCard}>

          <span>📅</span>

          <div>
            <small>PERÍODO SELECIONADO</small>
            <strong>01 Jun – 05 Jun (4 Noites)</strong>
          </div>

        </div>


        <div className={styles.statCard}>

          <span>🛏️</span>

          <div>
            <small>QUARTOS ENCONTRADOS</small>
            <strong>5 Unidades Disponíveis</strong>
          </div>

        </div>


        <div className={styles.statCard}>

          <span>↕️</span>

          <div>
            <small>ORDENAR RESULTADOS</small>
            <strong>Preço: Menor para Maior</strong>
          </div>

        </div>

      </div>


      {/* LISTA */}
      <section className={styles.roomsCard}>

        <div className={styles.roomsHeader}>
          <strong>
            Lista de Unidades Habitacionais
          </strong>

          <span>
            ⋯
          </span>
        </div>


        {/* CABEÇALHO DA TABELA */}
        <div className={styles.tableHeader}>

          <span>Quarto</span>
          <span>Tipo & Categoria</span>
          <span>Localização</span>
          <span>Capacidade</span>
          <span>Comodidades</span>
          <span>Diária</span>
          <span>Status</span>
          <span></span>

        </div>


        {/* QUARTO 101 */}
        <div className={styles.roomRow}>

          <strong className={styles.roomNumber}>
            #101
          </strong>

          <div>
            <strong>Standard Single</strong>
            <small>CATEGORIA PREMIUM</small>
          </div>

          <span>
            1º Andar
          </span>

          <span>
            👥 1 pax
          </span>

          <span>
            Wi-Fi · TV · Ar
          </span>

          <strong className={styles.price}>
            R$ 180,00
          </strong>

          <span className={styles.available}>
            ● Disponível
          </span>

          <button
            className={styles.selectButton}
            onClick={() =>
              selecionarQuarto(
                "101",
                "Standard Single",
                180
              )
            }
          >
            Selecionar
          </button>

        </div>


        {/* QUARTO 204 */}
        <div className={styles.roomRow}>

          <strong className={styles.roomNumber}>
            #204
          </strong>

          <div>
            <strong>Double Deluxe</strong>
            <small>CATEGORIA PREMIUM</small>
          </div>

          <span>
            2º Andar
          </span>

          <span>
            👥 2 pax
          </span>

          <span>
            Wi-Fi · TV · Frigobar
          </span>

          <strong className={styles.price}>
            R$ 350,00
          </strong>

          <span className={styles.available}>
            ● Disponível
          </span>

          <button
            className={styles.selectButton}
            onClick={() =>
              selecionarQuarto(
                "204",
                "Double Deluxe",
                350
              )
            }
          >
            Selecionar
          </button>

        </div>


        {/* QUARTO 305 */}
        <div className={styles.roomRow}>

          <strong className={styles.roomNumber}>
            #305
          </strong>

          <div>
            <strong>Family Suite</strong>
            <small>CATEGORIA PREMIUM</small>
          </div>

          <span>
            3º Andar
          </span>

          <span>
            👥 4 pax
          </span>

          <span>
            Wi-Fi · TV · Frigobar
          </span>

          <strong className={styles.price}>
            R$ 580,00
          </strong>

          <span className={styles.available}>
            ● Disponível
          </span>

          <button
            className={styles.selectButton}
            onClick={() =>
              selecionarQuarto(
                "305",
                "Family Suite",
                580
              )
            }
          >
            Selecionar
          </button>

        </div>


        {/* QUARTO 402 */}
        <div className={styles.roomRow}>

          <strong className={styles.roomNumber}>
            #402
          </strong>

          <div>
            <strong>Master Suite</strong>
            <small>CATEGORIA PREMIUM</small>
          </div>

          <span>
            4º Andar
          </span>

          <span>
            👥 2 pax
          </span>

          <span>
            Wi-Fi · TV · Banheira
          </span>

          <strong className={styles.price}>
            R$ 1.200,00
          </strong>

          <span className={styles.available}>
            ● Disponível
          </span>

          <button
            className={styles.selectButton}
            onClick={() =>
              selecionarQuarto(
                "402",
                "Master Suite",
                1200
              )
            }
          >
            Selecionar
          </button>

        </div>


        {/* QUARTO 105 */}
        <div className={styles.roomRow}>

          <strong className={styles.roomNumber}>
            #105
          </strong>

          <div>
            <strong>Double Deluxe</strong>
            <small>CATEGORIA PREMIUM</small>
          </div>

          <span>
            1º Andar
          </span>

          <span>
            👥 2 pax
          </span>

          <span>
            Wi-Fi · TV · Ar
          </span>

          <strong className={styles.price}>
            R$ 350,00
          </strong>

          <span className={styles.available}>
            ● Disponível
          </span>

          <button
            className={styles.selectButton}
            onClick={() =>
              selecionarQuarto(
                "105",
                "Double Deluxe",
                350
              )
            }
          >
            Selecionar
          </button>

        </div>

      </section>
            </>
      )}

      {/* RODAPÉ */}
      <footer className={styles.footer}>
        HotelPro Admin v4.2.0 • Central de Disponibilidade Real-Time • Grand Plaza Hotel
      </footer>

    </div>
  );
}