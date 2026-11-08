"use client";
 
import { useState } from "react";
import styles from "./financeiro.module.css";
 
/* ---------- Ícones (SVG inline) ---------- */
const Icon = ({ children, size = 16, stroke = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);
 
const icons = {
  arrowUpRight: <Icon><path d="M7 17 17 7M7 7h10v10" /></Icon>,
  arrowDownRight: <Icon><path d="m7 7 10 10M17 7v10H7" /></Icon>,
  wallet: (
    <Icon>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </Icon>
  ),
  clock: <Icon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>,
  calendar: (
    <Icon size={14}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
  ),
  chevronDown: <Icon size={12}><path d="m6 9 6 6 6-6" /></Icon>,
  chevronRight: <Icon size={14}><path d="m9 18 6-6-6-6" /></Icon>,
  arrowRight: <Icon size={13}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>,
  plus: <Icon size={14}><path d="M12 5v14M5 12h14" /></Icon>,
  bed: <Icon size={15}><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></Icon>,
  utensils: (
    <Icon size={15}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </Icon>
  ),
  sparkles: (
    <Icon size={15}>
      <path d="M9.94 14.06 4 20M14.06 9.94 20 4M12 2v2M12 20v2M2 12h2M20 12h2" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  users: (
    <Icon size={15}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  zap: <Icon size={15}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></Icon>,
  droplet: <Icon size={15}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></Icon>,
  wrench: (
    <Icon size={15}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Icon>
  ),
  truck: (
    <Icon size={15}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Icon>
  ),
};
 
/* ---------- Dados ---------- */
const resumo = [
  { titulo: "Receitas", valor: "R$ 45.850,00", nota: "Total recebido no período", icon: icons.arrowUpRight, tom: "green" },
  { titulo: "Despesas", valor: "R$ 18.420,00", nota: "Total de despesas", icon: icons.arrowDownRight, tom: "red" },
  { titulo: "Saldo", valor: "R$ 27.430,00", nota: "Resultado do período", icon: icons.wallet, tom: "teal" },
  { titulo: "Pagamentos pendentes", valor: "R$ 4.250,00", nota: "Valores a receber", icon: icons.clock, tom: "amber" },
];
 
const grafico = [
  { mes: "Abril", receitas: 28000, despesas: 15500 },
  { mes: "Maio", receitas: 33600, despesas: 17300 },
  { mes: "Junho", receitas: 31200, despesas: 20100 },
  { mes: "Julho", receitas: 38400, despesas: 18200 },
  { mes: "Agosto", receitas: 42200, despesas: 23000 },
  { mes: "Setembro", receitas: 45850, despesas: 18420 },
];
const maxGrafico = 48000;
 
const categorias = [
  { nome: "Hospedagem", icon: icons.bed },
  { nome: "Restaurante", icon: icons.utensils },
  { nome: "Serviços extras", icon: icons.sparkles },
  { nome: "Salários", icon: icons.users },
  { nome: "Energia", icon: icons.zap },
  { nome: "Água", icon: icons.droplet },
  { nome: "Manutenção", icon: icons.wrench },
  { nome: "Fornecedores", icon: icons.truck },
];
 
const movimentacoes = [
  { data: "20/09/2026", descricao: "Reserva - João Silva", categoria: "Hospedagem", tipo: "Receita", pagamento: "Cartão", valor: "R$ 600,00", status: "Pago" },
  { data: "20/09/2026", descricao: "Compra de produtos de limpeza", categoria: "Manutenção", tipo: "Despesa", pagamento: "Pix", valor: "R$ 400,00", status: "Pago" },
  { data: "19/09/2026", descricao: "Restaurante - Maria Souza", categoria: "Restaurante", tipo: "Receita", pagamento: "Pix", valor: "R$ 150,00", status: "Pago" },
  { data: "19/09/2026", descricao: "Conta de energia", categoria: "Energia", tipo: "Despesa", pagamento: "Boleto", valor: "R$ 1.500,00", status: "Pago" },
];
 
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
 
const formatar = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
 
/* ---------- Página ---------- */
export default function FinanceiroPage() {
  const [mes, setMes] = useState("Setembro");
 
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
        <span className={styles.bannerBreadcrumb}>Financeiro &gt; Visão Geral</span>
        <h1 className={styles.bannerTitle}>Financeiro</h1>
        <p className={styles.bannerText}>
          Acompanhe as receitas, despesas e movimentações do hotel.
        </p>
      </section>
 
      <div className={styles.content}>
        {/* Filtros */}
        <div className={styles.toolbar}>
          <label className={styles.monthSelect}>
            {icons.calendar}
            <select value={mes} onChange={(e) => setMes(e.target.value)}>
              {meses.map((m) => (
                <option key={m} value={m}>
                  {m} de 2026
                </option>
              ))}
            </select>
            <span className={styles.monthChevron}>{icons.chevronDown}</span>
          </label>
 
          <button type="button" className={styles.primaryButton}>
            {icons.plus}
            Nova movimentação
          </button>
        </div>
 
        {/* Resumo */}
        <div className={styles.summaryGrid}>
          {resumo.map((r) => (
            <div key={r.titulo} className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <span className={styles.summaryTitle}>{r.titulo}</span>
                <span className={`${styles.summaryIcon} ${styles[r.tom]}`}>{r.icon}</span>
              </div>
              <strong className={styles.summaryValue}>{r.valor}</strong>
              <span className={styles.summaryNote}>{r.nota}</span>
            </div>
          ))}
        </div>
 
        {/* Gráfico + categorias */}
        <div className={styles.middleGrid}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Receitas e despesas</h2>
                <p className={styles.panelSubtitle}>Comparativo dos últimos 6 meses</p>
              </div>
              <div className={styles.legend}>
                <span><i className={styles.dotReceita} />Receitas</span>
                <span><i className={styles.dotDespesa} />Despesas</span>
              </div>
            </div>
 
            <div className={styles.chart}>
              {grafico.map((g) => (
                <div key={g.mes} className={styles.chartGroup}>
                  <div className={styles.bars}>
                    <div
                      className={styles.barReceita}
                      style={{ height: `${(g.receitas / maxGrafico) * 100}%` }}
                      title={`Receitas: ${formatar(g.receitas)}`}
                    />
                    <div
                      className={styles.barDespesa}
                      style={{ height: `${(g.despesas / maxGrafico) * 100}%` }}
                      title={`Despesas: ${formatar(g.despesas)}`}
                    />
                  </div>
                  <span className={styles.chartLabel}>{g.mes}</span>
                </div>
              ))}
            </div>
          </div>
 
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Categorias financeiras</h2>
            <p className={styles.panelSubtitle}>Organização por centro de custo</p>
 
            <ul className={styles.categoryList}>
              {categorias.map((c) => (
                <li key={c.nome}>
                  <button className={styles.categoryItem}>
                    <span className={styles.categoryIcon}>{c.icon}</span>
                    <span className={styles.categoryName}>{c.nome}</span>
                    <span className={styles.categoryChevron}>{icons.chevronRight}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
 
        {/* Movimentações */}
        <div className={`${styles.panel} ${styles.tablePanel}`}>
          <div className={styles.tableHeaderRow}>
            <div>
              <h2 className={styles.panelTitle}>Movimentações recentes</h2>
              <p className={styles.panelSubtitle}>Últimos lançamentos do hotel</p>
            </div>
            <a href="#" className={styles.viewAll}>
              Ver todas {icons.arrowRight}
            </a>
          </div>
 
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Forma de pagamento</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((m, i) => (
                  <tr key={i}>
                    <td>{m.data}</td>
                    <td>{m.descricao}</td>
                    <td>{m.categoria}</td>
                    <td className={m.tipo === "Receita" ? styles.receita : styles.despesa}>
                      {m.tipo}
                    </td>
                    <td>{m.pagamento}</td>
                    <td className={styles.valor}>{m.valor}</td>
                    <td>
                      <span className={styles.statusPago}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}