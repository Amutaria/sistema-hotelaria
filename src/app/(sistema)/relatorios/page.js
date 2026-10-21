"use client";
 
import { useState } from "react";
import styles from "./relatorios.module.css";
 
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
  bed: <Icon><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></Icon>,
  door: (
    <Icon>
      <path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01" />
      <path d="M13 4.56v16.18a.5.5 0 0 1-.63.49l-6.35-1.8A1.5 1.5 0 0 1 5 17.97V5.06a1.5 1.5 0 0 1 1.1-1.45l6.27-1.79a.5.5 0 0 1 .63.48z" />
    </Icon>
  ),
  receipt: (
    <Icon>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8H8M16 12H8M13 16H8" />
    </Icon>
  ),
  trend: <Icon><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></Icon>,
  chevronDown: <Icon size={12}><path d="m6 9 6 6 6-6" /></Icon>,
  download: <Icon size={12}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></Icon>,
};
 
/* ---------- Dados ---------- */
const evolucao = {
  Ocupação: {
    subtitulo: "Taxa média por intervalo de 5 dias",
    formato: (v) => `${v}%`,
    max: 100,
    dados: [
      { label: "01-05", valor: 68 },
      { label: "06-10", valor: 72 },
      { label: "11-15", valor: 70 },
      { label: "16-20", valor: 80 },
      { label: "21-25", valor: 77 },
      { label: "26-30", valor: 85 },
    ],
  },
  Faturamento: {
    subtitulo: "Receita por intervalo de 5 dias",
    formato: (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    max: 90000,
    dados: [
      { label: "01-05", valor: 58400 },
      { label: "06-10", valor: 63200 },
      { label: "11-15", valor: 61500 },
      { label: "16-20", valor: 72800 },
      { label: "21-25", valor: 69300 },
      { label: "26-30", valor: 78100 },
    ],
  },
};
 
const ocupacaoCategoria = [
  { nome: "Standard", valor: 85, cor: "teal" },
  { nome: "Executivo", valor: 75, cor: "green" },
  { nome: "Luxo", valor: 75, cor: "brown" },
  { nome: "Suíte", valor: 67, cor: "amber" },
];
 
const indicadores = [
  { titulo: "Taxa de ocupação", valor: "78,4%", nota: "+ 6,2 % vs. agosto", icon: icons.bed, tom: "teal" },
  { titulo: "Quartos ocupados", valor: "94", nota: "de 120 disponíveis", icon: icons.door, tom: "green" },
  { titulo: "Diária média", valor: "R$ 486,20", nota: "+ 4,8% no período", icon: icons.receipt, tom: "amber" },
  { titulo: "Receita de hospedagem", valor: "R$ 412.680", nota: "30 dias consolidados", icon: icons.trend, tom: "red" },
];
 
const detalhamento = [
  { categoria: "Standard", disponiveis: 48, ocupados: 41, taxa: "85,4%", faturamento: "R$ 158.420,00" },
  { categoria: "Executivo", disponiveis: 36, ocupados: 27, taxa: "75,0%", faturamento: "R$ 128.780,00" },
  { categoria: "Luxo", disponiveis: 24, ocupados: 18, taxa: "75,0%", faturamento: "R$ 92.340,00" },
  { categoria: "Suíte", disponiveis: 12, ocupados: 8, taxa: "66,7%", faturamento: "R$ 35.160,00" },
];
 
/* ---------- Página ---------- */
export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("setembro");
  const [tipo, setTipo] = useState("ocupacao");
  const [visualizacao, setVisualizacao] = useState("Ocupação");
 
  const grafico = evolucao[visualizacao];
 
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
        <span className={styles.bannerBreadcrumb}>Relatórios &gt; Visão Geral</span>
        <h1 className={styles.bannerTitle}>Relatórios</h1>
        <p className={styles.bannerText}>Analise o desempenho operacional e financeiro do hotel.</p>
      </section>
 
      <div className={styles.content}>
        {/* Gráfico + categorias */}
        <div className={styles.topGrid}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Evolução da {visualizacao.toLowerCase()}</h2>
            <p className={styles.panelSubtitle}>{grafico.subtitulo}</p>
 
            <div className={styles.chart}>
              {grafico.dados.map((d) => (
                <div key={d.label} className={styles.chartColumn}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(d.valor / grafico.max) * 100}%` }}
                    title={grafico.formato(d.valor)}
                  />
                  <span className={styles.chartLabel}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
 
          <div className={`${styles.panel} ${styles.categoryPanel}`}>
            <h2 className={styles.panelTitle}>Ocupação por categoria</h2>
 
            <div className={styles.categoryList}>
              {ocupacaoCategoria.map((c) => (
                <div key={c.nome} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{c.nome}</span>
                  <span className={styles.categoryValue}>{c.valor}%</span>
                  <div className={styles.progress}>
                    <div
                      className={`${styles.progressFill} ${styles[c.cor]}`}
                      style={{ width: `${c.valor}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Filtros */}
        <div className={`${styles.panel} ${styles.filters}`}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="periodo">Período</label>
            <div className={styles.selectBox}>
              <select id="periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option value="setembro">01/09/2026 - 30/09/2026</option>
                <option value="agosto">01/08/2026 - 31/08/2026</option>
                <option value="julho">01/07/2026 - 31/07/2026</option>
              </select>
              <span className={styles.selectIcon}>{icons.chevronDown}</span>
            </div>
          </div>
 
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="tipo">Tipo de relatório</label>
            <div className={styles.selectBox}>
              <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="ocupacao">Ocupação</option>
                <option value="faturamento">Faturamento</option>
                <option value="hospedes">Hóspedes</option>
              </select>
              <span className={styles.selectIcon}>{icons.chevronDown}</span>
            </div>
          </div>
 
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Visualização</span>
            <div className={styles.toggleGroup}>
              {["Ocupação", "Faturamento"].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.toggle} ${visualizacao === v ? styles.toggleActive : ""}`}
                  onClick={() => setVisualizacao(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
 
          <button type="button" className={styles.primaryButton}>
            Gerar Relatório
          </button>
        </div>
 
        {/* Indicadores */}
        <div className={styles.kpiGrid}>
          {indicadores.map((k) => (
            <div key={k.titulo} className={styles.kpiCard}>
              <span className={styles.kpiTitle}>{k.titulo}</span>
              <span className={`${styles.kpiIcon} ${styles[`${k.tom}Soft`]}`}>{k.icon}</span>
              <strong className={styles.kpiValue}>{k.valor}</strong>
              <span className={styles.kpiNote}>{k.nota}</span>
            </div>
          ))}
        </div>
 
        {/* Tabela */}
        <div className={`${styles.panel} ${styles.tablePanel}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.panelTitle}>Detalhamento por categoria</h2>
            <p className={styles.panelSubtitle}>Resultados consolidados de setembro de 2026</p>
            <a href="#" className={styles.exportLink}>
              Exportar PDF {icons.download}
            </a>
          </div>
 
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Quartos disponíveis</th>
                  <th>Quartos ocupados</th>
                  <th>Taxa de ocupação</th>
                  <th>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {detalhamento.map((d) => (
                  <tr key={d.categoria}>
                    <td className={styles.categoriaCell}>{d.categoria}</td>
                    <td>{d.disponiveis}</td>
                    <td>{d.ocupados}</td>
                    <td>{d.taxa}</td>
                    <td className={styles.faturamentoCell}>{d.faturamento}</td>
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