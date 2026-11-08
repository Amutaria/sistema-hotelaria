"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { classeStatus } from "./dados";
import styles from "./detalhes.module.css";

/* ---------- Ícones (SVG inline) ---------- */
const Icon = ({ children, size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const iconeCama = (
  <Icon size={34}>
    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
  </Icon>
);

/* ---------- Página ---------- */
export default function DetalhesQuartoPage() {
  const { id } = useParams();

  const [quarto, setQuarto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarQuarto() {
      try {
        const resposta = await fetch(`/api/quartos/${id}`);

        if (!resposta.ok) {
          setQuarto(null);
          return;
        }

        const dados = await resposta.json();
        setQuarto(dados);
      } catch (erro) {
        console.error("Erro ao buscar quarto:", erro);
        setQuarto(null);
      } finally {
        setCarregando(false);
      }
    }

    carregarQuarto();
  }, [id]);

  if (carregando) {
    return <p>Carregando quarto...</p>;
  }

  return (
    <DetalhesQuarto
      key={quarto ? quarto.id : "nao-encontrado"}
      quarto={quarto}
      id={id}
    />
  );
}

function DetalhesQuarto({ quarto, id }) {
  const router = useRouter();
  const [semFoto, setSemFoto] = useState(false);

  async function excluirQuarto() {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o Quarto ${quarto.numero}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`/api/quartos/${quarto.id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        return;
      }

      alert("Quarto excluído com sucesso!");

      router.push("/quartos");
    } catch (erro) {
      console.error("Erro ao excluir quarto:", erro);
      alert("Erro ao excluir o quarto.");
    }
  }

  const titulo = quarto
    ? `Detalhes do Quarto ${quarto.numero}`
    : "Quarto não encontrado";

  return (
    <>
      {/* BARRA SUPERIOR */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>
          Hotel Grand Plaza / Central de Reservas
        </span>

        <div className={styles.topbarUser}>
          <span>Admin Panel</span>
          <div className={styles.avatar} />
        </div>
      </header>

      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.breadcrumb}>
          Quartos &gt; Cadastro &gt; Detalhes
        </span>

        <h1 className={styles.bannerTitle}>{titulo}</h1>

        <p className={styles.bannerText}>
          Exiba comodidades, tarifas bases definidas e histórico
          operacional recente do quarto.
        </p>
      </section>

      {/* QUARTO NÃO ENCONTRADO */}
      {!quarto ? (
        <div className={styles.content}>
          <section className={`${styles.card} ${styles.notFound}`}>
            <p>O quarto não foi encontrado.</p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => router.push("/quartos")}
            >
              Voltar para Quartos
            </button>
          </section>
        </div>
      ) : (
        <>
          
          <div className={styles.content}>
            {/* CARD DO QUARTO */}
            <section className={styles.card}>
              <div className={styles.photo}>
                {semFoto ? (
                  <div className={styles.photoPlaceholder}>
                    {iconeCama}
                  </div>
                ) : (
                  <Image
                    src={`/quartos/quarto-${quarto.numero}.jpg`}
                    alt={`Foto do Quarto ${quarto.numero}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    className={styles.photoImage}
                    onError={() => setSemFoto(true)}
                    priority
                  />
                )}
              </div>

              <div className={styles.roomHeader}>
                <h2>Quarto {quarto.numero}</h2>

                <span
                  className={`${styles.badge} ${
                    styles[classeStatus[quarto.status]]
                  }`}
                >
                  {quarto.status}
                </span>
              </div>

              <dl className={styles.infoList}>
                <div>
                  <dt>ID do Quarto:</dt>
                  <dd>{quarto.id}</dd>
                </div>

                <div>
                  <dt>Categoria:</dt>
                  <dd>{quarto.tipo}</dd>
                </div>

                <div>
                  <dt>Andar:</dt>
                 <dd>{quarto.andar || "—"}</dd>
                </div>
                <div>
                 <dt>Bloco:</dt>
                <dd>{quarto.bloco || "—"}</dd>
              </div>

                <div>
                  <dt>Diária Padrão:</dt>
                  <dd className={styles.price}>
                    {Number(quarto.diaria).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </dd>
                </div>

                <div>
                  <dt>Capacidade:</dt>
                  <dd>Até {quarto.capacidade} pessoas</dd>
                </div>
              </dl>

              <button
                type="button"
                className={`${styles.primaryButton} ${styles.statusButton}`}
                onClick={() =>
                  router.push(`/quartos/${quarto.id}/status`)
                }
              >
                Alterar Status do Quarto
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() =>
                  router.push(`/quartos/${quarto.id}/editar`)
                }
              >
                Editar Cadastro
              </button>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={excluirQuarto}
              >
                Excluir Cadastro
              </button>
            </section>

            <div className={styles.rightColumn}>
              {/* COMODIDADES */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                  Comodidades Vinculadas
                </h2>

                {(quarto.comodidades || []).length > 0 ? (
                  <div className={styles.tags}>
                    {(quarto.comodidades || []).map((c) => (
                      <span key={c} className={styles.tag}>
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.empty}>
                    Nenhuma comodidade cadastrada.
                  </p>
                )}
              </section>

              {/* HISTÓRICO */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                  Histórico de Ocupação Recente
                </h2>

                {(quarto.historico || []).length > 0 ? (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Período</th>
                          <th>Hóspede Responsável</th>
                          <th>Status</th>
                          <th className={styles.alignRight}>
                            Tarifa
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {(quarto.historico || []).map((h) => (
                          <tr
                            key={`${h.periodo}-${h.hospede}`}
                          >
                            <td>{h.periodo}</td>

                            <td className={styles.guest}>
                              {h.hospede}
                            </td>

                            <td>
                              <span
                                className={`${styles.badge} ${
                                  styles.badgeWide
                                } ${
                                  styles[classeStatus[h.status]]
                                }`}
                              >
                                {h.status}
                              </span>
                            </td>

                            <td
                              className={`${styles.price} ${styles.alignRight}`}
                            >
                              {h.tarifa}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={styles.empty}>
                    Este quarto ainda não possui histórico de
                    ocupação.
                  </p>
                )}
              </section>
            </div>
          </div>
          
        <div className={styles.bottomActions}>
        <button
            type="button"
         className={styles.backButton}
    onClick={() => router.push("/quartos")}
  >
    ← Voltar para Quartos
  </button>
</div>
        </>
      )}
    </>
  );
}
