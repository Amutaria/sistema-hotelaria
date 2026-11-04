"use client";

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuartoForm from "../../_components/QuartoForm";
import { icons } from "../../../_components/icons";
import styles from "../../novo/novo.module.css";

const tipos = ["Standard", "Luxo", "Suíte"];

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
  "Livre",
  "Ocupado",
  "Reservado",
  "Manutenção",
];

const comodidadesOpcoes = [
  "Wi-Fi Grátis",
  "Ar Condicionado",
  "Frigobar",
  "TV a Cabo",
  "TV Cabo 4K",
  "Vista Mar",
  "Cama King Size",
  "Banheira",
];

const formularioVazio = {
  numero: "",
  tipo: "",
  andar: "",
  bloco: "",
  capacidade: "",
  diaria: "",
  status: "Livre",
  comodidades: [],
};

function formatarMoeda(valor) {
  const numero = valor.replace(/\D/g, "");

  if (!numero) return "";

  return (Number(numero) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function EditarQuartoPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(formularioVazio);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarQuarto() {
      try {
        const resposta = await fetch(`/api/quartos/${id}`);

        if (!resposta.ok) {
          alert("Quarto não encontrado.");
          router.push("/quartos");
          return;
        }

        const quarto = await resposta.json();

        setForm({
          numero: String(quarto.numero),
          tipo: quarto.tipo || "",
          andar: quarto.andar || "",
          bloco: quarto.bloco || "",
          capacidade: `${quarto.capacidade} Hóspedes`,
          diaria: formatarMoeda(String(quarto.diaria * 100)),
          status: quarto.status || "Livre",
          comodidades: Array.isArray(quarto.comodidades)
            ? quarto.comodidades
            : [],
        });
      } catch (erro) {
        console.error("Erro ao carregar quarto:", erro);
        alert("Erro ao carregar o quarto.");
      } finally {
        setCarregando(false);
      }
    }

    carregarQuarto();
  }, [id, router]);

  function atualizar(campo) {
    return (e) => {
      setForm((f) => ({
        ...f,
        [campo]: e.target.value,
      }));
    };
  }

  function alternarComodidade(item) {
    setForm((f) => {
      const existe = f.comodidades.includes(item);

      return {
        ...f,
        comodidades: existe
          ? f.comodidades.filter((c) => c !== item)
          : [...f.comodidades, item],
      };
    });
  }

  const localizacao =
    form.andar && form.bloco
      ? `${form.andar} - ${form.bloco}`
      : form.andar || form.bloco || "—";

  async function salvarAlteracoes(e) {
    e.preventDefault();

    const dadosQuarto = {
      numero: Number(form.numero),
      tipo: form.tipo,
      andar: form.andar,
      bloco: form.bloco,
      capacidade: Number(form.capacidade.replace(/\D/g, "")),
      diaria: Number(form.diaria.replace(/\D/g, "")) / 100,
      status: form.status,
      comodidades: form.comodidades,
    };

    try {
      const resposta = await fetch(`/api/quartos/${id}`, {
        method: "PUT",
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

      alert("Quarto atualizado com sucesso!");
      router.push(`/quartos/${id}`);
    } catch (erro) {
      console.error("Erro ao atualizar quarto:", erro);
      alert("Erro ao atualizar o quarto.");
    }
  }

  if (carregando) {
    return <p>Carregando quarto...</p>;
  }

 return (
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
      onSubmit={salvarAlteracoes}
      mostrarStatus={false}
    />

    <div className={styles.bottomActions}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => router.push(`/quartos/${id}`)}
      >
        ← Voltar para Detalhes do Quarto
      </button>
    </div>
  </>
);
}