"use client";
 
import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
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
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimentacaoEditando, setMovimentacaoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroFormulario, setErroFormulario] = useState("");

  const [formulario, setFormulario] = useState({
    tipo: "receita",
    descricao: "",
    categoria_id: "",
    data_movimento: new Date().toISOString().slice(0, 10),
    forma_pagamento: "pix",
    valor: "",
    status: "pago",
    observacoes: "",
  });
  const [grafico, setGrafico] = useState([
  { mes: "Janeiro", receitas: 0, despesas: 0 },
  { mes: "Fevereiro", receitas: 0, despesas: 0 },
  { mes: "Março", receitas: 0, despesas: 0 },
  { mes: "Abril", receitas: 0, despesas: 0 },
  { mes: "Maio", receitas: 0, despesas: 0 },
  { mes: "Junho", receitas: 0, despesas: 0 },
  { mes: "Julho", receitas: 0, despesas: 0 },
  { mes: "Agosto", receitas: 0, despesas: 0 },
  { mes: "Setembro", receitas: 0, despesas: 0 },
  { mes: "Outubro", receitas: 0, despesas: 0 },
  { mes: "Novembro", receitas: 0, despesas: 0 },
  { mes: "Dezembro", receitas: 0, despesas: 0 },
]);
  const [resumo, setResumo] = useState([
    {
      titulo: "Receitas",
      valor: "R$ 0,00",
      nota: "Total recebido no período",
      icon: icons.arrowUpRight,
      tom: "green",
    },
    {
      titulo: "Despesas",
      valor: "R$ 0,00",
      nota: "Total de despesas",
      icon: icons.arrowDownRight,
      tom: "red",
    },
    {
      titulo: "Saldo",
      valor: "R$ 0,00",
      nota: "Resultado do período",
      icon: icons.wallet,
      tom: "teal",
    },
    {
      titulo: "Pagamentos pendentes",
      valor: "R$ 0,00",
      nota: "Valores a receber",
      icon: icons.clock,
      tom: "amber",
    },
  ]);
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState("");
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregandoMovimentacoes, setCarregandoMovimentacoes] = useState(true);
  const [erroMovimentacoes, setErroMovimentacoes] = useState("");
  const [atualizarDados, setAtualizarDados] = useState(0);

  function editarMovimentacao(m) {
    setMovimentacaoEditando(m);

    setFormulario({
      tipo: m.tipo,
      descricao: m.descricao,
      categoria_id: String(
        categorias.find((c) => c.nome === m.categoria)?.id || ""
      ),
      data_movimento: m.dataOriginal,
      forma_pagamento: m.pagamento,
      valor: String(m.valor),
      status: m.status,
      observacoes: m.observacoes || "",
    });

    setErroFormulario("");
    setMostrarFormulario(true);
  }

  async function excluirMovimentacao(m) {
    const confirmar = window.confirm(
      `Tem certeza de que deseja excluir a movimentação "${m.descricao}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("movimentacoes_financeiras")
        .delete()
        .eq("id", m.id);

      if (error) {
        throw error;
      }

      setAtualizarDados((anterior) => anterior + 1);
    } catch (error) {
      console.error("Erro ao excluir movimentação:", error);
      alert(error.message || "Não foi possível excluir a movimentação.");
    }
  }

  async function salvarMovimentacao(e) {
    e.preventDefault();

    setErroFormulario("");

    const descricao = formulario.descricao.trim();
    const valor = Number(formulario.valor);
    const categoriaId = Number(formulario.categoria_id);

    if (!descricao || !formulario.categoria_id) {
      setErroFormulario("Preencha a descrição e selecione uma categoria.");
      return;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      setErroFormulario("Informe um valor válido maior que zero.");
      return;
    }

    const categoriaValida = categorias.some(
      (categoria) =>
        categoria.id === categoriaId &&
        categoria.tipo === formulario.tipo
    );

    if (!categoriaValida) {
      setErroFormulario("Selecione uma categoria válida para o tipo escolhido.");
      return;
    }

    setSalvando(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }

      const dadosMovimentacao = {
        data_movimento: formulario.data_movimento,
        descricao,
        categoria_id: categoriaId,
        tipo: formulario.tipo,
        forma_pagamento: formulario.forma_pagamento,
        valor,
        status: formulario.status,
        observacoes: formulario.observacoes.trim() || null,
      };

      const consulta = supabase
        .from("movimentacoes_financeiras");

      const resultado = movimentacaoEditando
        ? await consulta
            .update(dadosMovimentacao)
            .eq("id", movimentacaoEditando.id)
        : await consulta
            .insert({
              ...dadosMovimentacao,
              registrado_por: user.id,
            });

      const { error } = resultado;

      if (error) {
        throw error;
      }

      setFormulario({
        tipo: "receita",
        descricao: "",
        categoria_id: "",
        data_movimento: new Date().toISOString().slice(0, 10),
        forma_pagamento: "pix",
        valor: "",
        status: "pago",
        observacoes: "",
      });

      setErroFormulario("");
      setMostrarFormulario(false);
      setMovimentacaoEditando(null);
      setAtualizarDados((anterior) => anterior + 1);
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      setErroFormulario(
        error.message || "Não foi possível salvar a movimentação."
      );
    } finally {
      setSalvando(false);
    }
  }

useEffect(() => {
  let ativo = true;

  async function carregarCategorias() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("categorias_financeiras")
      .select("id, nome, tipo")
      .eq("ativo", true)
      .order("nome");

    if (!ativo) return;

    if (error) {
      setErroCategorias("Não foi possível carregar as categorias.");
      console.error("Erro ao buscar categorias:", error);
    } else {
      setCategorias(
        (data || []).map((categoria) => ({
          ...categoria,
          icon:
            categoria.nome === "Hospedagem" ? icons.bed :
            categoria.nome === "Restaurante" ? icons.utensils :
            categoria.nome === "Serviços extras" ? icons.sparkles :
            categoria.nome === "Salários" ? icons.users :
            categoria.nome === "Energia" ? icons.zap :
            categoria.nome === "Água" ? icons.droplet :
            categoria.nome === "Manutenção" ? icons.wrench :
            categoria.nome === "Fornecedores" ? icons.truck :
            icons.wallet,
        }))
      );
    }

    setCarregandoCategorias(false);
  }

    async function carregarMovimentacoes() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("movimentacoes_financeiras")
      .select(`
        id,
        data_movimento,
        descricao,
        tipo,
        forma_pagamento,
        valor,
        status,
        observacoes,
        categorias_financeiras(nome)
      `)
      .order("data_movimento", { ascending: false })
      .order("created_at", { ascending: false });

    if (!ativo) return;

    if (error) {
      setErroMovimentacoes("Não foi possível carregar as movimentações.");
      console.error("Erro ao buscar movimentações:", error);
    } else {
      setMovimentacoes(
        (data || []).map((item) => ({
          id: item.id,
          data: new Date(`${item.data_movimento}T00:00:00`).toLocaleDateString("pt-BR"),
          dataOriginal: item.data_movimento,
          descricao: item.descricao,
          categoria: item.categorias_financeiras?.nome || "Sem categoria",
          tipo: item.tipo,
          pagamento: item.forma_pagamento,
          valor: Number(item.valor),
          status: item.status,
          observacoes: item.observacoes || "",
        }))
      );
    }

    setCarregandoMovimentacoes(false);
  }

  carregarCategorias();
  carregarMovimentacoes();

  return () => {
    ativo = false;
  };
}, [atualizarDados]);

const movimentacoesFiltradas = movimentacoes.filter((m) => {
  const correspondeTipo =
    filtroTipo === "todos" || m.tipo === filtroTipo;

  const correspondeStatus =
    filtroStatus === "todos" || m.status === filtroStatus;

  const correspondeDataInicio =
    !filtroDataInicio || m.dataOriginal >= filtroDataInicio;

  const correspondeDataFim =
    !filtroDataFim || m.dataOriginal <= filtroDataFim;

  return (
    correspondeTipo &&
    correspondeStatus &&
    correspondeDataInicio &&
    correspondeDataFim
  );
});

const maxGrafico = Math.max(
  1,
  ...grafico.flatMap((g) => [g.receitas, g.despesas])
) * 1.1;

useEffect(() => {
    const numeroMeses = {
      Janeiro: "01",
      Fevereiro: "02",
      Março: "03",
      Abril: "04",
      Maio: "05",
      Junho: "06",
      Julho: "07",
      Agosto: "08",
      Setembro: "09",
      Outubro: "10",
      Novembro: "11",
      Dezembro: "12",
    };

    const mesSelecionado = numeroMeses[mes];

    const movimentacoesDoMes = movimentacoes.filter((item) => {
      return (
        item.dataOriginal.startsWith(`2026-${mesSelecionado}`)
      );
    });

    const receitas = movimentacoesDoMes
      .filter((item) => item.tipo === "receita" && item.status === "pago")
      .reduce((total, item) => total + item.valor, 0);

    const despesas = movimentacoesDoMes
      .filter((item) => item.tipo === "despesa" && item.status === "pago")
      .reduce((total, item) => total + item.valor, 0);

    const pendentes = movimentacoesDoMes
      .filter((item) => item.tipo === "receita" && item.status === "pendente")
      .reduce((total, item) => total + item.valor, 0);

    setResumo([
      {
        titulo: "Receitas",
        valor: formatar(receitas),
        nota: "Total recebido no período",
        icon: icons.arrowUpRight,
        tom: "green",
      },
      {
        titulo: "Despesas",
        valor: formatar(despesas),
        nota: "Total de despesas",
        icon: icons.arrowDownRight,
        tom: "red",
      },
      {
        titulo: "Saldo",
        valor: formatar(receitas - despesas),
        nota: "Resultado do período",
        icon: icons.wallet,
        tom: "teal",
      },
      {
        titulo: "Pagamentos pendentes",
        valor: formatar(pendentes),
        nota: "Valores a receber",
        icon: icons.clock,
        tom: "amber",
      },
    ]);
  }, [mes, movimentacoes]);

useEffect(() => {
  const numeroMeses = {
    Janeiro: "01",
    Fevereiro: "02",
    Março: "03",
    Abril: "04",
    Maio: "05",
    Junho: "06",
    Julho: "07",
    Agosto: "08",
    Setembro: "09",
    Outubro: "10",
    Novembro: "11",
    Dezembro: "12",
  };

  const novoGrafico = meses.map((nomeMes) => {
    const numeroMes = numeroMeses[nomeMes];

    const registrosDoMes = movimentacoes.filter(
      (item) =>
        item.dataOriginal.startsWith(`2026-${numeroMes}`)
    );

    const receitas = registrosDoMes
      .filter((item) => item.tipo === "receita" && item.status === "pago")
      .reduce((total, item) => total + item.valor, 0);

    const despesas = registrosDoMes
      .filter((item) => item.tipo === "despesa" && item.status === "pago")
      .reduce((total, item) => total + item.valor, 0);

    return {
      mes: nomeMes,
      receitas,
      despesas,
    };
  });

  setGrafico(novoGrafico);
}, [movimentacoes]);

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
 
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setMostrarFormulario(true)}
          >
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
                <p className={styles.panelSubtitle}>Comparativo mensal de 2026</p>
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
 
        {mostrarFormulario && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>
                  {movimentacaoEditando ? "Editar movimentação" : "Nova movimentação"}
                </h2>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                >
                  ×
                </button>
              </div>

              {erroFormulario && (
                <p className={styles.formError}>{erroFormulario}</p>
              )}

              <form onSubmit={salvarMovimentacao}>
                <label>
                  Tipo de movimentação
                  <select
                    value={formulario.tipo}
                    onChange={(e) =>
                      setFormulario({ ...formulario, tipo: e.target.value })
                    }
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </label>

                <label>
                  Descrição
                  <input
                    type="text"
                    value={formulario.descricao}
                    onChange={(e) =>
                      setFormulario({ ...formulario, descricao: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Categoria
                  <select
                    value={formulario.categoria_id}
                    onChange={(e) =>
                      setFormulario({ ...formulario, categoria_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias
                      .filter((c) => c.tipo === formulario.tipo)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  Data da movimentação
                  <input
                    type="date"
                    value={formulario.data_movimento}
                    onChange={(e) =>
                      setFormulario({ ...formulario, data_movimento: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Forma de pagamento
                  <select
                    value={formulario.forma_pagamento}
                    onChange={(e) =>
                      setFormulario({ ...formulario, forma_pagamento: e.target.value })
                    }
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão</option>
                    <option value="pix">Pix</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferência</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>

                <label>
                  Valor (R$)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formulario.valor}
                    onChange={(e) =>
                      setFormulario({ ...formulario, valor: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Status
                  <select
                    value={formulario.status}
                    onChange={(e) =>
                      setFormulario({ ...formulario, status: e.target.value })
                    }
                  >
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </label>

                <label>
                  Observações
                  <textarea
                    value={formulario.observacoes}
                    onChange={(e) =>
                      setFormulario({ ...formulario, observacoes: e.target.value })
                    }
                  />
                </label>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </button>

                  <button type="submit" disabled={salvando}>
                    {salvando
                      ? "Salvando..."
                      : movimentacaoEditando
                      ? "Salvar alterações"
                      : "Salvar movimentação"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

          <div className={styles.filtrosMovimentacoes}>
            <label>
              Tipo
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>

            <label>
              Data inicial
              <input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </label>

            <label>
              Data final
              <input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setFiltroTipo("todos");
                setFiltroStatus("todos");
                setFiltroDataInicio("");
                setFiltroDataFim("");
              }}
            >
              Limpar filtros
            </button>
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregandoMovimentacoes ? (
                  <tr>
                    <td colSpan="8">Carregando movimentações...</td>
                  </tr>
                ) : erroMovimentacoes ? (
                  <tr>
                    <td colSpan="8">{erroMovimentacoes}</td>
                  </tr>
                ) : movimentacoes.length === 0 ? (
                  <tr>
                    <td colSpan="8">Nenhuma movimentação cadastrada.</td>
                  </tr>
                ) : movimentacoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      Nenhuma movimentação corresponde aos filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  movimentacoesFiltradas.map((m) => (
                    <tr key={m.id}>
                      <td>{m.data}</td>
                      <td>{m.descricao}</td>
                      <td>{m.categoria}</td>
                      <td className={m.tipo === "receita" ? styles.receita : styles.despesa}>
                        {m.tipo === "receita" ? "Receita" : "Despesa"}
                      </td>
                      <td>
                        {{
                          dinheiro: "Dinheiro",
                          cartao: "Cartão",
                          pix: "Pix",
                          boleto: "Boleto",
                          transferencia: "Transferência",
                          outro: "Outro",
                        }[m.pagamento] || m.pagamento}
                      </td>
                      <td className={styles.valor}>{formatar(m.valor)}</td>
                      <td>
                        <span
                          className={
                            m.status === "pago"
                              ? styles.statusPago
                              : m.status === "pendente"
                              ? styles.statusPendente
                              : styles.statusCancelado
                          }
                        >
                          {m.status === "pago"
                            ? "Pago"
                            : m.status === "pendente"
                            ? "Pendente"
                            : "Cancelado"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.acoes}>
                          <button
                            type="button"
                            onClick={() => editarMovimentacao(m)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirMovimentacao(m)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}