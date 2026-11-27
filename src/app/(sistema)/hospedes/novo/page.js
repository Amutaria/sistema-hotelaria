"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./novo.module.css";
 
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
  file: (
    <Icon>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </Icon>
  ),
};

/* ---------- Máscaras ---------- */
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

/* ---------- Estado inicial ---------- */
const formularioVazio = {
  nome: "",
  cpf: "",
  nascimento: "",
  genero: "",
  nacionalidade: "",
  email: "",
  telefone: "",
  documento: "",
  observacoes: "",
  acompanhantes: [{ nome: "", cpf: "" }],
};

/* ---------- Página ---------- */
export default function CadastroHospede() {
  const router = useRouter();
  const [form, setForm] = useState(formularioVazio);
  const [salvando, setSalvando] = useState(false);
 
  const atualizar = (campo, mascara) => (e) => {
    const valor = mascara ? mascara(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const atualizarAcompanhante = (index, campo, mascara) => (e) => {
    const valor = mascara ? mascara(e.target.value) : e.target.value;

    setForm((f) => ({
      ...f,
      acompanhantes: f.acompanhantes.map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      ),
    }));
  };

  const adicionarAcompanhante = () => {
    setForm((f) => ({
      ...f,
      acompanhantes: [...f.acompanhantes, { nome: "", cpf: "" }],
    }));
  };

  const removerAcompanhante = (index) => {
    setForm((f) => ({
      ...f,
      acompanhantes: f.acompanhantes.filter((_, i) => i !== index),
    }));
  };

  const salvarCadastro = async (e) => {
    e.preventDefault();
    if (salvando) return;
    setSalvando(true);
    try {
      const response = await fetch("/api/hospedes", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          acompanhantes: (form.acompanhantes || []).filter((item) => item.nome.trim() || item.cpf.trim()),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar o cadastro.");
      alert("Hóspede e acompanhantes salvos no Supabase com sucesso!");
      router.push("/hospedes");
    } catch (error) {
      alert(error.message || "Erro ao salvar cadastro.");
    } finally {
      setSalvando(false);
    }
  };
 
  return (
    <>
      {/* BARRA SUPERIOR */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>Hotel Grand Plaza / Central de Reservas</span>
        <div className={styles.topbarUser}>
          <span>Admin Panel</span>
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.breadcrumb}>Reserva &gt; Nova Reserva &gt; Hóspedes</span>
        <h1 className={styles.bannerTitle}>Novo Cadastro de Hóspede</h1>
        <p className={styles.bannerText}>
          Preencha as informações detalhadas para o check-in do novo cliente.
        </p>
      </section>
 
      {/* FORMULÁRIO */}
      <form className={styles.content} onSubmit={salvarCadastro}>
        {/* DADOS PESSOAIS */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.sectionIcon}>{icons.user}</span>
            <div>
              <h2 className={styles.cardTitle}>Dados Pessoais</h2>
              <p className={styles.cardSubtitle}>Informações de identificação básica do hóspede</p>
            </div>
          </div>
 
          <div className={styles.gridPessoais}>
            <div className={`${styles.field} ${styles.span4}`}>
              <label htmlFor="nome">
                Nome Completo <span className={styles.required}>*</span>
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: João Silva de Oliveira"
                value={form.nome}
                onChange={atualizar("nome")}
                required
              />
            </div>
 
            <div className={`${styles.field} ${styles.span2} ${styles.endRow}`}>
              <label htmlFor="cpf">
                CPF <span className={styles.required}>*</span>
              </label>
              <input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={atualizar("cpf", mascaraCPF)}
                required
              />
            </div>
 
            <div className={`${styles.field} ${styles.span2}`}>
              <label htmlFor="nascimento">Data de Nascimento</label>
              <input
                id="nascimento"
                type="date"
                value={form.nascimento}
                onChange={atualizar("nascimento")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.span2}`}>
              <label htmlFor="genero">Gênero</label>
              <select id="genero" value={form.genero} onChange={atualizar("genero")}>
                <option value="">Prefiro não informar</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
 
            <div className={`${styles.field} ${styles.span2} ${styles.endRow}`}>
              <label htmlFor="nacionalidade">Nacionalidade</label>
              <input
                id="nacionalidade"
                type="text"
                placeholder="Brasileira"
                value={form.nacionalidade}
                onChange={atualizar("nacionalidade")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.span3}`}>
              <label htmlFor="email">
                E-mail <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                value={form.email}
                onChange={atualizar("email")}
                required
              />
            </div>
 
            <div className={`${styles.field} ${styles.span3} ${styles.endRow}`}>
              <label htmlFor="telefone">
                Telefone <span className={styles.required}>*</span>
              </label>
              <input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={atualizar("telefone", mascaraTelefone)}
                required
              />
            </div>
 
            <div className={`${styles.field} ${styles.span3}`}>
              <label htmlFor="documento">Documento de Identificação</label>
              <input
                id="documento"
                type="text"
                placeholder="Número do documento"
                value={form.documento}
                onChange={atualizar("documento")}
              />
            </div>
          </div>
        </section>
 
        {/* ACOMPANHANTES */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.sectionIcon}>{icons.user}</span>
            <div>
              <h2 className={styles.cardTitle}>Acompanhantes</h2>
              <p className={styles.cardSubtitle}>Informe os demais hóspedes que acompanham a reserva</p>
            </div>
            <button
              type="button"
              className={styles.addCompanionButton}
              onClick={adicionarAcompanhante}
            >
              + Adicionar acompanhante
            </button>
          </div>

          <div className={styles.companionList}>
            {form.acompanhantes.map((acompanhante, index) => (
              <div className={styles.companionRow} key={index}>
                <div className={`${styles.field} ${styles.span4}`}>
                  <label htmlFor={`acompanhante-nome-${index}`}>
                    Nome do acompanhante {index + 1}
                  </label>
                  <input
                    id={`acompanhante-nome-${index}`}
                    type="text"
                    placeholder="Ex: Maria da Silva"
                    value={acompanhante.nome}
                    onChange={atualizarAcompanhante(index, "nome")}
                  />
                </div>

                <div className={`${styles.field} ${styles.span3}`}>
                  <label htmlFor={`acompanhante-cpf-${index}`}>CPF</label>
                  <input
                    id={`acompanhante-cpf-${index}`}
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={acompanhante.cpf}
                    onChange={atualizarAcompanhante(index, "cpf", mascaraCPF)}
                  />
                </div>

                {form.acompanhantes.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeCompanionButton}
                    onClick={() => removerAcompanhante(index)}
                    aria-label={`Remover acompanhante ${index + 1}`}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* OBSERVAÇÕES */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.sectionIcon}>{icons.file}</span>
            <div>
              <h2 className={styles.cardTitle}>Observações</h2>
              <p className={styles.cardSubtitle}>
                Notas internas, preferências ou restrições alimentares
              </p>
            </div>
          </div>
 
          <div className={styles.field}>
            <label htmlFor="observacoes">Notas Adicionais</label>
            <textarea
              id="observacoes"
              placeholder="Escreva informações relevantes como alergias, preferências de quarto ou histórico do cliente..."
              value={form.observacoes}
              onChange={atualizar("observacoes")}
            />
          </div>
        </section>
 
        {/* BOTÕES */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/hospedes")}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            Salvar Cadastro
          </button>
        </div>
      </form>
    </>
  );
}