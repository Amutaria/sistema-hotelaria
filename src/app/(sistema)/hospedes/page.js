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
};
 
/* ---------- Dados ---------- */
const hospedesBase = [
  {
    nome: "João Silva",
    cpf: "341.984.561-50",
    telefone: "(11) 3611-9802",
    email: "joao@email.com",
    checkin: "15/11/2026",
    checkout: "20/11/2026",
    quarto: "102",
    status: "Confirmado",
    observacoes: "Solicitou cama extra e café da manhã inclusivo.",
    acompanhantes: [],
  },
  {
    nome: "Maria Souza",
    cpf: "284.765.912-43",
    telefone: "(21) 99876-1122",
    email: "maria@email.com",
    checkin: "12/11/2026",
    checkout: "18/11/2026",
    quarto: "205",
    status: "Em hospedagem",
    observacoes: "Viajante frequente, prefere andar alto e quarto silencioso.",
    acompanhantes: [],
  },
  {
    nome: "Carlos Mendes",
    cpf: "518.204.761-88",
    telefone: "(31) 98844-5599",
    email: "carlos@email.com",
    checkin: "14/11/2026",
    checkout: "19/11/2026",
    quarto: "318",
    status: "Pré-check-in",
    observacoes: "Chegada prevista no fim da tarde com veículo próprio.",
    acompanhantes: [],
  },
  {
    nome: "Ana Paula Rocha",
    cpf: "712.889.034-90",
    telefone: "(41) 97653-0088",
    email: "ana@email.com",
    checkin: "10/11/2026",
    checkout: "15/11/2026",
    quarto: "410",
    status: "Finalizado",
    observacoes: "Hóspede repetente, pediu avaliação de limpeza no quarto.",
    acompanhantes: [],
  },
  {
    nome: "Pedro Almeida",
    cpf: "125.476.338-55",
    telefone: "(51) 98421-3677",
    email: "pedro@email.com",
    checkin: "16/11/2026",
    checkout: "22/11/2026",
    quarto: "507",
    status: "Confirmado",
    observacoes: "Solicitou vista para o mar e serviço de quarto no primeiro dia.",
    acompanhantes: [],
  },
];
 
/* ---------- Página ---------- */
export default function Hospedes() {
  const router = useRouter();
  const [hospedes, setHospedes] = useState(hospedesBase);
  const [busca, setBusca] = useState("");
  const [hospedeSelecionado, setHospedeSelecionado] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const salvos = JSON.parse(sessionStorage.getItem("hospedes") || "[]");
    const todos = [...hospedesBase, ...salvos];
    setHospedes(todos);
  }, []);

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
                  onClick={() => setHospedeSelecionado(hospede)}
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