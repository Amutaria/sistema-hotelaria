"use client";
 
import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import styles from "./configuracoes.module.css";
 
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });
 
/* ---------- Ícones (SVG inline) ---------- */
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
  user: <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" /></Icon>,
  sliders: (
    <Icon>
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
    </Icon>
  ),
  clock: <Icon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>,
  chevronDown: <Icon size={12}><path d="m6 9 6 6 6-6" /></Icon>,
  logout: (
    <Icon size={14}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </Icon>
  ),
  check: <Icon size={14}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Icon>,
};
 
/* ---------- Dados ---------- */
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
 
const infoSistema = [
  { label: "Versão do sistema", valor: "Grand Plaza v4.0.2" },
  { label: "Última sincronização", valor: "Hoje, 14:32" },
  { label: "Ambiente", valor: "Produção • Unidade São Paulo" },
];
 
/* ---------- Página ---------- */
export default function ConfiguracoesPage() {
  const [perfil, setPerfil] = useState({
    nome: "Mariana Alves Costa",
    cargo: "Supervisora de Reservas",
    email: "mariana.costa@grandplaza.com.br",
    telefone: "(11) 98765-4310",
    idioma: "pt-BR",
  });
  const [preferencias, setPreferencias] = useState(preferenciasIniciais);
  const [salvo, setSalvo] = useState(false);
 
  const atualizarPerfil = (campo) => (e) =>
    setPerfil((p) => ({ ...p, [campo]: e.target.value }));
 
  const alternarPreferencia = (id) =>
    setPreferencias((lista) =>
      lista.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    );
 
  const salvar = () => {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };
 
  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>Hotel Grand Plaza / Central de Reservas</span>
        <div className={styles.topbarUser}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.bannerBreadcrumb}>Configurações &gt; Conta</span>
        <h1 className={styles.bannerTitle}>Configurações</h1>
        <p className={styles.bannerText}>
          Gerencie seus dados, preferências de uso e informações da conta.
        </p>
      </section>
 
      <div className={styles.content}>
 
        <div className={styles.grid}>
          {/* Perfil */}
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>{icons.user}</span>
              <div>
                <h2 className={styles.panelTitle}>Perfil do Funcionário</h2>
                <p className={styles.panelSubtitle}>
                  Dados usados na identificação e comunicação interna
                </p>
              </div>
            </div>
 
            <div className={styles.profile}>
              <div className={`${styles.initials} ${playfair.className}`}>MC</div>
              <div>
                <strong className={styles.profileName}>Mariana Costa</strong>
                <span className={styles.profileRole}>
                  Supervisora de Reservas • Matrícula GP-0248
                </span>
              </div>
            </div>
 
            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" value={perfil.nome} onChange={atualizarPerfil("nome")} />
              </div>
 
              <div className={styles.field}>
                <label htmlFor="cargo">Cargo</label>
                <input id="cargo" value={perfil.cargo} onChange={atualizarPerfil("cargo")} />
              </div>
 
              <div className={styles.field}>
                <label htmlFor="email">E-mail corporativo</label>
                <input
                  id="email"
                  type="email"
                  value={perfil.email}
                  onChange={atualizarPerfil("email")}
                />
              </div>
 
              <div className={styles.field}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="tel"
                  value={perfil.telefone}
                  onChange={atualizarPerfil("telefone")}
                />
              </div>
 
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="idioma">Idioma da interface</label>
                <div className={styles.selectBox}>
                  <select id="idioma" value={perfil.idioma} onChange={atualizarPerfil("idioma")}>
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                  <span className={styles.selectIcon}>{icons.chevronDown}</span>
                </div>
                <small className={styles.helper}>
                  As alterações de idioma serão aplicadas no próximo acesso.
                </small>
              </div>
            </div>
          </section>
 
          <div className={styles.sideColumn}>
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
                      className={`${styles.switch} ${p.ativo ? styles.switchOn : ""}`}
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
                  <h2 className={styles.panelTitle}>Informações do Sistema</h2>
                  <p className={styles.panelSubtitle}>Dados técnicos da Central de Reservas</p>
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
      </div>
 
      {/* Rodapé de ações */}
      <footer className={styles.footer}>
        <button type="button" className={styles.logoutButton}>
          {icons.logout}
          Sair da Conta
        </button>
        <button type="button" className={styles.saveButton} onClick={salvar}>
          {icons.check}
          {salvo ? "Alterações salvas" : "Salvar Alterações"}
        </button>
      </footer>
    </div>
  );
}