"use client";
 
import { useState } from "react";
import styles from "./suporte.module.css";
 
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
  mail: (
    <Icon>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </Icon>
  ),
  help: (
    <Icon size={17}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </Icon>
  ),
  plus: <Icon size={13}><path d="M12 5v14M5 12h14" /></Icon>,
  minus: <Icon size={13}><path d="M5 12h14" /></Icon>,
  arrowRight: <Icon size={13}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>,
};
 
/* ---------- Dados ---------- */
const perguntas = [
  {
    pergunta: "Como altero ou cancelo uma reserva?",
    resposta:
      "Acesse Reservas, localize a hospedagem e use o menu de ações para editar datas, quarto ou status.",
  },
  {
    pergunta: "Como faço o check-in de um hóspede?",
    resposta:
      "Em Reservas, abra a reserva do dia, confira os documentos do hóspede e clique em Realizar check-in.",
  },
  {
    pergunta: "Onde consulto pagamentos pendentes?",
    resposta:
      "Acesse Financeiro. O card Pagamentos pendentes mostra o total a receber e a tabela lista cada lançamento.",
  },
  {
    pergunta: "Como atualizo a disponibilidade de um quarto?",
    resposta:
      "Em Quartos, clique em Ver Detalhes no quarto desejado e altere o status para Livre, Ocupado, Reservado ou Manutenção.",
  },
];
 
/* ---------- Página ---------- */
export default function SuportePage() {
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState(0);
 
  const termo = busca.trim().toLowerCase();
  const filtradas = perguntas
    .map((p, i) => ({ ...p, indice: i }))
    .filter(
      (p) =>
        !termo ||
        p.pergunta.toLowerCase().includes(termo) ||
        p.resposta.toLowerCase().includes(termo)
    );
 
  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>Hotel Grand Plaza / Central de Reservas</span>
        <div className={styles.topbarUser}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>
 
      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <div>
          <span className={styles.bannerBreadcrumb}>Suporte &gt; Central de Ajuda</span>
          <h1 className={styles.bannerTitle}>Central de Suporte</h1>
          <p className={styles.bannerText}>
            Encontre respostas rápidas ou fale com a nossa equipe de atendimento.
          </p>
        </div>
        <span className={styles.status}>
          <i />
          Atendimento disponível
        </span>
      </section>
 
      <div className={styles.content}>
        {/* Busca */}
        <section className={styles.hero}>
          <div>
            <h2 className={styles.heroTitle}>Como podemos ajudar?</h2>
            <p className={styles.heroText}>
              Pesquise por uma dúvida ou consulte as perguntas frequentes.
            </p>
          </div>
          <label className={styles.searchBox}>
            {icons.search}
            <input
              type="text"
              placeholder="Digite sua dúvida, por exemplo: alterar uma reserva"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>
        </section>
 
        <div className={styles.grid}>
          {/* FAQ */}
          <section className={styles.faqPanel}>
            <div className={styles.faqHeader}>
              <div>
                <h2 className={styles.faqTitle}>Perguntas frequentes</h2>
                <p className={styles.faqSubtitle}>Dúvidas comuns sobre a operação do sistema</p>
              </div>
              <span className={styles.faqBadge}>FAQ</span>
            </div>
 
            <div className={styles.faqList}>
              {filtradas.map((p) => {
                const estaAberta = aberta === p.indice;
                return (
                  <div key={p.indice} className={styles.faqItem}>
                    <button
                      type="button"
                      className={styles.faqQuestion}
                      aria-expanded={estaAberta}
                      onClick={() => setAberta(estaAberta ? null : p.indice)}
                    >
                      <span>{p.pergunta}</span>
                      <span className={styles.faqToggle}>
                        {estaAberta ? icons.minus : icons.plus}
                      </span>
                    </button>
                    {estaAberta && <p className={styles.faqAnswer}>{p.resposta}</p>}
                  </div>
                );
              })}
 
              {filtradas.length === 0 && (
                <p className={styles.empty}>
                  Nenhuma pergunta encontrada. Tente outra palavra ou abra um chamado.
                </p>
              )}
            </div>
          </section>
 
          {/* Contatos */}
          <div className={styles.sideColumn}>
            <section className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <span className={styles.contactIcon}>{icons.mail}</span>
                <strong>E-mail</strong>
              </div>
              <a href="mailto:suporte@grandplaza.com.br" className={styles.contactValue}>
                suporte@grandplaza.com.br
              </a>
              <p className={styles.contactNote}>
                Respondemos em até 2 horas durante o horário comercial.
              </p>
            </section>
 
            <section className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <span className={styles.contactIcon}>{icons.phone}</span>
                <strong>Telefone</strong>
              </div>
              <a href="tel:+551140028922" className={styles.contactValue}>
                (11) 4002-8922
              </a>
              <p className={styles.contactNote}>
                Segunda a sexta, das 8h às 20h. Sábados, das 9h às 14h.
              </p>
            </section>
 
            <section className={styles.helpCard}>
              <div className={styles.helpHeader}>
                <span className={styles.helpIcon}>{icons.help}</span>
                <strong>Precisa de Ajuda agora?</strong>
              </div>
              <p className={styles.helpText}>
                Abra um chamado e acompanhe o atendimento pela Central de Ajuda.
              </p>
              <button type="button" className={styles.helpButton}>
                Abrir chamado {icons.arrowRight}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}