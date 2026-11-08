"use client";
 
import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import styles from "./nova.module.css";
 
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
  search: <Icon size={14}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>,
};
 
/* ---------- Dados de exemplo ---------- */
const hospedesPadrao = [
  { nome: "joao", cpf: "341.984.561-50", telefone: "3611986021", email: "joao@email.com" },
];
 
const etapas = ["Dados do Hóspede", "Período & Quarto", "Revisão & Confirmar"];
 
/* ---------- Utilitários ---------- */
const soNumeros = (v) => v.replace(/\D/g, "");
 
const mascaraCPF = (v) =>
  soNumeros(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
 
const mascaraTelefone = (v) => {
  const n = soNumeros(v).slice(0, 11);
  if (n.length <= 10) return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};
 
const hospedeVazio = { nome: "", cpf: "", email: "", telefone: "" };
 
const normalizar = (h) => ({
  nome: String(h?.nome ?? ""),
  cpf: String(h?.cpf ?? ""),
  email: String(h?.email ?? ""),
  telefone: String(h?.telefone ?? ""),
});
 
const converterJSON = (texto, padrao) => {
  try {
    return JSON.parse(texto) ?? padrao;
  } catch {
    return padrao;
  }
};
 
/* ---------- Leitura do sessionStorage sem useEffect ---------- */
const assinarStorage = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};
 
function useSessionStorage(chave) {
  return useSyncExternalStore(
    assinarStorage,
    () => sessionStorage.getItem(chave), // no navegador
    () => null //                           no servidor
  );
}
 
/* ---------- Página ---------- */
export default function NovaReservaPage() {
  const hospedesSalvosTexto = useSessionStorage("hospedes");
  const novaReservaTexto = useSessionStorage("novaReserva");
 
  const cadastrados = useMemo(() => {
    const salvos = converterJSON(hospedesSalvosTexto, []);
    return [...hospedesPadrao, ...(Array.isArray(salvos) ? salvos : [])].map(normalizar);
  }, [hospedesSalvosTexto]);
 
  const hospedeInicial = useMemo(() => {
    const emAndamento = converterJSON(novaReservaTexto, null);
    return emAndamento?.hospede ? normalizar(emAndamento.hospede) : hospedeVazio;
  }, [novaReservaTexto]);
 
  /* A "key" faz o formulário começar de novo com os dados salvos quando eles forem lidos */
  return (
    <FormularioHospede
      key={novaReservaTexto ?? "vazio"}
      cadastrados={cadastrados}
      hospedeInicial={hospedeInicial}
    />
  );
}
 
/* ---------- Formulário ---------- */
function FormularioHospede({ cadastrados, hospedeInicial }) {
  const router = useRouter();
  const [hospede, setHospede] = useState(hospedeInicial);
  const [busca, setBusca] = useState("");
  const [listaAberta, setListaAberta] = useState(false);
 
  const atualizar = (campo, mascara) => (e) => {
    const valor = mascara ? mascara(e.target.value) : e.target.value;
    setHospede((h) => ({ ...h, [campo]: valor }));
  };
 
  const resultados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo.length < 2) return [];
    const numeros = soNumeros(termo);
    return cadastrados.filter(
      (h) =>
        h.nome.toLowerCase().includes(termo) ||
        h.email.toLowerCase().includes(termo) ||
        (numeros && soNumeros(h.cpf).includes(numeros))
    );
  }, [busca, cadastrados]);
 
  const selecionarHospede = (h) => {
    setHospede(normalizar(h));
    setBusca("");
    setListaAberta(false);
  };
 
  const avancar = (e) => {
    e.preventDefault();
 
    /* Guarda os dados para a próxima etapa (reservas/nova/periodo) */
    const emAndamento = converterJSON(sessionStorage.getItem("novaReserva"), {});
    sessionStorage.setItem("novaReserva", JSON.stringify({ ...emAndamento, hospede }));
 
    router.push("/reservas/nova/periodo");
  };
 
  return (
    <div className={styles.page}>
      {/* CABEÇALHO */}
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Reservas &gt; Nova Reserva</span>
          <h1 className={styles.title}>Realizar Nova Reserva</h1>
          <p className={styles.subtitle}>
            Configure os detalhes da hospedagem e associe um hóspede à reserva.
          </p>
        </div>
 
        <div className={styles.userPill}>
          <span>Admin Panel</span>
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* ETAPAS */}
      <nav className={styles.stepper} aria-label="Etapas da reserva">
        {etapas.map((nome, i) => (
          <div key={nome} className={styles.stepWrapper}>
            <div
              className={`${styles.step} ${i === 0 ? styles.stepActive : ""}`}
              aria-current={i === 0 ? "step" : undefined}
            >
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLabel}>{nome}</span>
            </div>
            {i < etapas.length - 1 && <span className={styles.stepLine} />}
          </div>
        ))}
      </nav>
 
      <form onSubmit={avancar}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>{icons.user}</span>
            Dados do Hóspede
            <small>— Identifique o cliente ou realize um cadastro rápido</small>
          </h2>
 
          {/* BUSCA */}
          <div className={styles.field}>
            <label htmlFor="busca">Buscar por Nome, CPF ou E-mail</label>
            <div className={styles.searchWrapper}>
              <div className={styles.searchBox}>
                {icons.search}
                <input
                  id="busca"
                  type="text"
                  placeholder="Buscar por nome, CPF ou e-mail..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setListaAberta(true);
                  }}
                  onFocus={() => setListaAberta(true)}
                  onBlur={() => setTimeout(() => setListaAberta(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setListaAberta(false);
                    if (e.key === "Enter") e.preventDefault();
                  }}
                  autoComplete="off"
                />
              </div>
 
              {listaAberta && busca.trim().length >= 2 && (
                <ul className={styles.results}>
                  {resultados.length === 0 && (
                    <li className={styles.noResults}>
                      Nenhum hóspede encontrado. Preencha os dados abaixo para um cadastro rápido.
                    </li>
                  )}
                  {resultados.map((h, i) => (
                    <li key={`${h.cpf}-${i}`}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selecionarHospede(h)}
                      >
                        <strong>{h.nome || "Sem nome"}</strong>
                        <span>
                          {h.cpf || "CPF não informado"} • {h.email || "sem e-mail"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
 
          {/* DADOS */}
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="nome">Nome Completo *</label>
              <input
                id="nome"
                type="text"
                placeholder="ex: Amanda Silveira"
                value={hospede.nome}
                onChange={atualizar("nome")}
                required
              />
            </div>
 
            <div className={styles.field}>
              <label htmlFor="cpf">CPF *</label>
              <input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={hospede.cpf}
                onChange={atualizar("cpf", mascaraCPF)}
                required
              />
            </div>
 
            <div className={styles.field}>
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                type="email"
                placeholder="ex: amanda@email.com"
                value={hospede.email}
                onChange={atualizar("email")}
                required
              />
            </div>
 
            <div className={styles.field}>
              <label htmlFor="telefone">Telefone / Celular</label>
              <input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-0000"
                value={hospede.telefone}
                onChange={atualizar("telefone", mascaraTelefone)}
              />
            </div>
          </div>
        </section>
 
        {/* BOTÕES */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/disponibilidade")}
          >
            Voltar para Disponibilidade
          </button>
          <button type="submit" className={styles.nextButton}>
            Avançar para Período e Quarto
          </button>
        </div>
      </form>
    </div>
  );
}