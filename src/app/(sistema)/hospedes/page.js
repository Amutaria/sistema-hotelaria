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
const hospedesPadrao = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "341.984.561-50",
    telefone: "(36) 19860-21",
    email: "joao@email.com",
    nascimento: "1990-05-18",
    genero: "Masculino",
    nacionalidade: "Brasileira",
    documento: "RG 12.345.678",
    cep: "30140-010",
    rua: "Rua das Flores",
    numero: "120",
    complemento: "Apto 3",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
    observacoes: "Solicita quarto silencioso.",
    acompanhantes: [{ nome: "Maria Silva", cpf: "111.222.333-44" }],
  },
  {
    id: 2,
    nome: "Ana Beatriz Costa",
    cpf: "456.789.123-55",
    telefone: "(31) 98888-1122",
    email: "ana.costa@email.com",
    nascimento: "1994-08-09",
    genero: "Feminino",
    nacionalidade: "Brasileira",
    documento: "RG 22.334.556",
    cep: "31270-000",
    rua: "Avenida Brasil",
    numero: "450",
    complemento: "Bloco B",
    bairro: "Savassi",
    cidade: "Belo Horizonte",
    estado: "MG",
    observacoes: "Prefere andar alto e café da manhã no quarto.",
    acompanhantes: [{ nome: "Pedro Costa", cpf: "222.333.444-55" }],
  },
  {
    id: 3,
    nome: "Lucas Martins",
    cpf: "789.456.123-88",
    telefone: "(21) 99777-3344",
    email: "lucas.martins@email.com",
    nascimento: "1988-12-03",
    genero: "Masculino",
    nacionalidade: "Brasileira",
    documento: "CNH 99887766",
    cep: "22020-000",
    rua: "Rua da Lapa",
    numero: "77",
    complemento: "Casa 2",
    bairro: "Lapa",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    observacoes: "Cliente frequente, solicita vista para o mar.",
    acompanhantes: [{ nome: "Julia Martins", cpf: "333.444.555-66" }],
  },
  {
    id: 4,
    nome: "Fernanda Souza",
    cpf: "123.456.789-01",
    telefone: "(11) 98444-5566",
    email: "fernanda.souza@email.com",
    nascimento: "1997-02-14",
    genero: "Feminino",
    nacionalidade: "Brasileira",
    documento: "RG 98.765.432",
    cep: "04567-890",
    rua: "Avenida Paulista",
    numero: "1000",
    complemento: "Apto 504",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    observacoes: "Não usa açúcar no café da manhã.",
    acompanhantes: [{ nome: "Gabriel Souza", cpf: "444.555.666-77" }],
  },
  {
    id: 5,
    nome: "Rafael Oliveira",
    cpf: "987.654.321-00",
    telefone: "(47) 99111-2233",
    email: "rafael.oliveira@email.com",
    nascimento: "1985-06-27",
    genero: "Masculino",
    nacionalidade: "Brasileira",
    documento: "RG 11.223.344",
    cep: "88015-300",
    rua: "Rua Felipe Schmidt",
    numero: "210",
    complemento: "Piso 8",
    bairro: "Centro",
    cidade: "Florianópolis",
    estado: "SC",
    observacoes: "Solicita quarto com boa iluminação e Wi‑Fi estável.",
    acompanhantes: [{ nome: "Isabela Oliveira", cpf: "555.666.777-88" }],
  },
];

/* ---------- Página ---------- */
export default function Hospedes() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [hospedes, setHospedes] = useState(hospedesPadrao);
  const [hospedeSelecionado, setHospedeSelecionado] = useState(null);

  useEffect(() => {
    try {
      const salvos = JSON.parse(sessionStorage.getItem("hospedes") || "[]");
      const lista = Array.isArray(salvos) ? [...hospedesPadrao, ...salvos] : hospedesPadrao;
      setHospedes(lista);
    } catch {
      setHospedes(hospedesPadrao);
    }
  }, []);

  const termo = busca.trim().toLowerCase();
  const somenteNumeros = termo.replace(/\D/g, "");

  const filtrados = hospedes.filter((h) => {
    if (!termo) return true;
    const cpfLimpo = (h.cpf || "").replace(/\D/g, "");
    const nome = (h.nome || "").toLowerCase();
    const email = (h.email || "").toLowerCase();

    return (
      nome.includes(termo) ||
      email.includes(termo) ||
      (somenteNumeros && cpfLimpo.includes(somenteNumeros))
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
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalEyebrow}>Hóspede</span>
                <h3>{hospedeSelecionado.nome}</h3>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setHospedeSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className={styles.modalGrid}>
              <div className={styles.infoBlock}>
                <span className={styles.infoTitle}>Dados pessoais</span>
                <div className={styles.infoRow}><strong>CPF:</strong> {hospedeSelecionado.cpf || "-"}</div>
                <div className={styles.infoRow}><strong>Telefone:</strong> {hospedeSelecionado.telefone || "-"}</div>
                <div className={styles.infoRow}><strong>E-mail:</strong> {hospedeSelecionado.email || "-"}</div>
                <div className={styles.infoRow}><strong>Data de nascimento:</strong> {hospedeSelecionado.nascimento || "-"}</div>
                <div className={styles.infoRow}><strong>Gênero:</strong> {hospedeSelecionado.genero || "-"}</div>
                <div className={styles.infoRow}><strong>Nacionalidade:</strong> {hospedeSelecionado.nacionalidade || "-"}</div>
              </div>

              <div className={styles.infoBlock}>
                <span className={styles.infoTitle}>Endereço</span>
                <div className={styles.infoRow}><strong>CEP:</strong> {hospedeSelecionado.cep || "-"}</div>
                <div className={styles.infoRow}><strong>Rua:</strong> {hospedeSelecionado.rua || "-"}</div>
                <div className={styles.infoRow}><strong>Número:</strong> {hospedeSelecionado.numero || "-"}</div>
                <div className={styles.infoRow}><strong>Complemento:</strong> {hospedeSelecionado.complemento || "-"}</div>
                <div className={styles.infoRow}><strong>Bairro:</strong> {hospedeSelecionado.bairro || "-"}</div>
                <div className={styles.infoRow}><strong>Cidade/UF:</strong> {hospedeSelecionado.cidade || "-"}{hospedeSelecionado.cidade && hospedeSelecionado.estado ? " / " : ""}{hospedeSelecionado.estado || ""}</div>
              </div>

              <div className={styles.infoBlock}>
                <span className={styles.infoTitle}>Documentação</span>
                <div className={styles.infoRow}><strong>Documento:</strong> {hospedeSelecionado.documento || "-"}</div>
                <div className={styles.infoRow}><strong>Observações:</strong> {hospedeSelecionado.observacoes || "-"}</div>
              </div>

              <div className={styles.infoBlock}>
                <span className={styles.infoTitle}>Acompanhantes</span>
                {Array.isArray(hospedeSelecionado.acompanhantes) && hospedeSelecionado.acompanhantes.length > 0 ? (
                  hospedeSelecionado.acompanhantes.map((acompanhante, index) => (
                    <div key={`${acompanhante.nome}-${index}`} className={styles.acompanhanteLine}>
                      <div><strong>Nome:</strong> {acompanhante.nome || "-"}</div>
                      <div><strong>CPF:</strong> {acompanhante.cpf || "-"}</div>
                    </div>
                  ))
                ) : (
                  <div className={styles.infoRow}>Nenhum acompanhante cadastrado.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}