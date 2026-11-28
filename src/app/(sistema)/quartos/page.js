
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { icons } from "../_components/icons";
import { createClient } from "../../lib/supabase/client";
import styles from "./quarto.module.css";

const statusClass = {
  Livre: styles.badgeLivre,
  Ocupado: styles.badgeOcupado,
  Reservado: styles.badgeReservado,
  Manutenção: styles.badgeManutencao,
};

const roomCardStatus = {
  Livre: styles.roomCardLivre,
  Ocupado: styles.roomCardOcupado,
  Reservado: styles.roomCardReservado,
  Manutenção: styles.roomCardManutencao,
};

// Retorna a data atual no formato AAAA-MM-DD
function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// Formata a data para DD/MM/AAAA
function formatarData(valor) {
  if (!valor) return "Não informada";

  const texto = String(valor).split("T")[0];
  const partes = texto.split("-");

  if (partes.length !== 3) return texto;

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

// Formata a data e hora do cadastro da reserva
function formatarDataHora(valor) {
  if (!valor) return "Não informada";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não informada";
  }

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function QuartosPage() {
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [data, setData] = useState(obterDataAtual());
  const [dataSaida, setDataSaida] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function carregarPerfil() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("perfis")
        .select("perfil")
        .single();

      if (error) {
        console.error("Erro ao carregar perfil:", error.message);
        return;
      }

      setPerfil(data?.perfil ?? null);
    }

    carregarPerfil();
  }, []);

  // Carrega os quartos e as reservas
  useEffect(() => {
    async function carregarDados() {
      try {
        const [respostaQuartos, respostaReservas] = await Promise.all([
          fetch("/api/quartos"),
          fetch("/api/reservas"),
        ]);

        if (!respostaQuartos.ok || !respostaReservas.ok) {
          throw new Error("Não foi possível carregar os dados.");
        }

        const [dadosQuartos, dadosReservas] = await Promise.all([
          respostaQuartos.json(),
          respostaReservas.json(),
        ]);

        setQuartos(Array.isArray(dadosQuartos) ? dadosQuartos : []);
        setReservas(Array.isArray(dadosReservas) ? dadosReservas : []);
      } catch (erro) {
        console.error("Erro ao carregar quartos e reservas:", erro);
      }
    }

    carregarDados();
  }, []);

  // Relaciona cada quarto com sua reserva
  const quartosComReservas = quartos.map((quarto) => {
    const reservasDoQuarto = reservas
      .filter((reserva) => {
        return (
          Number(reserva.quartoId) === Number(quarto.id) &&
          ["Confirmada", "Em hospedagem"].includes(reserva.status)
        );
      })
      .sort((a, b) => {
        return a.dataEntrada.localeCompare(b.dataEntrada);
      });

    // Verifica se existe uma reserva para a data selecionada
    const reservaDaData = reservasDoQuarto.find((reserva) => {
      return (
        reserva.dataEntrada <= data &&
        reserva.dataSaida > data
      );
    });

    // Se não houver reserva nessa data, procura a próxima reserva
    const proximaReserva = reservasDoQuarto.find((reserva) => {
      return reserva.dataEntrada > data;
    });

    const reservaExibida = reservaDaData || proximaReserva || null;

    // Se o quarto está livre, mas possui uma reserva para a data
    // selecionada, exibe Reservado.
    const statusExibido =
      quarto.status === "Livre" && reservaDaData
        ? "Reservado"
        : quarto.status;

    return {
      ...quarto,
      statusExibido,
      reservaExibida,
    };
  });

  // Indicadores
  const stats = [
    {
      title: "Total de Quartos",
      value: quartosComReservas.length,
      note: "unidades cadastradas",
      tone: "muted",
    },
    {
      title: "Quartos Livres",
      value: quartosComReservas.filter(
        (q) => q.statusExibido === "Livre"
      ).length,
      note: "Disponíveis agora",
      tone: "green",
    },
    {
      title: "Quartos Ocupados",
      value: quartosComReservas.filter(
        (q) => q.statusExibido === "Ocupado"
      ).length,
      note: "Check-ins ativos",
      tone: "red",
    },
    {
      title: "Quartos Reservados",
      value: quartosComReservas.filter(
        (q) => q.statusExibido === "Reservado"
      ).length,
      note: "Reservas ativas",
      tone: "blue",
    },
    {
      title: "Em Manutenção",
      value: quartosComReservas.filter(
        (q) => q.statusExibido === "Manutenção"
      ).length,
      note: "Necessitam atenção",
      tone: "orange",
    },
  ];

  // Pesquisa e filtro por status
  const quartosFiltrados = quartosComReservas.filter((q) => {
    const matchBusca = String(q.numero).includes(busca.trim());

    const matchStatus =
      filtro === "Todos" || q.statusExibido === filtro;

    return matchBusca && matchStatus;
  });

  // Agrupa os quartos pelo andar
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
          <span>
            {perfil === "admin"
              ? "Administrador"
              : perfil === "colaborador"
                ? "Colaborador"
                : "Usuário"}
          </span>
          <div className={styles.avatar} />
        </div>
      </header>

      <section className={styles.banner}>
        <span className={styles.breadcrumb}>
          Quartos &gt; Visão Geral
        </span>

        <h1 className={styles.bannerTitle}>
          Quartos Cadastrados
        </h1>

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
                <strong className={styles.statValue}>
                  {s.value}
                </strong>

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

          <div className={styles.dateField}>
            <span className={styles.dateLabel}>
              Data de entrada
            </span>

            <label className={styles.dateBox}>
              {icons.calendar}

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.dateField}>
            <span className={styles.dateLabel}>
              Data de saída
            </span>

            <label className={styles.dateBox}>
              {icons.calendar}

              <input
                type="date"
                value={dataSaida}
                onChange={(e) => setDataSaida(e.target.value)}
              />
            </label>
          </div>

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
              <h2 className={styles.sectionTitle}>
                {andar}
              </h2>

              <div className={styles.roomsGrid}>
                {quartosDoAndar.map((q) => (
                  <div
                    key={q.id}
                    className={`${styles.roomCard} ${
                      roomCardStatus[q.statusExibido] || ""
                    }`}
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
                          statusClass[q.statusExibido] || ""
                        }`}
                      >
                        {q.statusExibido}
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

                    {/* INFORMAÇÕES DA RESERVA */}
                    {q.reservaExibida && (
                      <div className={styles.roomInfo}>
                        <p>
                          Hóspede:{" "}
                          <strong>
                            {q.reservaExibida.hospede?.nome ||
                              "Não informado"}
                          </strong>
                        </p>

                        <p>
                          Código:{" "}
                          <strong>
                            {q.reservaExibida.codigo || "Não informado"}
                          </strong>
                        </p>

                        <p>
                          Reserva realizada em:{" "}
                          <strong>
                            {formatarDataHora(
                              q.reservaExibida.criadoEm
                            )}
                          </strong>
                        </p>

                        <p>
                          Check-in:{" "}
                          <strong>
                            {formatarData(
                              q.reservaExibida.dataEntrada
                            )}
                          </strong>
                        </p>

                        <p>
                          Check-out:{" "}
                          <strong>
                            {formatarData(
                              q.reservaExibida.dataSaida
                            )}
                          </strong>
                        </p>
                      </div>
                    )}

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
