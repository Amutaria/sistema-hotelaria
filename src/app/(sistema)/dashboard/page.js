
"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [quartos, setQuartos] = useState([]);
  const [carregandoQuartos, setCarregandoQuartos] = useState(true);
  const [erroQuartos, setErroQuartos] = useState("");

  const [reservations, setReservations] = useState([]);
  const [carregandoReservas, setCarregandoReservas] = useState(true);
  const [erroReservas, setErroReservas] = useState("");

  // Indicadores de desempenho
  const [indicadores, setIndicadores] = useState(null);
  const [carregandoIndicadores, setCarregandoIndicadores] = useState(true);
  const [erroIndicadores, setErroIndicadores] = useState("");
  // Gráfico de ocupação histórica
  const [periodoOcupacao, setPeriodoOcupacao] = useState("7d");
  const [dadosOcupacao, setDadosOcupacao] = useState([]);
  const [carregandoOcupacao, setCarregandoOcupacao] = useState(true);
  const [erroOcupacao, setErroOcupacao] = useState("");
  const [pontoSelecionado, setPontoSelecionado] = useState(null);

  const router = useRouter();
  // NOVO: buscar indicadores do dashboard
  useEffect(() => {
    let ativo = true;

    async function buscarIndicadores() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os indicadores.");
        }

        const dados = await response.json();

        if (ativo) {
          setIndicadores(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar indicadores:", error);

        if (ativo) {
          setErroIndicadores("Não foi possível carregar os indicadores.");
        }
      } finally {
        if (ativo) {
          setCarregandoIndicadores(false);
        }
      }
    }

    buscarIndicadores();

    return () => {
      ativo = false;
    };
  }, []);

    // Buscar dados históricos de ocupação
  useEffect(() => {
    let ativo = true;

    async function buscarOcupacao() {
      setCarregandoOcupacao(true);
      setErroOcupacao("");
      setPontoSelecionado(null);

      try {
        const response = await fetch(
          `/api/dashboard/ocupacao?periodo=${periodoOcupacao}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar a ocupação.");
        }

        const dados = await response.json();

        if (ativo) {
          setDadosOcupacao(dados.pontos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar ocupação:", error);

        if (ativo) {
          setErroOcupacao("Não foi possível carregar o gráfico.");
          setDadosOcupacao([]);
        }
      } finally {
        if (ativo) {
          setCarregandoOcupacao(false);
        }
      }
    }

    buscarOcupacao();

    return () => {
      ativo = false;
    };
  }, [periodoOcupacao]);

  // PRIMEIRO useEffect que já existia (buscar quartos)
  useEffect(() => {
    let ativo = true;
    
    async function buscarQuartos() {
      try {
        const response = await fetch("/api/quartos", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os quartos.");
        }

        const dados = await response.json();

        if (!Array.isArray(dados)) {
          throw new Error("Os dados dos quartos são inválidos.");
        }

        if (ativo) {
          setQuartos(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar quartos:", error);

        if (ativo) {
          setErroQuartos("Não foi possível carregar os status dos quartos.");
        }
      } finally {
        if (ativo) {
          setCarregandoQuartos(false);
        }
      }
    }

    buscarQuartos();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function buscarReservas() {
      try {
        const response = await fetch("/api/reservas", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar as reservas.");
        }

        const dados = await response.json();

        if (!Array.isArray(dados)) {
          throw new Error("Os dados das reservas são inválidos.");
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const proximasReservas = dados
          .filter((reserva) => {
            if (!reserva.dataEntrada || reserva.status === "Cancelada") {
              return false;
            }

            const dataEntrada = new Date(
              `${reserva.dataEntrada}T00:00:00`
            );

            return (
              !Number.isNaN(dataEntrada.getTime()) &&
              dataEntrada >= hoje
            );
          })
          .sort((a, b) => {
            return (
              new Date(`${a.dataEntrada}T00:00:00`) -
              new Date(`${b.dataEntrada}T00:00:00`)
            );
          })
          .slice(0, 3);

        if (ativo) {
          setReservations(proximasReservas);
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);

        if (ativo) {
          setErroReservas("Não foi possível carregar as próximas reservas.");
        }
      } finally {
        if (ativo) {
          setCarregandoReservas(false);
        }
      }
    }

    buscarReservas();

    return () => {
      ativo = false;
    };
  }, []);

  const formatarData = (data) => {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataTooltip = (data) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const totalQuartos = quartos.length;

  const contarStatus = (status) => {
    return quartos.filter((quarto) => quarto.status === status).length;
  };

  const porcentagem = (quantidade) => {
    return totalQuartos > 0
      ? (quantidade / totalQuartos) * 100
      : 0;
  };

  const quartosLivres = contarStatus("Livre");
  const quartosOcupados = contarStatus("Ocupado");
  const quartosReservados = contarStatus("Reservado");
  const quartosManutencao = contarStatus("Manutenção");

  return (
    <div className={styles.dashboard}>
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
        <span className={styles.breadcrumb}>Dashboard &gt; Visão Geral</span>
        <h1 className={styles.bannerTitle}>Painel de Controle</h1>
        <p className={styles.bannerText}>Gerencie e acompanhe o desempenho em tempo real</p>
      </section>

      <section className={styles.mainContent}>

        {/* INDICADORES */}
        <section>
          <h2 className={styles.sectionTitle}>Indicadores de Desempenho</h2>

          <div className={styles.statsGrid}>
            {indicadores && (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>%</div>
                    <span className={styles.normal}>Agora</span>
                  </div>
                  <span className={styles.statLabel}>Taxa de Ocupação</span>
                  <strong className={styles.statValue}>
                    {indicadores.taxaOcupacao}%
                  </strong>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={`${styles.statIcon} ${styles.green}`}>✓</div>
                    <span className={styles.normal}>Agora</span>
                  </div>
                  <span className={styles.statLabel}>Quartos Disponíveis</span>
                  <strong className={styles.statValue}>
                    {indicadores.quartosDisponiveis}
                  </strong>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={`${styles.statIcon} ${styles.orange}`}>▣</div>
                    <span className={styles.normal}>Hoje</span>
                  </div>
                  <span className={styles.statLabel}>Reservas Hoje</span>
                  <strong className={styles.statValue}>
                    {indicadores.reservasHoje}
                  </strong>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={`${styles.statIcon} ${styles.purple}`}>♧</div>
                    <span className={styles.normal}>Hoje</span>
                  </div>
                  <span className={styles.statLabel}>Check-in / Out</span>
                  <strong className={styles.statValue}>
                    {indicadores.checkinsHoje} / {indicadores.checkoutsHoje}
                  </strong>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={`${styles.statIcon} ${styles.green}`}>↗</div>
                    <span className={styles.normal}>Hoje</span>
                  </div>
                  <span className={styles.statLabel}>Receita Diária</span>
                  <strong className={styles.statValue}>
                    {Number(indicadores.receitaDiaria).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
              </>
            )}
          </div>
        </section>

        {/* GRÁFICOS */}
        <section className={styles.middleGrid}>


          {/* OCUPAÇÃO */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Histórico de Ocupação</h2>
                <p>Percentual de ocupação dos quartos</p>
              </div>
            </div>

            <div className={styles.occupancyFilters}>
              {[
                { valor: "7d", texto: "7 dias" },
                { valor: "1m", texto: "1 mês" },
                { valor: "3m", texto: "3 meses" },
                { valor: "6m", texto: "6 meses" },
                { valor: "1a", texto: "1 ano" },
              ].map((filtro) => (
                <button
                  key={filtro.valor}
                  type="button"
                  className={
                    periodoOcupacao === filtro.valor
                      ? styles.occupancyFilterActive
                      : styles.occupancyFilter
                  }
                  onClick={() => setPeriodoOcupacao(filtro.valor)}
                  disabled={carregandoOcupacao}
                >
                  {filtro.texto}
                </button>
              ))}
            </div>

            {carregandoOcupacao ? (
              <p>Carregando histórico de ocupação...</p>
            ) : erroOcupacao ? (
              <p>{erroOcupacao}</p>
            ) : dadosOcupacao.length === 0 ? (
              <p>Não existem dados de ocupação para este período.</p>
            ) : (
              <div className={styles.chart}>
                <div className={styles.chartGrid}>
                  {[100, 75, 50, 25, 0].map((valor) => (
                    <span
                      key={valor}
                      style={{
                        top: `${5 + ((100 - valor) / 100) * 160}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      {valor}%
                    </span>
                  ))}
                </div>

                <div className={styles.chartArea}>
                  <svg
                    viewBox="0 0 600 170"
                    preserveAspectRatio="none"
                    className={styles.chartSvg}
                  >
                    <defs>
                      <linearGradient
                        id="occupancyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b8ff3"
                          stopOpacity="0.20"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b8ff3"
                          stopOpacity="0.02"
                        />
                      </linearGradient>
                    </defs>

                    {(() => {
                      const largura = 540;
                      const altura = 160;
                      const margemVertical = 5;

                      const pontos = dadosOcupacao.map((ponto, index) => {
                        const x =
                          dadosOcupacao.length === 1
                            ? 300
                            : 30 +
                              (index / (dadosOcupacao.length - 1)) *
                                largura;

                        const y =
                          margemVertical +
                          ((100 - Math.max(0, Math.min(100, ponto.ocupacao))) /
                            100) *
                            altura;

                        return { x, y, dados: ponto };
                      });

                      const linha = pontos
                        .map((ponto) => `${ponto.x},${ponto.y}`)
                        .join(" ");

                      const baseGrafico = margemVertical + altura;
                      const area = `30,${baseGrafico} ${linha} ${
                        pontos[pontos.length - 1].x
                      },${baseGrafico}`;

                      return (
                        <>
                          {[5, 45, 85, 125, 165].map((y) => (
                            <line
                              key={y}
                              x1="0"
                              y1={y}
                              x2="600"
                              y2={y}
                              stroke="#dfe5ec"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                          ))}

                          <polygon
                            points={area}
                            fill="url(#occupancyGradient)"
                          />

                          <polyline
                            points={linha}
                            fill="none"
                            stroke="#3b8ff3"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {pontos.map((ponto, index) => (
                            <circle
                              key={index}
                              cx={ponto.x}
                              cy={ponto.y}
                              r={pontoSelecionado?.index === index ? "5.5" : "3.5"}
                              fill="#3b8ff3"
                              tabIndex="0"
                              role="img"
                              aria-label={`Ocupação de ${ponto.dados.label}: ${ponto.dados.ocupacao}%`}
                              onMouseEnter={() =>
                                setPontoSelecionado({ index, ...ponto })
                              }
                              onMouseLeave={() => setPontoSelecionado(null)}
                              onFocus={() =>
                                setPontoSelecionado({ index, ...ponto })
                              }
                              onBlur={() => setPontoSelecionado(null)}
                            />
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {pontoSelecionado && (
                    <div
                      className={styles.chartTooltip}
                      style={{
                        left: `${Math.min(85, Math.max(15, (pontoSelecionado.x / 600) * 100))}%`,
                        top: `${(pontoSelecionado.y / 170) * 100}%`,
                      }}
                      role="status"
                    >
                      <strong>
                        {pontoSelecionado.dados.data === pontoSelecionado.dados.dataFim
                          ? formatarDataTooltip(pontoSelecionado.dados.data)
                          : `${formatarDataTooltip(pontoSelecionado.dados.data)} – ${formatarDataTooltip(pontoSelecionado.dados.dataFim)}`}
                      </strong>
                      <span>Ocupação: {pontoSelecionado.dados.ocupacao}%</span>
                      <span>
                        {pontoSelecionado.dados.data === pontoSelecionado.dados.dataFim
                          ? "Quartos ocupados:"
                          : "Média de quartos ocupados:"}{" "}
                        {pontoSelecionado.dados.quartosOcupados}
                      </span>
                      <span>
                        Total de quartos: {pontoSelecionado.dados.totalQuartos}
                      </span>
                    </div>
                  )}

                  <div className={styles.chartValues}>
                    {dadosOcupacao.map((ponto, index) => {
                      const intervalo = Math.ceil(dadosOcupacao.length / 6);

                      const mostrarValor =
                        index === 0 ||
                        index === dadosOcupacao.length - 1 ||
                        index % intervalo === 0;

                      if (!mostrarValor) return null;

                      const x =
                        dadosOcupacao.length === 1
                          ? 300
                          : 30 +
                            (index / (dadosOcupacao.length - 1)) * 540;
                      const y =
                        5 +
                        ((100 - Math.max(0, Math.min(100, ponto.ocupacao))) /
                          100) *
                          160;
                      const pertoDaBordaDireita = x > 500;

                      return (
                        <span
                          key={`${ponto.label}-${index}`}
                          style={{
                            left: `${(x / 600) * 100}%`,
                            top: `${(y / 170) * 100}%`,
                            transform: "translate(-50%, calc(-100% - 7px))",
                          }}
                        >
                          {ponto.ocupacao}%
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.days}>
                  {dadosOcupacao.map((ponto, index) => {
                    const intervalo = Math.ceil(dadosOcupacao.length / 6);

                    const mostrarData =
                      index === 0 ||
                      index === dadosOcupacao.length - 1 ||
                      index % intervalo === 0;

                    if (!mostrarData) return null;

                    const x =
                      dadosOcupacao.length === 1
                        ? 300
                        : 30 +
                          (index / (dadosOcupacao.length - 1)) * 540;

                    return (
                      <span
                        key={`${ponto.label}-${index}`}
                        style={{
                          left: `${(x / 600) * 100}%`,
                          transform:
                            index === 0
                              ? "translateX(0)"
                              : index === dadosOcupacao.length - 1
                                ? "translateX(-100%)"
                                : "translateX(-50%)",
                        }}
                      >
                        {ponto.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Status dos Quartos</h2>
                <p>Distribuição atual dos quartos por status</p>
              </div>
            </div>

            {carregandoQuartos ? (
              <p>Carregando status dos quartos...</p>
            ) : erroQuartos ? (
              <p>{erroQuartos}</p>
            ) : (
              <>
                <div className={styles.roomStatus}>
                  <div className={styles.statusRow}>
                    <span><i className={styles.dotGreen}></i>Livre</span>
                    <div className={styles.statusBar}>
                      <div
                        className={styles.barGreen}
                        style={{ width: `${porcentagem(quartosLivres)}%` }}
                      />
                    </div>
                    <strong>{quartosLivres}</strong>
                  </div>

                  <div className={styles.statusRow}>
                    <span><i className={styles.dotRed}></i>Ocupado</span>
                    <div className={styles.statusBar}>
                      <div
                        className={styles.barRed}
                        style={{ width: `${porcentagem(quartosOcupados)}%` }}
                      />
                    </div>
                    <strong>{quartosOcupados}</strong>
                  </div>

                  <div className={styles.statusRow}>
                    <span><i className={styles.dotBlue}></i>Reservado</span>
                    <div className={styles.statusBar}>
                      <div
                        className={styles.barBlue}
                        style={{ width: `${porcentagem(quartosReservados)}%` }}
                      />
                    </div>
                    <strong>{quartosReservados}</strong>
                  </div>

                  <div className={styles.statusRow}>
                    <span><i className={styles.dotOrange}></i>Manutenção</span>
                    <div className={styles.statusBar}>
                      <div
                        className={styles.barOrange}
                        style={{ width: `${porcentagem(quartosManutencao)}%` }}
                      />
                    </div>
                    <strong>{quartosManutencao}</strong>
                  </div>
                </div>

                <div className={styles.totalRooms}>
                  <span>Total de Quartos</span>
                  <strong>{totalQuartos}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        {/* RESERVAS + ALERTAS */}
        <section className={styles.bottomGrid}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Próximas Reservas</h2>
                <p>Hóspedes aguardados para os próximos dias</p>
              </div>
              <button 
              className={styles.viewAll}
              onClick={() => router.push("/reservas")}
              >
                Ver todas
              </button>
            </div>

            <div className={styles.reservationTable}>
              <div className={styles.tableHeader}>
                <span>Hóspede</span>
                <span>Quarto</span>
                <span>Tipo</span>
                <span>Check-in</span>
                <span>Status</span>
              </div>

              {carregandoReservas ? (
                <p>Carregando próximas reservas...</p>
              ) : erroReservas ? (
                <p>{erroReservas}</p>
              ) : reservations.length === 0 ? (
                <p>Não existem próximas reservas.</p>
              ) : (
                reservations.map((reservation) => (
                  <div className={styles.tableRow} key={reservation.id}>
                    <div className={styles.guest}>
                      <strong>{reservation.hospede?.nome || "Hóspede"}</strong>
                      <small>{reservation.codigo || `Reserva ${reservation.id}`}</small>
                    </div>

                    <span>{reservation.quartoNumero}</span>

                    <span>{reservation.quartoTipo}</span>

                    <span>{formatarData(reservation.dataEntrada)}</span>

                    <span>
                      <b
                        className={
                          reservation.status === "Confirmada" ||
                          reservation.status === "Confirmado"
                            ? styles.confirmed
                            : styles.waiting
                        }
                      >
                        {reservation.status}
                      </b>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ALERTAS */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Atividades e Alertas</h2>
                <p>Notificações operacionais em tempo real</p>
              </div>
            </div>

            <div className={styles.alerts}>
              <div className={`${styles.alert} ${styles.warning}`}>
                <div className={styles.alertIcon}>!</div>
                <div>
                  <strong>Quarto 204 necessita de manutenção urgente</strong>
                  <span>Ar-condicionado</span>
                  <small>há 15 minutos</small>
                </div>
              </div>

              <div className={`${styles.alert} ${styles.info}`}>
                <div className={styles.alertIcon}>♧</div>
                <div>
                  <strong>Nova reserva recebida via Booking.com para Suíte Master</strong>
                  <small>há 20 minutos</small>
                </div>
              </div>
            </div>
          </div>
        </section>

      </section>
    </div>
  );
}
