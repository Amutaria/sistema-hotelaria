"use client";

import { useState } from "react";
import styles from "./configuracoes.module.css";

/* Ícones SVG */
const Icon = ({ children, size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const icons = {
  sliders: (
    <Icon>
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
    </Icon>
  ),
  clock: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  ),
  check: (
    <Icon size={14}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),
};

/* Preferências */
const preferenciasIniciais = [
  {
    id: "novasReservas",
    titulo: "Notificações de novas reservas",
    descricao: "Avisar quando uma reserva for criada ou alterada",
    ativo: true,
  },
  {
    id: "checkin",
    titulo: "Alertas de check-in",
    descricao: "Lembretes para chegadas previstas no dia",
    ativo: true,
  },
  {
    id: "resumoDiario",
    titulo: "Resumo diário por e-mail",
    descricao: "Receber às 18h um consolidado das operações",
    ativo: false,
  },
];

/* Informações do sistema */
const infoSistema = [
  { label: "Versão do sistema", valor: "Grand Plaza v4.0.2" },
  { label: "Última sincronização", valor: "Hoje, 14:32" },
  { label: "Ambiente", valor: "Produção • Unidade São Paulo" },
];

export default function ConfiguracoesPage() {
  const [preferencias, setPreferencias] = useState(preferenciasIniciais);
  const [salvo, setSalvo] = useState(false);

  const alternarPreferencia = (id) => {
    setPreferencias((lista) =>
      lista.map((p) =>
        p.id === id ? { ...p, ativo: !p.ativo } : p
      )
    );
  };

  const salvar = () => {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>
          Hotel Grand Plaza / Central de Reservas
        </span>

        <div className={styles.topbarUser}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>

      <section className={styles.banner}>
        <span className={styles.bannerBreadcrumb}>
          Configurações &gt; Sistema
        </span>

        <h1 className={styles.bannerTitle}>Configurações</h1>

        <p className={styles.bannerText}>
          Gerencie suas preferências de uso e informações do sistema.
        </p>
      </section>

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Preferências */}
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>{icons.sliders}</span>

              <div>
                <h2 className={styles.panelTitle}>Preferências</h2>
                <p className={styles.panelSubtitle}>
                  Personalize notificações e comportamento do sistema
                </p>
              </div>
            </div>

            <div className={styles.preferences}>
              {preferencias.map((p) => (
                <div key={p.id} className={styles.preference}>
                  <div>
                    <strong>{p.titulo}</strong>
                    <span>{p.descricao}</span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={p.ativo}
                    aria-label={p.titulo}
                    className={`${styles.switch} ${
                      p.ativo ? styles.switchOn : ""
                    }`}
                    onClick={() => alternarPreferencia(p.id)}
                  >
                    <span className={styles.switchKnob} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Informações do sistema */}
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>{icons.clock}</span>

              <div>
                <h2 className={styles.panelTitle}>
                  Informações do Sistema
                </h2>
                <p className={styles.panelSubtitle}>
                  Dados técnicos da Central de Reservas
                </p>
              </div>
            </div>

            <dl className={styles.infoList}>
              {infoSistema.map((i) => (
                <div key={i.label}>
                  <dt>{i.label}</dt>
                  <dd>{i.valor}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={salvar}
        >
          {icons.check}
          {salvo ? "Alterações salvas" : "Salvar Alterações"}
        </button>
      </footer>
    </div>
  );
}
