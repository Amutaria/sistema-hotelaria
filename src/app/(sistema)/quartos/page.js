"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { icons } from "../_components/icons";
import styles from "./quarto.module.css";

const statusClass = {
Livre: styles.badgeLivre,
Ocupado: styles.badgeOcupado,
Reservado: styles.badgeReservado,
Manutenção: styles.badgeManutencao,
};

export default function QuartosPage() {
const router = useRouter();

const [busca, setBusca] = useState("");
const [data, setData] = useState("2026-10-24");
const [filtro, setFiltro] = useState("Todos");
const [quartos, setQuartos] = useState([]);

const stats = [
  {
    title: "Total de Quartos",
    value: quartos.length,
    note: "unidades cadastradas",
    tone: "muted",
  },
  {
    title: "Quartos Livres",
    value: quartos.filter((q) => q.status === "Livre").length,
    note: "Disponíveis agora",
    tone: "green",
  },
  {
    title: "Quartos Ocupados",
    value: quartos.filter((q) => q.status === "Ocupado").length,
    note: "Check-ins ativos",
    tone: "red",
  },
  {
    title: "Quartos Reservados",
    value: quartos.filter((q) => q.status === "Reservado").length,
    note: "Reservas ativas",
    tone: "blue",
  },
  {
    title: "Em Manutenção",
    value: quartos.filter((q) => q.status === "Manutenção").length,
    note: "Necessitam atenção",
    tone: "orange",
  },
];

useEffect(() => {
async function carregarQuartos() {
try {
const resposta = await fetch("/api/quartos");
const dados = await resposta.json();

    setQuartos(dados);
  } catch (erro) {
    console.error("Erro ao carregar quartos:", erro);
  }
}

carregarQuartos();

}, []);

const quartosFiltrados = quartos.filter((q) => {
const matchBusca = String(q.numero).includes(busca.trim());
const matchStatus = filtro === "Todos" || q.status === filtro;

return matchBusca && matchStatus;

});

// Agrupa os quartos somente pelo andar.
const gruposPorAndar = quartosFiltrados.reduce((grupos, quarto) => {
const andar = quarto.andar || "Andar não informado";

if (!grupos[andar]) {
  grupos[andar] = [];
}

grupos[andar].push(quarto);

return grupos;

}, {});

return (
<>
<header className={styles.topbar}>
<span className={styles.topbarTitle}>
Hotel Grand Plaza / Central de Reservas
</span>

    <div className={styles.topbarUser}>
      <span>Admin Panel</span>
      <div className={styles.avatar} />
    </div>
  </header>

  <section className={styles.banner}>
    <span className={styles.breadcrumb}>
      Quartos &gt; Visão Geral
    </span>

    <h1 className={styles.bannerTitle}>Quartos Cadastrados</h1>

    <p className={styles.bannerText}>
      Consulte a disponibilidade, tarifas e gerencie os estados de todos
      os quartos do hotel.
    </p>
  </section>

  <div className={styles.content}>
    <div className={styles.statsGrid}>
      {stats.map((s) => (
        <div key={s.title} className={styles.statCard}>
          <span className={styles.statTitle}>{s.title}</span>

          <div className={styles.statRow}>
            <strong className={styles.statValue}>{s.value}</strong>

            <span
              className={`${styles.statNote} ${styles[s.tone]}`}
            >
              {s.note}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        {icons.search}

        <input
          type="text"
          placeholder="Buscar quarto (Ex: 101)..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <label className={styles.dateBox}>
        {icons.calendar}

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </label>

      <div className={styles.selectBox}>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="Todos">Todos os Status</option>
          <option value="Livre">Livre</option>
          <option value="Ocupado">Ocupado</option>
          <option value="Reservado">Reservado</option>
          <option value="Manutenção">Manutenção</option>
        </select>

        <span className={styles.selectIcon}>
          {icons.chevron}
        </span>
      </div>

      <button
        type="button"
        className={styles.newButton}
        onClick={() => router.push("/quartos/novo")}
      >
        {icons.plus}
        Novo Quarto
      </button>
    </div>

    {Object.entries(gruposPorAndar).map(
      ([andar, quartosDoAndar]) => (
        <section
          key={andar}
          className={styles.locationSection}
        >
          <h2 className={styles.sectionTitle}>{andar}</h2>

          <div className={styles.roomsGrid}>
            {quartosDoAndar.map((q) => (
              <div
                key={q.numero}
                className={styles.roomCard}
              >
                <div className={styles.roomHeader}>
                  <div>
                    <span className={styles.roomId}>
                      ID: {q.id}
                    </span>

                    <h3>Quarto {q.numero}</h3>
                  </div>

                  <span
                    className={`${styles.badge} ${
                      statusClass[q.status]
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <p className={styles.roomInfo}>
                  Tipo: <strong>{q.tipo}</strong>
                </p>

                <p className={styles.roomInfo}>
                  Capacidade:{" "}
                  <strong>{q.capacidade} pessoas</strong>
                </p>

                <p className={styles.roomInfo}>
                  Diária:{" "}
                  <strong className={styles.price}>
                    R$ {q.diaria}
                  </strong>
                </p>

                <p className={styles.roomInfo}>
                  Bloco:{" "}
                  <strong>
                    {q.bloco || "Não informado"}
                  </strong>
                </p>

                <button
                  type="button"
                  className={styles.detailsButton}
                  onClick={() =>
                    router.push(`/quartos/${q.id}`)
                  }
                >
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        </section>
      )
    )}
  </div>
</>

);
}