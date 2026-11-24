
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function aplicarMascaraData(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);

  if (numeros.length <= 2) return numeros;

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

function converterParaISO(data) {
  const partes = data.split("/");

  if (partes.length !== 3 || partes[2].length !== 4) {
    return null;
  }

  const [dia, mes, ano] = partes.map(Number);

  const dataObj = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    dataObj.getUTCDate() !== dia ||
    dataObj.getUTCMonth() !== mes - 1 ||
    dataObj.getUTCFullYear() !== ano
  ) {
    return null;
  }

  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function formatarData(data) {
  if (!data) return "";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function EditarReservaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [reserva, setReserva] = useState(null);
  const [quartos, setQuartos] = useState([]);

  const [quartoId, setQuartoId] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [pagamento, setPagamento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respostaReserva, respostaQuartos] = await Promise.all([
          fetch(`/api/reservas/${id}`),
          fetch("/api/quartos"),
        ]);

        const dadosReserva = await respostaReserva.json();
        const dadosQuartos = await respostaQuartos.json();

        if (!respostaReserva.ok) {
          throw new Error(
            dadosReserva.erro || "Não foi possível carregar a reserva."
          );
        }

        if (!respostaQuartos.ok) {
          throw new Error(
            dadosQuartos.erro || "Não foi possível carregar os quartos."
          );
        }

        const dados = dadosReserva.reserva ?? dadosReserva;

        if (dados.status !== "Confirmada") {
          throw new Error(
            "Somente reservas confirmadas podem ser editadas."
          );
        }

        setReserva(dados);
        setQuartos(Array.isArray(dadosQuartos) ? dadosQuartos : []);

        setQuartoId(String(dados.id_quarto));
        setDataEntrada(formatarData(dados.data_entrada));
        setDataSaida(formatarData(dados.data_saida));
        setQuantidadePessoas(dados.quantidade_pessoas);
        setPagamento(dados.pagamento || "");
        setObservacoes(dados.observacoes || "");
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarDados();
  }, [id]);

  async function salvarAlteracoes(event) {
    event.preventDefault();
    setErro("");

    const entradaISO = converterParaISO(dataEntrada);
    const saidaISO = converterParaISO(dataSaida);

    if (!entradaISO || !saidaISO) {
      setErro("Informe datas válidas no formato dd/mm/aaaa.");
      return;
    }

    if (saidaISO <= entradaISO) {
      setErro("A data de saída deve ser posterior à entrada.");
      return;
    }

    if (!quartoId) {
      setErro("Selecione um quarto.");
      return;
    }

    if (
      !Number.isInteger(Number(quantidadePessoas)) ||
      Number(quantidadePessoas) <= 0
    ) {
      setErro("Informe uma quantidade válida de pessoas.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`/api/reservas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quartoId: Number(quartoId),
          dataEntrada: entradaISO,
          dataSaida: saidaISO,
          quantidadePessoas: Number(quantidadePessoas),
          pagamento,
          observacoes,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || resultado.mensagem || "Erro ao atualizar reserva."
        );
      }

      alert("Reserva atualizada com sucesso!");
      router.push("/reservas");
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <p style={{ padding: 24 }}>Carregando dados da reserva...</p>;
  }

  if (erro && !reserva) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "#b42318" }}>{erro}</p>
        <button onClick={() => router.push("/reservas")}>
          Voltar para reservas
        </button>
      </div>
    );
  }

  const quartosDisponiveis = quartos.filter((quarto) => {
    const ehQuartoAtual = String(quarto.id) === String(quartoId);

    return (
      ehQuartoAtual ||
      (quarto.status !== "Ocupado" &&
        quarto.status !== "Manutenção")
    );
  });

  const campo = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #d5d5d5",
    borderRadius: 6,
    fontSize: 14,
    background: "#fff",
    color: "#333",
  };

  const label = {
    display: "block",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#444",
  };

  return (
    <div
      style={{
        maxWidth: 850,
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: 16,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, color: "#333", marginBottom: 8 }}>
          Editar reserva
        </h1>

        <p style={{ color: "#777", fontSize: 14 }}>
          Reserva {reserva.codigo} — {reserva.status}
        </p>
      </div>

      <form
        onSubmit={salvarAlteracoes}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e5e5",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 24,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <label style={label}>Quarto</label>
            <select
              value={quartoId}
              onChange={(e) => setQuartoId(e.target.value)}
              style={campo}
              required
            >
              <option value="">Selecione um quarto</option>

              {quartosDisponiveis.map((quarto) => (
                <option key={quarto.id} value={quarto.id}>
                  Quarto {quarto.numero} — {quarto.tipo}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={label}>Quantidade de pessoas</label>
            <input
              type="number"
              min="1"
              value={quantidadePessoas}
              onChange={(e) => setQuantidadePessoas(e.target.value)}
              style={campo}
              required
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={label}>Data de entrada</label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              value={dataEntrada}
              onChange={(e) =>
                setDataEntrada(aplicarMascaraData(e.target.value))
              }
              maxLength={10}
              style={campo}
              required
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={label}>Data de saída</label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              value={dataSaida}
              onChange={(e) =>
                setDataSaida(aplicarMascaraData(e.target.value))
              }
              maxLength={10}
              style={campo}
              required
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={label}>Forma de pagamento</label>
            <select
              value={pagamento}
              onChange={(e) => setPagamento(e.target.value)}
              style={campo}
              required
            >
              <option value="">Selecione</option>
              <option value="Pix">Pix</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix Antecipado">Pix Antecipado</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <label style={label}>Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
            style={{ ...campo, resize: "vertical" }}
            placeholder="Observações sobre a reserva..."
          />
        </div>

        {erro && (
          <p style={{ color: "#b42318", marginTop: 16, fontSize: 14 }}>
            {erro}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/reservas")}
            disabled={salvando}
            style={{
              padding: "11px 18px",
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Voltar
          </button>

          <button
            type="submit"
            disabled={salvando}
            style={{
              padding: "11px 18px",
              border: "none",
              borderRadius: 6,
              background: "#967965",
              color: "#fff",
              cursor: salvando ? "not-allowed" : "pointer",
              opacity: salvando ? 0.7 : 1,
            }}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
