
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
                <h2>Ocupação Semanal</h2>
                <p>Percentual de ocupação dos últimos 7 dias</p>
              </div>
              <span className={styles.period}>Semana Atual</span>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartGrid}>
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
              </div>

              <div className={styles.chartArea}>
                <svg viewBox="0 0 600 180" preserveAspectRatio="none" className={styles.chartSvg}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b8ff3" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#3b8ff3" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <polygon
                    points="20,105 110,118 200,82 290,65 380,54 470,45 560,93 560,170 20,170"
                    fill="url(#areaGradient)"
                  />
                  <polyline
                    points="20,105 110,118 200,82 290,65 380,54 470,45 560,93"
                    fill="none"
                    stroke="#3b8ff3"
                    strokeWidth="2.5"
                  />

                  <circle cx="20" cy="105" r="3" fill="#3b8ff3" />
                  <circle cx="110" cy="118" r="3" fill="#3b8ff3" />
                  <circle cx="200" cy="82" r="3" fill="#3b8ff3" />
                  <circle cx="290" cy="65" r="3" fill="#3b8ff3" />
                  <circle cx="380" cy="54" r="3" fill="#3b8ff3" />
                  <circle cx="470" cy="45" r="3" fill="#3b8ff3" />
                  <circle cx="560" cy="93" r="3" fill="#3b8ff3" />
                </svg>

                <div className={styles.chartValues}>
                  <span style={{ left: "2%" }}>62%</span>
                  <span style={{ left: "18%" }}>58%</span>
                  <span style={{ left: "34%" }}>72%</span>
                  <span style={{ left: "50%" }}>84%</span>
                  <span style={{ left: "65%" }}>90%</span>
                  <span style={{ left: "81%" }}>93%</span>
                  <span style={{ left: "96%" }}>70%</span>
                </div>
              </div>

              <div className={styles.days}>
                <span>SEG</span>
                <span>TER</span>
                <span>QUA</span>
                <span>QUI</span>
                <span>SEX</span>
                <span>SÁB</span>
                <span>DOM</span>
              </div>
            </div>
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
