"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./reservas.module.css";
 
export default function ReservasPage() {
  const router = useRouter();
 
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [tipoQuarto, setTipoQuarto] = useState("Todos os tipos");
  const [capacidade, setCapacidade] = useState("2 Pessoas");
  const [buscou, setBuscou] = useState(false);
 
  const quartos = [
    {
      id: 101,
      nome: "Suíte Standard 101",
      tipo: "Standard Single",
      localizacao: "1º Andar",
      capacidade: "1 Pax",
      comodidades: "Wi-Fi • TV • Ar-condicionado",
      diaria: "R$ 180,00",
    },
    {
      id: 202,
      nome: "Suíte Executiva 202",
      tipo: "Executive Double",
      localizacao: "2º Andar",
      capacidade: "2 Pax",
      comodidades: "Wi-Fi • TV • Frigobar • Ar",
      diaria: "R$ 250,00",
    },
    {
      id: 305,
      nome: "Premium Master 305",
      tipo: "Master Suíte Jacuzzi",
      localizacao: "3º Andar",
      capacidade: "4 Pax",
      comodidades: "Wi-Fi • Jacuzzi • Minibar • Ar",
      diaria: "R$ 450,00",
    },
  ];
 
  function handleBuscar(e) {
    e.preventDefault();
    setBuscou(true);
  }
 
  function handleReservar(quarto) {
    const reserva = {
      quarto,
      dataEntrada,
      dataSaida,
      tipoQuarto,
      capacidade,
    };
 
    sessionStorage.setItem(
      "reservaSelecionada",
      JSON.stringify(reserva)
    );
 
    router.push("/reservas/nova");
  }
 
  return (
    <div className={styles.page}>
 
      {/* BARRA SUPERIOR */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>Hotel Grand Plaza / Central de Reservas</span>
        <div className={styles.topbarUser}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.breadcrumb}>
          Reservas &gt; {buscou ? "Resultados" : "Consultar Disponibilidade"}
        </span>
        <h1 className={styles.bannerTitle}>Consulta de Disponibilidade</h1>
        <p className={styles.bannerText}>
          Verifique o inventário de quartos e realize reservas para períodos futuros.
        </p>
      </section>
 
      <div className={styles.content}>
 
      {/* PARÂMETROS */}
      <section className={styles.searchCard}>
 
        <div className={styles.searchTitle}>
          <div className={styles.searchIcon}>
            ⌕
          </div>
 
          <strong>Parâmetros de Busca</strong>
 
          <span>
            — Defina o período e critérios básicos de hospedagem
          </span>
        </div>
 
        <form
          className={styles.searchForm}
          onSubmit={handleBuscar}
        >
 
          {/* DATA ENTRADA */}
          <div className={styles.field}>
            <label htmlFor="entrada">
              Data de Entrada <span>*</span>
            </label>
 
            <input
              id="entrada"
              type="date"
              value={dataEntrada}
              onChange={(e) => setDataEntrada(e.target.value)}
              required
            />
          </div>
 
          {/* DATA SAÍDA */}
          <div className={styles.field}>
            <label htmlFor="saida">
              Data de Saída <span>*</span>
            </label>
 
            <input
              id="saida"
              type="date"
              value={dataSaida}
              onChange={(e) => setDataSaida(e.target.value)}
              required
            />
          </div>
 
          {/* TIPO */}
          <div className={styles.field}>
            <label htmlFor="tipo">
              Tipo de Quarto
            </label>
 
            <select
              id="tipo"
              value={tipoQuarto}
              onChange={(e) => setTipoQuarto(e.target.value)}
            >
              <option>Todos os tipos</option>
              <option>Standard</option>
              <option>Executivo</option>
              <option>Master</option>
              <option>Suíte</option>
            </select>
          </div>
 
          {/* CAPACIDADE */}
          <div className={styles.field}>
            <label htmlFor="capacidade">
              Capacidade (Pessoas)
            </label>
 
            <select
              id="capacidade"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
            >
              <option>1 Pessoa</option>
              <option>2 Pessoas</option>
              <option>3 Pessoas</option>
              <option>4 Pessoas</option>
              <option>5+ Pessoas</option>
            </select>
          </div>
 
          <button
            type="submit"
            className={styles.searchButton}
          >
            Buscar Quartos
          </button>
 
        </form>
      </section>
 
      {/* RESULTADOS */}
      {!buscou ? (
 
        <section className={styles.emptyCard}>
 
          <div className={styles.emptyIcon}>
            ▣
          </div>
 
          <h2>Nenhuma busca realizada</h2>
 
          <p>
            Insira as datas de entrada e saída acima e clique em
            <strong> Buscar Quartos</strong> para consultar o
            inventário disponível em tempo real.
          </p>
 
        </section>
 
      ) : (
 
        <>
          {/* RESUMO */}
          <section className={styles.summaryGrid}>
 
            <div className={styles.summaryCard}>
 
              <div className={styles.summaryIcon}>
                🛏
              </div>
 
              <div>
                <span className={styles.summaryLabel}>
                  QUARTOS ENCONTRADOS
                </span>
 
                <strong>
                  5 Unidades Disponíveis
                </strong>
              </div>
 
            </div>
 
            <div className={styles.summaryCard}>
 
              <div className={styles.summaryIcon}>
                ↕
              </div>
 
              <div>
                <span className={styles.summaryLabel}>
                  ORDENAR RESULTADOS
                </span>
 
                <strong>
                  Preço: Menor para Maior
                </strong>
              </div>
 
            </div>
 
          </section>
 
          {/* TABELA */}
          <section className={styles.resultsCard}>
 
            <h2>
              Unidades Operacionais Disponíveis
            </h2>
 
            <div className={styles.tableWrapper}>
 
              <table>
 
                <thead>
                  <tr>
                    <th>Quarto</th>
                    <th>Localização</th>
                    <th>Capacidade</th>
                    <th>Comodidades</th>
                    <th>Diária</th>
                    <th>Ação</th>
                  </tr>
                </thead>
 
                <tbody>
 
                  {quartos.map((quarto) => (
 
                    <tr key={quarto.id}>
 
                      <td>
                        <div className={styles.roomName}>
                          {quarto.nome}
                        </div>
 
                        <small>
                          {quarto.tipo}
                        </small>
                      </td>
 
                      <td>
                        {quarto.localizacao}
                      </td>
 
                      <td>
                        <span className={styles.capacity}>
                          ♙
                        </span>
 
                        {quarto.capacidade}
                      </td>
 
                      <td>
                        <span className={styles.amenities}>
                          {quarto.comodidades}
                        </span>
                      </td>
 
                      <td>
                        <strong className={styles.price}>
                          {quarto.diaria}
                        </strong>
                      </td>
 
                      <td>
 
                        <button
                          type="button"
                          className={styles.reserveButton}
                          onClick={() => handleReservar(quarto)}
                        >
                          Reservar
                        </button>
 
                      </td>
 
                    </tr>
 
                  ))}
 
                </tbody>
 
              </table>
 
            </div>
 
          </section>
        </>
 
      )}
 
      </div>
    </div>
  );
}