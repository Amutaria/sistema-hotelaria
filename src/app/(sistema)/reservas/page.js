
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { icons } from "../_components/icons";
import styles from "./reservas.module.css";

function aplicarMascaraData(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

function converterParaISO(data) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);

  if (!partes) return null;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);

  const dataObj = new Date(ano, mes - 1, dia);

  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() !== mes - 1 ||
    dataObj.getDate() !== dia
  ) {
    return null;
  }

  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function formatarData(valor) {
  if (!valor) return "Não informada";

  const texto = String(valor).split("T")[0];
  const partes = texto.split("-");

  if (partes.length !== 3) return texto;

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(valor) {
  if (!valor) return "Não informada";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não informada";
  }

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function obterSituacao(reserva) {
  const status = String(reserva.status || "Confirmada").toLowerCase();

  if (status.includes("cancel")) return "Cancelada";

  if (status.includes("finaliz") || status.includes("conclu")) {
    return "Finalizada";
  }

  if (status.includes("hosped") || status.includes("andamento")) {
    return "Em hospedagem";
  }

  return "Confirmada";
}

function obterClasseStatus(status) {
  switch (status) {
    case "Confirmada":
      return styles.statusConfirmada;
    case "Em hospedagem":
      return styles.statusAndamento;
    case "Finalizada":
      return styles.statusFinalizada;
    case "Cancelada":
      return styles.statusCancelada;
    default:
      return "";
  }
}

export default function ReservasPage() {
  const router = useRouter();

  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [tipoQuarto, setTipoQuarto] = useState("");
  const [capacidade, setCapacidade] = useState("");

  const [quartos, setQuartos] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [reservas, setReservas] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [erroHistorico, setErroHistorico] = useState("");
  const [buscaHistorico, setBuscaHistorico] = useState("");
  const [filtroHistorico, setFiltroHistorico] = useState("Todas");

  const [acaoEmAndamento, setAcaoEmAndamento] = useState(null);
  const [mensagemHistorico, setMensagemHistorico] = useState("");

  // Atualiza o histórico após uma ação
  const carregarReservas = useCallback(async () => {
    try {
      const resposta = await fetch("/api/reservas");
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível carregar o histórico."
        );
      }

      setReservas(Array.isArray(dados) ? dados : []);
      setErroHistorico("");
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setErroHistorico(error.message || "Erro ao carregar as reservas.");
    } finally {
      setCarregandoHistorico(false);
    }
  }, []);

  // Primeira consulta do histórico
  useEffect(() => {
    let ativo = true;

    fetch("/api/reservas")
      .then(async (resposta) => {
        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.erro || "Não foi possível carregar o histórico."
          );
        }

        return dados;
      })
      .then((dados) => {
        if (!ativo) return;

        setReservas(Array.isArray(dados) ? dados : []);
        setErroHistorico("");
      })
      .catch((error) => {
        console.error("Erro ao carregar histórico:", error);

        if (ativo) {
          setErroHistorico(
            error.message || "Erro ao carregar as reservas."
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregandoHistorico(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  function atualizarData(valor, setter) {
    setter(aplicarMascaraData(valor));
  }

  async function handleBuscar() {
    setErro("");
    setBuscou(false);

    const entradaISO = converterParaISO(dataEntrada);
    const saidaISO = converterParaISO(dataSaida);

    if (!entradaISO || !saidaISO) {
      setErro("Informe as datas no formato DD/MM/AAAA.");
      return;
    }

    if (saidaISO <= entradaISO) {
      setErro("A data de saída deve ser posterior à data de entrada.");
      return;
    }

    const quantidadePessoas = Number(capacidade) || 1;

    setCarregando(true);

    try {
      const parametros = new URLSearchParams({
        entrada: entradaISO,
        saida: saidaISO,
        pessoas: String(quantidadePessoas),
      });

      if (tipoQuarto) {
        parametros.set("tipo", tipoQuarto);
      }

      const resposta = await fetch(
        `/api/reservas/disponibilidade?${parametros.toString()}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
          dados.mensagem ||
          dados.error ||
          "Não foi possível consultar a disponibilidade."
        );
      }

      if (!Array.isArray(dados)) {
        throw new Error("A API retornou um formato de dados inesperado.");
      }

      const quartosOrdenados = [...dados].sort(
        (a, b) => Number(a.diaria) - Number(b.diaria)
      );

      setQuartos(quartosOrdenados);
      setBuscou(true);
    } catch (error) {
      setErro(error.message || "Erro ao consultar os quartos.");
      setQuartos([]);
    } finally {
      setCarregando(false);
    }
  }

  function handleReservar(quarto) {
    const entradaISO = converterParaISO(dataEntrada);
    const saidaISO = converterParaISO(dataSaida);

    const reservaSelecionada = {
      quartoId: quarto.id,
      quartoNumero: quarto.numero,
      tipoQuarto: quarto.tipo,
      diaria: quarto.diaria,
      capacidade: quarto.capacidade,
      dataEntrada: entradaISO,
      dataSaida: saidaISO,
      quantidadePessoas: Number(capacidade) || 1,
    };

    sessionStorage.setItem(
      "reservaSelecionada",
      JSON.stringify(reservaSelecionada)
    );

    router.push("/reservas/nova");
  }

  async function executarAcaoReserva(reserva, acao) {
    const situacao = obterSituacao(reserva);

    const configuracoes = {
      checkin: {
        endpoint: `/api/reservas/${reserva.id}/check-in`,
        metodo: "POST",
        confirmacao: "Deseja realizar o check-in desta reserva?",
      },
      checkout: {
        endpoint: `/api/reservas/${reserva.id}/check-out`,
        metodo: "POST",
        confirmacao: "Deseja realizar o check-out desta reserva?",
      },
      cancelar: {
        endpoint: `/api/reservas/${reserva.id}`,
        metodo: "DELETE",
        confirmacao: "Deseja realmente cancelar esta reserva?",
      },
    };

    const configuracao = configuracoes[acao];

    if (!configuracao) return;
    if (acao === "checkin" && situacao !== "Confirmada") return;
    if (acao === "checkout" && situacao !== "Em hospedagem") return;
    if (acao === "cancelar" && situacao !== "Confirmada") return;

    if (!window.confirm(configuracao.confirmacao)) return;

    try {
      setAcaoEmAndamento(`${reserva.id}-${acao}`);
      setMensagemHistorico("");

      const resposta = await fetch(configuracao.endpoint, {
        method: configuracao.metodo,
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
          dados.mensagem ||
          "Não foi possível atualizar a reserva."
        );
      }

      setMensagemHistorico(
        dados.mensagem || "Reserva atualizada com sucesso."
      );

      await carregarReservas();
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      setMensagemHistorico(
        error.message || "Erro ao atualizar a reserva."
      );
    } finally {
      setAcaoEmAndamento(null);
    }
  }

  const reservasOrganizadas = [...reservas].sort((a, b) => {
    const dataA = new Date(a.criadoEm || a.dataEntrada || 0).getTime();
    const dataB = new Date(b.criadoEm || b.dataEntrada || 0).getTime();

    return dataB - dataA;
  });

  const reservasFiltradas = reservasOrganizadas.filter((reserva) => {
    const situacao = obterSituacao(reserva);

    const nomeHospede = reserva.hospede?.nome || "";
    const codigo = reserva.codigo || "";
    const numeroQuarto = String(reserva.quartoNumero || "");

    const termo = buscaHistorico.trim().toLowerCase();

    const correspondeBusca =
      nomeHospede.toLowerCase().includes(termo) ||
      codigo.toLowerCase().includes(termo) ||
      numeroQuarto.toLowerCase().includes(termo);

    let correspondeFiltro = true;

    if (filtroHistorico === "Ativas") {
      correspondeFiltro =
        situacao === "Confirmada" ||
        situacao === "Em hospedagem";
    } else if (filtroHistorico === "Finalizadas") {
      correspondeFiltro = situacao === "Finalizada";
    } else if (filtroHistorico === "Canceladas") {
      correspondeFiltro = situacao === "Cancelada";
    }

    return correspondeBusca && correspondeFiltro;
  });

  return (
    <>
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>
          Hotel Grand Plaza / Central de Reservas
        </span>

        <div className={styles.topbarUser}>
          <span>Admin Painel</span>
          <div className={styles.avatar} />
        </div>
      </header>

      <section className={styles.banner}>
        <span className={styles.breadcrumb}>
          Reservas &gt; Disponibilidade e Histórico
        </span>

        <h1 className={styles.bannerTitle}>
          Central de Reservas
        </h1>

        <p className={styles.bannerText}>
          Consulte a disponibilidade, encontre o quarto ideal e acompanhe
          as reservas realizadas no hotel.
        </p>
      </section>

      <main className={styles.page}>
        <div className={styles.content}>
          <section className={styles.filtros}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Consultar disponibilidade
              </h2>

              <p className={styles.sectionDescription}>
                Preencha os dados abaixo para encontrar quartos disponíveis.
              </p>
            </div>

            <div className={styles.toolbar}>
              <div className={styles.campo}>
                <label htmlFor="dataEntrada">Data de entrada</label>

                <div className={styles.dateBox}>
                  {icons.calendar}

                  <input
                    id="dataEntrada"
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={dataEntrada}
                    maxLength={10}
                    onChange={(e) =>
                      atualizarData(e.target.value, setDataEntrada)
                    }
                  />
                </div>
              </div>

              <div className={styles.campo}>
                <label htmlFor="dataSaida">Data de saída</label>

                <div className={styles.dateBox}>
                  {icons.calendar}

                  <input
                    id="dataSaida"
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={dataSaida}
                    maxLength={10}
                    onChange={(e) =>
                      atualizarData(e.target.value, setDataSaida)
                    }
                  />
                </div>
              </div>

              <div className={styles.campo}>
                <label htmlFor="tipoQuarto">Tipo de quarto</label>

                <div className={styles.selectBox}>
                  <select
                    id="tipoQuarto"
                    value={tipoQuarto}
                    onChange={(e) => setTipoQuarto(e.target.value)}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="Standard">Standard</option>
                    <option value="Luxo">Luxo</option>
                    <option value="Suíte">Suíte</option>
                  </select>
                </div>
              </div>

              <div className={styles.campo}>
                <label htmlFor="capacidade">Quantidade de pessoas</label>

                <div className={styles.selectBox}>
                  <select
                    id="capacidade"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                    <option value="3">3 pessoas</option>
                    <option value="4">4 pessoas</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className={styles.newButton}
                onClick={handleBuscar}
                disabled={carregando}
              >
                {icons.search}
                {carregando ? "Consultando..." : "Buscar quartos"}
              </button>
            </div>

            {erro && (
              <p className={styles.erro}>{erro}</p>
            )}
          </section>

          {buscou && (
            <section className={styles.locationSection}>
              <div className={styles.resultadoHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>
                    Quartos disponíveis
                  </h2>

                  <p className={styles.resultadoDescricao}>
                    {quartos.length} quarto(s) encontrado(s) para o período.
                  </p>
                </div>
              </div>

              {quartos.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>Nenhum quarto disponível</h3>

                  <p>
                    Não encontramos quartos disponíveis para o período
                    informado. Tente alterar as datas ou os filtros.
                  </p>
                </div>
              ) : (
                <div className={styles.roomsGrid}>
                  {quartos.map((quarto) => (
                    <article
                      key={quarto.id}
                      className={styles.roomCard}
                    >
                      <div className={styles.roomHeader}>
                        <div>
                          <span className={styles.roomId}>
                            ID: {quarto.id}
                          </span>

                          <h3>Quarto {quarto.numero}</h3>
                        </div>

                        <span className={styles.badgeDisponivel}>
                          Disponível
                        </span>
                      </div>

                      <p className={styles.roomInfo}>
                        Tipo: <strong>{quarto.tipo}</strong>
                      </p>

                      <p className={styles.roomInfo}>
                        Capacidade:{" "}
                        <strong>{quarto.capacidade} pessoas</strong>
                      </p>

                      <p className={styles.roomInfo}>
                        Andar:{" "}
                        <strong>{quarto.andar || "Não informado"}</strong>
                      </p>

                      <p className={styles.roomInfo}>
                        Diária:{" "}
                        <strong className={styles.price}>
                          {formatarMoeda(quarto.diaria)}
                        </strong>
                      </p>

                      {quarto.comodidades && (
                        <p className={styles.roomInfo}>
                          Comodidades:{" "}
                          <strong>
                            {Array.isArray(quarto.comodidades)
                              ? quarto.comodidades.join(", ")
                              : quarto.comodidades}
                          </strong>
                        </p>
                      )}

                      <button
                        type="button"
                        className={styles.detailsButton}
                        onClick={() => handleReservar(quarto)}
                      >
                        Reservar Quarto
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className={styles.historicoSection}>
            <div className={styles.historicoHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  Histórico de Reservas
                </h2>

                <p className={styles.sectionDescription}>
                  Consulte e gerencie as reservas realizadas no hotel.
                </p>
              </div>

              <span className={styles.historicoTotal}>
                {reservas.length} reserva(s)
              </span>
            </div>

            <div className={styles.historicoFiltros}>
              <div className={styles.historicoBusca}>
                {icons.search}

                <input
                  type="text"
                  placeholder="Buscar por hóspede, código ou quarto..."
                  value={buscaHistorico}
                  onChange={(e) => setBuscaHistorico(e.target.value)}
                />
              </div>

              <div className={styles.historicoAbas}>
                {["Todas", "Ativas", "Finalizadas", "Canceladas"].map(
                  (opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      className={
                        filtroHistorico === opcao
                          ? styles.abaAtiva
                          : styles.abaHistorico
                      }
                      onClick={() => setFiltroHistorico(opcao)}
                    >
                      {opcao}
                    </button>
                  )
                )}
              </div>
            </div>

            {mensagemHistorico && (
              <p className={styles.mensagemHistorico}>
                {mensagemHistorico}
              </p>
            )}

            {carregandoHistorico ? (
              <div className={styles.historicoVazio}>
                Carregando reservas...
              </div>
            ) : erroHistorico ? (
              <div className={styles.historicoErro}>
                {erroHistorico}
              </div>
            ) : reservasFiltradas.length === 0 ? (
              <div className={styles.historicoVazio}>
                <h3>Nenhuma reserva encontrada</h3>

                <p>
                  Não há reservas correspondentes à pesquisa ou ao filtro
                  selecionado.
                </p>
              </div>
            ) : (
              <div className={styles.historicoLista}>
                {reservasFiltradas.map((reserva) => {
                  const situacao = obterSituacao(reserva);

                  const valorTotal =
                    reserva.valores?.total ?? reserva.total ?? 0;

                  const acaoBloqueada = acaoEmAndamento !== null;

                  return (
                    <article
                      key={reserva.id}
                      className={styles.reservaCard}
                    >
                      <div className={styles.reservaCardHeader}>
                        <div>
                          <span className={styles.reservaCodigo}>
                            {reserva.codigo || `Reserva #${reserva.id}`}
                          </span>

                          <h3 className={styles.reservaHospede}>
                            {reserva.hospede?.nome ||
                              "Hóspede não informado"}
                          </h3>
                        </div>

                        <span
                          className={`${styles.statusHistorico} ${obterClasseStatus(situacao)}`}
                        >
                          {situacao}
                        </span>
                      </div>

                      <div className={styles.reservaDados}>
                        <div>
                          <span className={styles.dadoLabel}>Quarto</span>
                          <strong>
                            {reserva.quartoNumero || reserva.quartoId || "—"}
                          </strong>
                        </div>

                        <div>
                          <span className={styles.dadoLabel}>Entrada</span>
                          <strong>
                            {formatarData(reserva.dataEntrada)}
                          </strong>
                        </div>

                        <div>
                          <span className={styles.dadoLabel}>Saída</span>
                          <strong>
                            {formatarData(reserva.dataSaida)}
                          </strong>
                        </div>

                        <div>
                          <span className={styles.dadoLabel}>Pessoas</span>
                          <strong>
                            {reserva.quantidadePessoas || "—"}
                          </strong>
                        </div>

                        <div>
                          <span className={styles.dadoLabel}>
                            Valor total
                          </span>

                          <strong className={styles.reservaValor}>
                            {formatarMoeda(valorTotal)}
                          </strong>
                        </div>
                      </div>

                      <div className={styles.reservaRodape}>
                        <span>
                          Cadastrada em:{" "}
                          {formatarDataHora(reserva.criadoEm)}
                        </span>

                        <span>
                          Pagamento:{" "}
                          {reserva.pagamento || "Não informado"}
                        </span>
                      </div>

                      {situacao === "Confirmada" && (
                        <div className={styles.acoesReserva}>
                          <button
                            type="button"
                            className={styles.botaoCheckin}
                            disabled={acaoBloqueada}
                            onClick={() =>
                              executarAcaoReserva(reserva, "checkin")
                            }
                          >
                            {acaoEmAndamento === `${reserva.id}-checkin`
                              ? "Realizando check-in..."
                              : "Realizar check-in"}
                          </button>

                          <button
                            type="button"
                            className={styles.botaoCancelar}
                            disabled={acaoBloqueada}
                            onClick={() =>
                              executarAcaoReserva(reserva, "cancelar")
                            }
                          >
                            {acaoEmAndamento === `${reserva.id}-cancelar`
                              ? "Cancelando..."
                              : "Cancelar reserva"}
                          </button>
                        </div>
                      )}

                      {situacao === "Em hospedagem" && (
                        <div className={styles.acoesReserva}>
                          <button
                            type="button"
                            className={styles.botaoCheckout}
                            disabled={acaoBloqueada}
                            onClick={() =>
                              executarAcaoReserva(reserva, "checkout")
                            }
                          >
                            {acaoEmAndamento === `${reserva.id}-checkout`
                              ? "Realizando check-out..."
                              : "Realizar check-out"}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
