
"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./meu-perfil.module.css";

const perfilInicial = {
  nome_completo: "",
  cpf: "",
  telefone: "",
  endereco: "",
  cep: "",
};

function iniciais(nome = "") {
  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function MeuPerfilPage() {
  const [supabase] = useState(() => createClient());

  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(perfilInicial);
  const [perfilOriginal, setPerfilOriginal] = useState(perfilInicial);

  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mostrarFormularioEmail, setMostrarFormularioEmail] =
    useState(false);

  const [mostrarFormularioSenha, setMostrarFormularioSenha] =
    useState(false);

  // Alteração de e-mail
  const [novoEmail, setNovoEmail] = useState("");
  const [alterandoEmail, setAlterandoEmail] = useState(false);
  const [mensagemEmail, setMensagemEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");

  // Alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      setCarregando(true);
      setErro("");

      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        setErro("Não foi possível identificar o usuário autenticado.");
        setCarregando(false);
        return;
      }

      setUsuario(user);

      const { data, error: erroPerfil } = await supabase
        .from("perfis")
        .select("user_id, perfil, nome_completo, cpf, telefone, endereco, cep")
        .eq("user_id", user.id)
        .maybeSingle();

      if (erroPerfil) {
        setErro("Não foi possível carregar os dados do perfil.");
        setCarregando(false);
        return;
      }

      if (!data) {
        setErro(
          "Não encontramos um registro de perfil para esta conta. Solicite ao administrador a verificação do cadastro."
        );
        setCarregando(false);
        return;
      }

      const dados = {
        nome_completo:
          data.nome_completo ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "",
        telefone: data.telefone || "",
        endereco: data.endereco || "",
        cep: data.cep || "",
        cpf: data.cpf || "",
      };

      setPerfil(dados);
      setPerfilOriginal(dados);
      setCarregando(false);
    }

    carregarPerfil();
  }, [supabase]);

  function atualizarCampo(campo, valor) {
    setPerfil((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function cancelarEdicao() {
    setPerfil(perfilOriginal);
    setEditando(false);
    setMensagem("");
    setErro("");
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    if (!usuario) {
      setErro("Usuário não autenticado.");
      return;
    }

    if (!perfil.nome_completo.trim()) {
      setErro("Informe seu nome completo.");
      return;
    }

    setSalvando(true);
    setMensagem("");
    setErro("");

    const { error: erroSalvar } = await supabase
      .from("perfis")
      .update({
        nome_completo: perfil.nome_completo.trim(),
        cpf: perfil.cpf.trim(),
        telefone: perfil.telefone.trim(),
        endereco: perfil.endereco.trim(),
        cep: perfil.cep.trim(),
      })
      .eq("user_id", usuario.id);

    if (erroSalvar) {
      console.error("Erro ao salvar perfil:", errorSalvar);
      setErro("Não foi possível salvar as alterações. Tente novamente.");
      setSalvando(false);
      return;
    }

    const dadosSalvos = {
      nome_completo: perfil.nome_completo.trim(),
      cpf: perfil.cpf.trim(),
      telefone: perfil.telefone.trim(),
      endereco: perfil.endereco.trim(),
      cep: perfil.cep.trim(),
    };

    setPerfil(dadosSalvos);
    setPerfilOriginal(dadosSalvos);
    setEditando(false);
    setMensagem("Perfil atualizado com sucesso.");
    setSalvando(false);
  }

  if (carregando) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Carregando seu perfil...</div>
      </div>
    );
  }

  async function solicitarAlteracaoEmail(event) {
    event.preventDefault();

    setErroEmail("");
    setMensagemEmail("");

    const email = novoEmail.trim();

    if (!email) {
        setErroEmail("Informe o novo e-mail.");
        return;
    }

    if (email === usuario.email) {
        setErroEmail("O novo e-mail deve ser diferente do atual.");
        return;
    }

    setAlterandoEmail(true);

    try {
        const { error } = await supabase.auth.updateUser({
        email,
        });

        if (error) {
        setErroEmail(error.message);
        return;
        }

        setMensagemEmail(
        "Solicitação enviada. Verifique sua caixa de entrada para confirmar o novo e-mail."
        );

        setNovoEmail("");
    } catch (error) {
        setErroEmail(
        "Não foi possível solicitar a alteração do e-mail."
        );
    } finally {
        setAlterandoEmail(false);
    }
  }

  async function solicitarAlteracaoSenha(event) {
    event.preventDefault();

    setErroSenha("");
    setMensagemSenha("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        setErroSenha("Preencha todos os campos.");
        return;
    }

    if (novaSenha.length < 8) {
        setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        setErroSenha("A confirmação da senha não corresponde.");
        return;
    }

    setAlterandoSenha(true);

    try {
        // Confirma a senha atual do usuário
        const { error: erroAutenticacao } =
        await supabase.auth.signInWithPassword({
            email: usuario.email,
            password: senhaAtual,
        });

        if (erroAutenticacao) {
        setErroSenha("A senha atual está incorreta.");
        return;
        }

        // Atualiza a senha no Supabase Auth
        const { error: erroAtualizacao } =
        await supabase.auth.updateUser({
            password: novaSenha,
        });

        if (erroAtualizacao) {
        setErroSenha(erroAtualizacao.message);
        return;
        }

        setMensagemSenha("Senha alterada com sucesso.");

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
    } catch (error) {
        setErroSenha("Não foi possível alterar a senha.");
    } finally {
        setAlterandoSenha(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.topbarTitle}>
          Hotel Grand Plaza / Central de Reservas
        </span>

        <div className={styles.topbarUser}>
          <span>{usuario?.email || "Usuário"}</span>
        </div>
      </header>

      <section className={styles.banner}>
        <div className={styles.bannerBreadcrumb}>
          Sistema / Meu Perfil
        </div>

        <h1 className={styles.bannerTitle}>Meu Perfil</h1>

        <p className={styles.bannerText}>
          Consulte e atualize seus dados pessoais.
        </p>
      </section>

      <main className={styles.content}>
        <div className={styles.grid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelIcon}>👤</div>

              <div>
                <h2 className={styles.panelTitle}>Dados pessoais</h2>
                <p className={styles.panelSubtitle}>
                  Informações da sua conta
                </p>
              </div>
            </div>

            <div className={styles.profile}>
              <div className={styles.initials}>
                {iniciais(perfil.nome_completo) || "U"}
              </div>

              <div>
                <strong className={styles.profileName}>
                  {perfil.nome_completo || "Nome não informado"}
                </strong>

                <span className={styles.profileEmail}>
                  {usuario?.email || "E-mail não disponível"}
                </span>
              </div>
            </div>

            {erro && (
              <p className={`${styles.message} ${styles.error}`}>
                {erro}
              </p>
            )}

            {mensagem && (
              <p className={styles.message}>
                {mensagem}
              </p>
            )}

            <form className={styles.form} onSubmit={salvarPerfil}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="nome_completo">Nome completo</label>
                <input
                  id="nome_completo"
                  type="text"
                  value={perfil.nome_completo}
                  disabled={!editando || salvando}
                  onChange={(event) =>
                    atualizarCampo("nome_completo", event.target.value)
                  }
                  maxLength={150}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="cpf">CPF</label>
                <input
                    id="cpf"
                    type="text"
                    value={perfil.cpf}
                    disabled={!editando || salvando}
                    placeholder="000.000.000-00"
                    onChange={(event) =>
                        atualizarCampo("cpf", formatarCPF(event.target.value))
                    }
                    maxLength={14}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">E-mail corporativo</label>
                <input
                  id="email"
                  type="email"
                  value={usuario?.email || ""}
                  disabled
                />
                <span className={styles.helper}>
                  Gerenciado pela segurança da conta.
                </span>
              </div>

              <div className={styles.field}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="tel"
                  value={perfil.telefone}
                  disabled={!editando || salvando}
                  onChange={(event) =>
                    atualizarCampo("telefone", event.target.value)
                  }
                  maxLength={30}
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="endereco">Endereço</label>
                <input
                  id="endereco"
                  type="text"
                  value={perfil.endereco}
                  disabled={!editando || salvando}
                  onChange={(event) =>
                    atualizarCampo("endereco", event.target.value)
                  }
                  maxLength={250}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  type="text"
                  value={perfil.cep}
                  disabled={!editando || salvando}
                  onChange={(event) =>
                    atualizarCampo("cep", event.target.value)
                  }
                  maxLength={9}
                  placeholder="00000-000"
                />
              </div>

              <div className={styles.fullWidth}>
                <div className={styles.actions}>
                  {editando ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={cancelarEdicao}
                        disabled={salvando}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className={`${styles.button} ${styles.primaryButton}`}
                        disabled={salvando}
                      >
                        {salvando ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.button} ${styles.primaryButton}`}
                      onClick={() => {
                        setEditando(true);
                        setMensagem("");
                        setErro("");
                      }}
                    >
                      Editar perfil
                    </button>
                  )}
                </div>
              </div>
            </form>
          </section>

          <div className={styles.sideColumn}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}>🔒</div>

                <div>
                  <h2 className={styles.panelTitle}>
                    Segurança da conta
                  </h2>
                  <p className={styles.panelSubtitle}>
                    Acesso e autenticação
                  </p>
                </div>
              </div>

              <div className={styles.securityList}>
                <div className={styles.securityItem}>
                  <strong>E-mail de acesso</strong>

                  <span>
                    Seu e-mail é gerenciado pelo Supabase Auth.
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarFormularioEmail((valor) => !valor)
                    }
                  >
                    Alterar e-mail
                  </button>

                  {mostrarFormularioEmail && (
                    <div>
                    <form
                        className={styles.securityForm}
                        onSubmit={solicitarAlteracaoEmail}
                        >
                        <label htmlFor="novoEmail">Novo e-mail</label>

                        <input
                            id="novoEmail"
                            type="email"
                            value={novoEmail}
                            onChange={(event) => setNovoEmail(event.target.value)}
                            placeholder="Digite seu novo e-mail"
                            required
                            disabled={alterandoEmail}
                        />

                        {erroEmail && (
                            <p className={styles.error}>{erroEmail}</p>
                        )}

                        {mensagemEmail && (
                            <p className={styles.success}>{mensagemEmail}</p>
                        )}

                        <button type="submit" disabled={alterandoEmail}>
                            {alterandoEmail ? "Enviando..." : "Solicitar alteração"}
                        </button>
                        </form>
                    </div>
                  )}
                </div>

                <div className={styles.securityItem}>
                  <strong>Senha</strong>

                  <span>
                    A senha é protegida pelo sistema de autenticação.
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarFormularioSenha((valor) => !valor)
                    }
                  >
                    Alterar senha
                  </button>

                  {mostrarFormularioSenha && (
                    <div>
                      <form
                        className={styles.securityForm}
                        onSubmit={solicitarAlteracaoSenha}
                      >
                      <label htmlFor="senhaAtual">Senha atual</label>
                      <div className={styles.passwordWrapper}>
                        <input
                            id="senhaAtual"
                            type={mostrarSenhaAtual ? "text" : "password"}
                            value={senhaAtual}
                            onChange={(event) => setSenhaAtual(event.target.value)}
                            placeholder="Digite sua senha atual"
                            required
                            disabled={alterandoSenha}
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setMostrarSenhaAtual((valor) => !valor)}
                            aria-label={mostrarSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarSenhaAtual ? "🙈" : "👁"}
                        </button>
                      </div>

                      <label htmlFor="novaSenha">Nova senha</label>
                      <div className={styles.passwordWrapper}>
                        <input
                            id="novaSenha"
                            type={mostrarNovaSenha ? "text" : "password"}
                            value={novaSenha}
                            onChange={(event) => setNovaSenha(event.target.value)}
                            placeholder="Digite a nova senha"
                            required
                            disabled={alterandoSenha}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setMostrarNovaSenha((valor) => !valor)}
                            aria-label={mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarNovaSenha ? "🙈" : "👁"}
                        </button>
                      </div>

                      <label htmlFor="confirmarSenha">Confirmar nova senha</label>
                      <div className={styles.passwordWrapper}>
                        <input
                            id="confirmarSenha"
                            type={mostrarConfirmarSenha ? "text" : "password"}
                            value={confirmarSenha}
                            onChange={(event) => setConfirmarSenha(event.target.value)}
                            placeholder="Confirme a nova senha"
                            required
                            disabled={alterandoSenha}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() =>
                            setMostrarConfirmarSenha((valor) => !valor)
                            }
                            aria-label={
                            mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                            }
                        >
                            {mostrarConfirmarSenha ? "🙈" : "👁"}
                        </button>
                      </div>

                      {erroSenha && (
                            <p className={styles.error}>{erroSenha}</p>
                      )}

                      {mensagemSenha && (
                            <p className={styles.success}>{mensagemSenha}</p>
                      )}

                      <button type="submit" disabled={alterandoSenha}>
                            {alterandoSenha ? "Alterando..." : "Salvar nova senha"}
                      </button>
                     </form>
                   </div>
                        )}
                    </div>

                    <div className={styles.securityItem}>
                      <strong>Permissão no sistema</strong>
                      <span>
                        Seu perfil de acesso é administrado separadamente
                        e não pode ser alterado nesta página.
                    </span>
                    </div>
                  </div>
                </section>
          </div>
        </div>
      </main>
    </div>
  );
}
