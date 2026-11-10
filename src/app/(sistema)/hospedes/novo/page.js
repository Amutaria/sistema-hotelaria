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
  pin: (
    <Icon>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
  file: (
    <Icon>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </Icon>
  ),
  search: <Icon size={14}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>,
};
 
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
 
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
 
const mascaraCEP = (v) => soNumeros(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
 
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
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  observacoes: "",
  acompanhantes: [{ nome: "", cpf: "" }],
};
 
/* ---------- Página ---------- */
export default function CadastroHospede() {
  const router = useRouter();
  const [form, setForm] = useState(formularioVazio);
  const [buscandoCep, setBuscandoCep] = useState(false);
 
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

  const buscarCep = async () => {
    const cep = soNumeros(form.cep);
    if (cep.length !== 8) {
      alert("Digite um CEP com 8 números.");
      return;
    }
 
    setBuscandoCep(true);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();
 
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }
 
      setForm((f) => ({
        ...f,
        rua: dados.logradouro || f.rua,
        bairro: dados.bairro || f.bairro,
        cidade: dados.localidade || f.cidade,
        estado: dados.uf || f.estado,
      }));
    } catch {
      alert("Não foi possível consultar o CEP agora.");
    } finally {
      setBuscandoCep(false);
    }
  };
 
  const salvarCadastro = (e) => {
    e.preventDefault();
 
    const acompanhantesValidos = (form.acompanhantes || []).filter(
      (item) => item.nome.trim() || item.cpf.trim()
    );

    const novoHospede = {
      id: Date.now(),
      ...form,
      acompanhantes: acompanhantesValidos,
    };

    const hospedesSalvos = JSON.parse(sessionStorage.getItem("hospedes") || "[]");
    hospedesSalvos.push(novoHospede);
    sessionStorage.setItem("hospedes", JSON.stringify(hospedesSalvos));

    alert("Cadastro salvo com sucesso!");
    router.push("/hospedes");
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

        {/* ENDEREÇO */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.sectionIcon}>{icons.pin}</span>
            <div>
              <h2 className={styles.cardTitle}>Endereço</h2>
              <p className={styles.cardSubtitle}>Localização da residência do hóspede</p>
            </div>
          </div>
 
          <div className={styles.gridEndereco}>
            <div className={`${styles.field} ${styles.col3}`}>
              <label htmlFor="cep">CEP</label>
              <div className={styles.cepGroup}>
                <input
                  id="cep"
                  type="text"
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={atualizar("cep", mascaraCEP)}
                />
                <button
                  type="button"
                  className={styles.cepButton}
                  onClick={buscarCep}
                  disabled={buscandoCep}
                  aria-label="Buscar CEP"
                >
                  {icons.search}
                </button>
              </div>
            </div>
 
            <div className={`${styles.field} ${styles.col9}`}>
              <label htmlFor="rua">Rua/Avenida</label>
              <input
                id="rua"
                type="text"
                placeholder="Logradouro"
                value={form.rua}
                onChange={atualizar("rua")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.col2}`}>
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                type="text"
                placeholder="123"
                value={form.numero}
                onChange={atualizar("numero")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.col4}`}>
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                type="text"
                placeholder="Apto, Bloco, etc."
                value={form.complemento}
                onChange={atualizar("complemento")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.col6}`}>
              <label htmlFor="bairro">Bairro</label>
              <input
                id="bairro"
                type="text"
                placeholder="Nome do bairro"
                value={form.bairro}
                onChange={atualizar("bairro")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.col5}`}>
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                type="text"
                placeholder="Cidade"
                value={form.cidade}
                onChange={atualizar("cidade")}
              />
            </div>
 
            <div className={`${styles.field} ${styles.col2}`}>
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={form.estado} onChange={atualizar("estado")}>
                <option value="">UF</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
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