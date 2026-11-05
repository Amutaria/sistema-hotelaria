"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./novo.module.css";
import QuartoForm from "../_components/QuartoForm";

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
  building: (
    <Icon>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </Icon>
  ),

  users: (
    <Icon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),

  star: (
    <Icon>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Icon>
  ),

  chevronDown: (
    <Icon size={12}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),

  checkCircle: (
    <Icon size={13}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),

  check: (
    <Icon size={13}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),

  success: (
    <Icon size={30}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </Icon>
  ),
};

/* ---------- Opções ---------- */
const tipos = ["Standard", "Luxo", "Suíte", "Executivo"];

const andares = [
  "Térreo",
  "1º Andar",
  "2º Andar",
  "3º Andar",
  "4º Andar",
];

const blocos = [
  "Bloco Principal",
  "Bloco A",
  "Bloco B",
  "Anexo",
];

const capacidades = [
  "1 Hóspede",
  "2 Hóspedes",
  "3 Hóspedes",
  "4 Hóspedes",
  "5 Hóspedes",
  "6 Hóspedes",
];

const statusOpcoes = [
  "Disponível (Livre)",
  "Em Manutenção",
  "Bloqueado",
];

const comodidadesOpcoes = [
  "Wi-Fi de Alta Velocidade",
  "Ar Condicionado",
  "Frigobar",
  "TV 4K",
];

/* ---------- Moeda ---------- */
const formatarMoeda = (texto) => {
  const centavos = Number(texto.replace(/\D/g, "")) || 0;

  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/* ---------- Estados do formulário ---------- */
const formularioInicial = {
  numero: "105",
  tipo: "Luxo",
  andar: "1º Andar",
  bloco: "Bloco Principal",
  capacidade: "2 Hóspedes",
  diaria: "R$ 350,00",
  status: "Disponível (Livre)",
  comodidades: [...comodidadesOpcoes],
};

const formularioVazio = {
  numero: "",
  tipo: "",
  andar: "",
  bloco: "",
  capacidade: "",
  diaria: "",
  status: "Disponível (Livre)",
  comodidades: [],
};

/* ---------- Página ---------- */
export default function NovoQuartoPage() {
  const router = useRouter();

  const [form, setForm] = useState(formularioInicial);
  const [cadastrado, setCadastrado] = useState(null);

  const atualizar = (campo) => (e) =>
    setForm((f) => ({
      ...f,
      [campo]: e.target.value,
    }));

  const alternarComodidade = (item) =>
    setForm((f) => ({
      ...f,
      comodidades: f.comodidades.includes(item)
        ? f.comodidades.filter((c) => c !== item)
        : [...f.comodidades, item],
    }));

  const localizacao =
    form.andar || form.bloco
      ? `${form.andar || "—"} / ${
          form.bloco.replace("Bloco ", "") || "—"
        }`
      : "—";

  const confirmarCadastro = async (e) => {
    e.preventDefault();

    const dadosQuarto = {
  numero: Number(form.numero),
  tipo: form.tipo,
  andar: form.andar,
  bloco: form.bloco,
  capacidade: Number(form.capacidade.replace(/\D/g, "")),
  diaria: Number(form.diaria.replace(/\D/g, "")) / 100,
  status:
    form.status === "Disponível (Livre)"
      ? "Livre"
      : form.status === "Em Manutenção"
        ? "Manutenção"
        : "Ocupado",
  comodidades: form.comodidades,
};

    try {
      const resposta = await fetch("/api/quartos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosQuarto),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        return;
      }

      setCadastrado(dados);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao cadastrar o quarto.");
    }
  };

  const cadastrarOutro = () => {
    setForm(formularioVazio);
    setCadastrado(null);
  };

  const corStatus = {
    "Disponível (Livre)": styles.statusLivre,
    "Em Manutenção": styles.statusManutencao,
    Bloqueado: styles.statusBloqueado,
  };

  return (
    <>
      {/* BARRA SUPERIOR */}
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>
          Hotel Grand Plaza / Central de Reservas
        </span>

        <div className={styles.topbarUser}>
          <span>Admin Panel</span>
          <div className={styles.avatar} />
        </div>
      </header>

      {/* CABEÇALHO */}
      <section className={styles.banner}>
        <span className={styles.breadcrumb}>
          Quartos &gt; Visão Geral &gt; Novo Cadastro
        </span>

        <h1 className={styles.bannerTitle}>
          {cadastrado
            ? "Quarto Cadastrado!"
            : "Cadastro de Novo Quarto"}
        </h1>

        {!cadastrado && (
          <p className={styles.bannerText}>
            Insira as especificações da nova unidade habitacional
            para integrá-la ao sistema de reservas.
          </p>
        )}
      </section>

      {/* TELA DE SUCESSO */}
      {cadastrado ? (
        <div className={styles.successWrapper}>
          <section className={styles.successCard}>
            <div className={styles.successIcon}>
              {icons.success}
            </div>

            <h2 className={styles.successTitle}>
              Quarto {cadastrado.numero} Cadastrado!
            </h2>

            <p className={styles.successText}>
              As configurações foram salvas com sucesso. O quarto
              já está disponível para receber reservas e check-ins
              na Central de Reservas.
            </p>

            <dl className={styles.successDetails}>
              <div>
                <dt>Número:</dt>

                <dd>
                  Quarto {cadastrado.numero}

                  {cadastrado.tipo &&
                    ` (${cadastrado.tipo})`}
                </dd>
              </div>

              <div>
                <dt>Valor Diária:</dt>

                <dd className={styles.successPrice}>
                  {cadastrado.diaria}
                </dd>
              </div>

              <div>
                <dt>Status Inicial:</dt>

                <dd
                  className={
                    corStatus[cadastrado.status]
                  }
                >
                  {cadastrado.status}
                </dd>
              </div>
            </dl>

            <div className={styles.successActions}>
              <button
                type="button"
                className={styles.successPrimary}
                onClick={() => router.push("/quartos")}
              >
                Ir para Visão Geral
              </button>

              <button
                type="button"
                className={styles.successSecondary}
                onClick={cadastrarOutro}
              >
                Cadastrar Outro Quarto
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* FORMULÁRIO */
        <>
         

          <QuartoForm
            form={form}
            setForm={setForm}
            tipos={tipos}
            andares={andares}
            blocos={blocos}
            capacidades={capacidades}
            statusOpcoes={statusOpcoes}
            comodidadesOpcoes={comodidadesOpcoes}
            atualizar={atualizar}
            alternarComodidade={alternarComodidade}
            formatarMoeda={formatarMoeda}
            localizacao={localizacao}
            formularioVazio={formularioVazio}
            icons={icons}
            onSubmit={confirmarCadastro}
          />
          <div className={styles.bottomActions}>
            <button
            type="button"
            className={styles.backButton}
          onClick={() => router.push("/quartos")}
               >
             ← Voltar para Quartos
           </button>
          </div>
        </>
      )}
    </>
  );
}