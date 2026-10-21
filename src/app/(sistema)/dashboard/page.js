import styles from "./dashboard.module.css";
 
const reservations = [
  {
    name: "Amanda Silveira",
    code: "#RES-4432",
    room: "Suíte 102",
    type: "Standard",
    checkin: "24/05/2024",
    status: "Confirmado",
  },
  {
    name: "Roberto Mendes",
    code: "#RES-3321",
    room: "Master 205",
    type: "Cobertura",
    checkin: "24/05/2024",
    status: "Aguardando",
  },
  {
    name: "Lucas Ferreira",
    code: "#RES-1234",
    room: "Standard 110",
    type: "Single",
    checkin: "25/05/2024",
    status: "Confirmado",
  },
];
 
export default function Dashboard() {
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
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={`${styles.statIcon} ${styles.blue}`}>▣</div>
                <span className={styles.positive}>+4%</span>
              </div>
              <span className={styles.statLabel}>Taxa de Ocupação</span>
              <strong className={styles.statValue}>78%</strong>
            </div>
 
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={`${styles.statIcon} ${styles.green}`}>✓</div>
                <span className={styles.negative}>-2</span>
              </div>
              <span className={styles.statLabel}>Quartos Disponíveis</span>
              <strong className={styles.statValue}>14</strong>
            </div>
 
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={`${styles.statIcon} ${styles.orange}`}>▣</div>
                <span className={styles.positive}>+3</span>
              </div>
              <span className={styles.statLabel}>Reservas Hoje</span>
              <strong className={styles.statValue}>08</strong>
            </div>
 
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={`${styles.statIcon} ${styles.purple}`}>♧</div>
                <span className={styles.normal}>Normal</span>
              </div>
              <span className={styles.statLabel}>Check-in / Out</span>
              <strong className={styles.statValue}>12 / 09</strong>
            </div>
 
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={`${styles.statIcon} ${styles.green}`}>↗</div>
                <span className={styles.positive}>+12%</span>
              </div>
              <span className={styles.statLabel}>Receita Diária</span>
              <strong className={styles.statValue}>R$ 4.250</strong>
            </div>
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
                <p>Distribuição atual por categorias de limpeza/uso</p>
              </div>
            </div>
 
            <div className={styles.roomStatus}>
              <div className={styles.statusRow}>
                <span><i className={styles.dotGreen}></i>Disponível</span>
                <div className={styles.statusBar}>
                  <div className={styles.barGreen} style={{ width: "44%" }} />
                </div>
                <strong>14</strong>
              </div>
 
              <div className={styles.statusRow}>
                <span><i className={styles.dotBlue}></i>Ocupado</span>
                <div className={styles.statusBar}>
                  <div className={styles.barBlue} style={{ width: "82%" }} />
                </div>
                <strong>32</strong>
              </div>
 
              <div className={styles.statusRow}>
                <span><i className={styles.dotOrange}></i>Limpeza</span>
                <div className={styles.statusBar}>
                  <div className={styles.barOrange} style={{ width: "11%" }} />
                </div>
                <strong>4</strong>
              </div>
 
              <div className={styles.statusRow}>
                <span><i className={styles.dotRed}></i>Manutenção</span>
                <div className={styles.statusBar}>
                  <div className={styles.barRed} style={{ width: "7%" }} />
                </div>
                <strong>2</strong>
              </div>
 
              <div className={styles.statusRow}>
                <span><i className={styles.dotGray}></i>Bloqueado</span>
                <div className={styles.statusBar}>
                  <div className={styles.barGray} style={{ width: "4%" }} />
                </div>
                <strong>1</strong>
              </div>
            </div>
 
            <div className={styles.totalRooms}>
              <span>Total de Quartos</span>
              <strong>53</strong>
            </div>
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
              <button className={styles.viewAll}>Ver todas</button>
            </div>
 
            <div className={styles.reservationTable}>
              <div className={styles.tableHeader}>
                <span>Hóspede</span>
                <span>Quarto</span>
                <span>Tipo</span>
                <span>Check-in</span>
                <span>Status</span>
              </div>
 
              {reservations.map((reservation) => (
                <div className={styles.tableRow} key={reservation.code}>
                  <div className={styles.guest}>
                    <strong>{reservation.name}</strong>
                    <small>{reservation.code}</small>
                  </div>
                  <span>{reservation.room}</span>
                  <span>{reservation.type}</span>
                  <span>{reservation.checkin}</span>
                  <span>
                    <b
                      className={
                        reservation.status === "Confirmado" ? styles.confirmed : styles.waiting
                      }
                    >
                      {reservation.status}
                    </b>
                  </span>
                </div>
              ))}
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