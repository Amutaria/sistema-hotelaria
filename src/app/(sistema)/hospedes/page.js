"use client";
 
import { useEffect, useState } from "react";
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
  pencil: (
    <Icon size={14}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </Icon>
  ),
  trash: (
    <Icon size={14}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  ),
};

const mascaraCPF = (valor) => {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

/* ---------- Dados ---------- */
/* ---------- Página ---------- */
export default function Hospedes() {
  const router = useRouter();
  const [hospedes, setHospedes] = useState([]);
  const [busca, setBusca] = useState("");
  const [hospedeSelecionado, setHospedeSelecionado] = useState(null);
  const [hospedeEmEdicao, setHospedeEmEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarHospedes = async () => {
      try {
        setErro("");
        const response = await fetch("/api/hospedes");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Não foi possível carregar os hóspedes.");
        setHospedes(data.map((item) => ({
          ...item,
          acompanhantes: item.acompanhantes || [],
          telefone: item.telefone || "",
          email: item.email || "",
          checkin: "",
          checkout: "",
          quarto: "",
          status: "",
        })));
      } catch (error) {
        setErro(error.message || "Erro ao carregar hóspedes.");
      } finally {
        setCarregando(false);
      }
    };
    carregarHospedes();
  }, []);

  const termo = busca.trim().toLowerCase();
  const somenteNumeros = termo.replace(/\D/g, "");

  const removerHospede = async (id) => {
    const hospede = hospedes.find((item) => item.id === id);
    if (!window.confirm(`Deseja realmente excluir o hóspede ${hospede?.nome || "selecionado"}?`)) return;
    try {
      const response = await fetch(`/api/hospedes/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível excluir o hóspede.");
      setHospedes((atual) => atual.filter((item) => item.id !== id));
      if (hospedeSelecionado?.id === id) setHospedeSelecionado(null);
    } catch (error) {
      alert(error.message || "Erro ao excluir hóspede.");
    }
  };

  const abrirEdicao = (hospede) => {
    setHospedeEmEdicao({
      ...hospede,
      acompanhantes: Array.isArray(hospede.acompanhantes) && hospede.acompanhantes.length > 0
        ? hospede.acompanhantes
        : [{ nome: "", cpf: "" }],
    });
  };

  const atualizarEdicao = (campo, valor) => {
    setHospedeEmEdicao((atual) => ({ ...atual, [campo]: valor }));
  };

  const atualizarAcompanhanteEdicao = (index, campo, valor) => {
    setHospedeEmEdicao((atual) => ({
      ...atual,
      acompanhantes: (atual?.acompanhantes || []).map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      ),
    }));
  };

  const adicionarAcompanhanteEdicao = () => {
    setHospedeEmEdicao((atual) => ({
      ...atual,
      acompanhantes: [...(atual?.acompanhantes || []), { nome: "", cpf: "" }],
    }));
  };

  const removerAcompanhanteEdicao = (index) => {
    setHospedeEmEdicao((atual) => ({
      ...atual,
      acompanhantes: (atual?.acompanhantes || []).filter((_, i) => i !== index),
    }));
  };

  const salvarEdicao = async (event) => {
    event.preventDefault();
    if (!hospedeEmEdicao) return;
    try {
      const payload = {
        ...hospedeEmEdicao,
        acompanhantes: (hospedeEmEdicao.acompanhantes || []).filter((item) => item?.nome?.trim() || item?.cpf?.trim()),
      };
      const response = await fetch(`/api/hospedes/${hospedeEmEdicao.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar o hóspede.");
      setHospedes((atual) => atual.map((item) => item.id === data.id ? { ...data, telefone: data.telefone || "", acompanhantes: data.acompanhantes || [] } : item));
      setHospedeEmEdicao(null);
    } catch (error) {
      alert(error.message || "Erro ao atualizar hóspede.");
    }
  };

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
          <span>Admin Painel</span>
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
            {carregando ? <p className={styles.empty}>Carregando hóspedes...</p> : erro ? <p className={styles.empty}>{erro}</p> : filtrados.map((hospede) => (
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

                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className={styles.actionButtonPrimary}
                    aria-label={`Ver detalhes de ${hospede.nome}`}
                    onClick={() => setHospedeSelecionado(hospede)}
                  >
                    {icons.eye}
                    Visualizar
                  </button>

                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    aria-label={`Alterar dados de ${hospede.nome}`}
                    onClick={() => abrirEdicao(hospede)}
                  >
                    {icons.pencil}
                    Alterar
                  </button>

                  <button
                    type="button"
                    className={styles.actionButtonDanger}
                    aria-label={`Excluir ${hospede.nome}`}
                    onClick={() => removerHospede(hospede.id)}
                  >
                    {icons.trash}
                    Excluir
                  </button>
                </div>
              </div>
            ))}

            {!carregando && !erro && filtrados.length === 0 && (
              <p className={styles.empty}>Nenhum hóspede encontrado.</p>
            )}
          </div>
        </section>
      </div>

      {hospedeEmEdicao && (
        <div className={styles.modalOverlay} onClick={() => setHospedeEmEdicao(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setHospedeEmEdicao(null)}
              aria-label="Fechar edição do hóspede"
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>{icons.user}</div>
              <div>
                <span className={styles.modalLabel}>Edição</span>
                <h3 className={styles.modalTitle}>Alterar hóspede</h3>
              </div>
            </div>

            <form className={styles.editForm} onSubmit={salvarEdicao}>
              <div className={styles.editGrid}>
                <label className={styles.field}>
                  <span>Nome completo</span>
                  <input
                    value={hospedeEmEdicao.nome || ""}
                    onChange={(event) => atualizarEdicao("nome", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>CPF</span>
                  <input
                    value={hospedeEmEdicao.cpf || ""}
                    onChange={(event) => atualizarEdicao("cpf", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Data de nascimento</span>
                  <input
                    value={hospedeEmEdicao.nascimento || ""}
                    onChange={(event) => atualizarEdicao("nascimento", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Gênero</span>
                  <input
                    value={hospedeEmEdicao.genero || ""}
                    onChange={(event) => atualizarEdicao("genero", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Nacionalidade</span>
                  <input
                    value={hospedeEmEdicao.nacionalidade || ""}
                    onChange={(event) => atualizarEdicao("nacionalidade", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Documento</span>
                  <input
                    value={hospedeEmEdicao.documento || ""}
                    onChange={(event) => atualizarEdicao("documento", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Telefone</span>
                  <input
                    value={hospedeEmEdicao.telefone || ""}
                    onChange={(event) => atualizarEdicao("telefone", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>E-mail</span>
                  <input
                    type="email"
                    value={hospedeEmEdicao.email || ""}
                    onChange={(event) => atualizarEdicao("email", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>CEP</span>
                  <input
                    value={hospedeEmEdicao.cep || ""}
                    onChange={(event) => atualizarEdicao("cep", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Rua</span>
                  <input
                    value={hospedeEmEdicao.rua || ""}
                    onChange={(event) => atualizarEdicao("rua", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Número</span>
                  <input
                    value={hospedeEmEdicao.numero || ""}
                    onChange={(event) => atualizarEdicao("numero", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Complemento</span>
                  <input
                    value={hospedeEmEdicao.complemento || ""}
                    onChange={(event) => atualizarEdicao("complemento", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Bairro</span>
                  <input
                    value={hospedeEmEdicao.bairro || ""}
                    onChange={(event) => atualizarEdicao("bairro", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Cidade</span>
                  <input
                    value={hospedeEmEdicao.cidade || ""}
                    onChange={(event) => atualizarEdicao("cidade", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Estado</span>
                  <input
                    value={hospedeEmEdicao.estado || ""}
                    onChange={(event) => atualizarEdicao("estado", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Check-in</span>
                  <input
                    value={hospedeEmEdicao.checkin || ""}
                    onChange={(event) => atualizarEdicao("checkin", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Check-out</span>
                  <input
                    value={hospedeEmEdicao.checkout || ""}
                    onChange={(event) => atualizarEdicao("checkout", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Quarto</span>
                  <input
                    value={hospedeEmEdicao.quarto || ""}
                    onChange={(event) => atualizarEdicao("quarto", event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span>Status</span>
                  <input
                    value={hospedeEmEdicao.status || ""}
                    onChange={(event) => atualizarEdicao("status", event.target.value)}
                  />
                </label>
                <div className={styles.companionSection}>
                  <div className={styles.companionHeader}>
                    <h4 className={styles.sectionTitle}>Dependentes / acompanhantes</h4>
                    <button
                      type="button"
                      className={styles.addCompanionButton}
                      onClick={adicionarAcompanhanteEdicao}
                    >
                      + Adicionar acompanhante
                    </button>
                  </div>

                  <div className={styles.companionList}>
                    {(hospedeEmEdicao.acompanhantes || [{ nome: "", cpf: "" }]).map((acompanhante, index) => (
                      <div className={styles.companionRow} key={`acompanhante-${index}`}>
                        <label className={styles.field}>
                          <span>Nome</span>
                          <input
                            value={acompanhante.nome || ""}
                            onChange={(event) =>
                              atualizarAcompanhanteEdicao(index, "nome", event.target.value)
                            }
                          />
                        </label>

                        <label className={styles.field}>
                          <span>CPF</span>
                          <input
                            value={acompanhante.cpf || ""}
                            onChange={(event) =>
                              atualizarAcompanhanteEdicao(
                                index,
                                "cpf",
                                mascaraCPF(event.target.value)
                              )
                            }
                          />
                        </label>

                        {((hospedeEmEdicao.acompanhantes || []).length > 1) && (
                          <button
                            type="button"
                            className={styles.removeCompanionButton}
                            onClick={() => removerAcompanhanteEdicao(index)}
                            aria-label={`Remover acompanhante ${index + 1}`}
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Observações</span>
                  <textarea
                    value={hospedeEmEdicao.observacoes || ""}
                    onChange={(event) => atualizarEdicao("observacoes", event.target.value)}
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryAction} onClick={() => setHospedeEmEdicao(null)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryAction}>
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hospedeSelecionado && (
        <div className={styles.modalOverlay} onClick={() => setHospedeSelecionado(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setHospedeSelecionado(null)}
              aria-label="Fechar detalhes do hóspede"
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>{icons.user}</div>
              <div>
                <span className={styles.modalLabel}>Hóspede</span>
                <h3 className={styles.modalTitle}>{hospedeSelecionado.nome}</h3>
              </div>
            </div>

            <div className={styles.modalSections}>
              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Dados pessoais</h4>
                <div className={styles.modalGrid}>
                  <div className={styles.infoItem}>
                    <span>Nome completo</span>
                    <strong>{hospedeSelecionado.nome || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>CPF</span>
                    <strong>{hospedeSelecionado.cpf || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Data de nascimento</span>
                    <strong>{hospedeSelecionado.nascimento || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Gênero</span>
                    <strong>{hospedeSelecionado.genero || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Nacionalidade</span>
                    <strong>{hospedeSelecionado.nacionalidade || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Documento</span>
                    <strong>{hospedeSelecionado.documento || "Não informado"}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Contato</h4>
                <div className={styles.modalGrid}>
                  <div className={styles.infoItem}>
                    <span>Telefone</span>
                    <strong>{hospedeSelecionado.telefone || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>E-mail</span>
                    <strong>{hospedeSelecionado.email || "Não informado"}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Endereço</h4>
                <div className={styles.modalGrid}>
                  <div className={styles.infoItem}>
                    <span>CEP</span>
                    <strong>{hospedeSelecionado.cep || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Rua</span>
                    <strong>{hospedeSelecionado.rua || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Número</span>
                    <strong>{hospedeSelecionado.numero || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Complemento</span>
                    <strong>{hospedeSelecionado.complemento || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Bairro</span>
                    <strong>{hospedeSelecionado.bairro || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Cidade</span>
                    <strong>{hospedeSelecionado.cidade || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Estado</span>
                    <strong>{hospedeSelecionado.estado || "Não informado"}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Reserva</h4>
                <div className={styles.modalGrid}>
                  <div className={styles.infoItem}>
                    <span>Check-in</span>
                    <strong>{hospedeSelecionado.checkin || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Check-out</span>
                    <strong>{hospedeSelecionado.checkout || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Quarto</span>
                    <strong>{hospedeSelecionado.quarto || "Não informado"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Status</span>
                    <strong>{hospedeSelecionado.status || "Não informado"}</strong>
                  </div>
                </div>
              </div>

              {(hospedeSelecionado.acompanhantes?.length > 0 || true) && (
                <div className={styles.modalSection}>
                  <h4 className={styles.sectionTitle}>Dependentes / acompanhantes</h4>
                  <div className={styles.dependentList}>
                    {(hospedeSelecionado.acompanhantes?.length
                      ? hospedeSelecionado.acompanhantes
                      : [{ nome: "Nenhum dependente cadastrado", cpf: "-" }]
                    ).map((dependente, index) => (
                      <div className={styles.dependentCard} key={`${dependente.nome || "dependente"}-${index}`}>
                        <div className={styles.dependentField}>
                          <span>Nome</span>
                          <strong>{dependente.nome || "Não informado"}</strong>
                        </div>
                        <div className={styles.dependentField}>
                          <span>CPF</span>
                          <strong>{dependente.cpf || "Não informado"}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Observações</h4>
                <div className={styles.modalObservacoes}>
                  <p>{hospedeSelecionado.observacoes || "Nenhuma observação informada."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}