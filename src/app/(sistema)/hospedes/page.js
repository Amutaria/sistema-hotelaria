"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./hospedes.module.css";
 
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
  search: <Icon size={14}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>,
  plus: <Icon size={14}><path d="M12 5v14M5 12h14" /></Icon>,
  user: <Icon size={14}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" /></Icon>,
  eye: (
    <Icon size={14}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
};
 
/* ---------- Dados ---------- */
const hospedes = [
  {
    nome: "joao",
    cpf: "341.984.561-50",
    telefone: "3611986021",
    email: "joao@email.com",
  },
];
 
/* ---------- Página ---------- */
export default function Hospedes() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
 
  const termo = busca.trim().toLowerCase();
  const somenteNumeros = termo.replace(/\D/g, "");
 
  const filtrados = hospedes.filter((h) => {
    if (!termo) return true;
    return (
      h.nome.toLowerCase().includes(termo) ||
      h.email.toLowerCase().includes(termo) ||
      (somenteNumeros && h.cpf.replace(/\D/g, "").includes(somenteNumeros))
    );
  });
 
  return (
    <>
      {/* BARRA SUPERIOR */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>Hotel Grand Plaza / Central de Reservas</span>
        <div className={styles.topbarUser}>
<<<<<<< HEAD
          <span>Admin Painel</span>
=======
          <span>Admin Panel</span>
>>>>>>> 40e717404fc5c5ba33bb5dc459098b468dcbc1e7
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.breadcrumb}>Hóspedes &gt; Cadastrados</span>
        <h1 className={styles.bannerTitle}>Hóspedes Cadastrados</h1>
        <p className={styles.bannerText}>Consulte os hóspedes cadastrados no sistema do hotel.</p>
      </section>
 
      {/* CONTEÚDO */}
      <div className={styles.content}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Lista de Hóspedes</h2>
              <p className={styles.cardSubtitle}>
                Visualize as informações dos hóspedes cadastrados
              </p>
            </div>
 
            <button
              type="button"
              className={styles.newButton}
              onClick={() => router.push("/hospedes/novo")}
            >
              {icons.plus}
              Novo Cadastro
            </button>
          </div>
 
          <label className={styles.searchBox}>
            {icons.search}
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou e-mail..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>
 
          <div className={styles.guestList}>
            {filtrados.map((hospede) => (
              <div className={styles.guestRow} key={hospede.cpf}>
                <div className={styles.guestAvatar}>{icons.user}</div>
 
                <strong className={styles.guestName}>{hospede.nome}</strong>
 
                <div className={styles.guestInfo}>
                  <span>
                    <strong>CPF:</strong> {hospede.cpf}
                  </span>
                  <span>
                    <strong>Telefone:</strong> {hospede.telefone}
                  </span>
                  <span>
                    <strong>E-mail:</strong> {hospede.email}
                  </span>
                </div>
 
                <button
                  type="button"
                  className={styles.viewButton}
                  aria-label={`Ver detalhes de ${hospede.nome}`}
                >
                  {icons.eye}
                </button>
              </div>
            ))}
 
            {filtrados.length === 0 && (
              <p className={styles.empty}>Nenhum hóspede encontrado.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}