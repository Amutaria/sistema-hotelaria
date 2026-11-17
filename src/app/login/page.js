"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);


const handleLogin = async (e) => {
  e.preventDefault();

  setErro("");
  setCarregando(true);

  try {
    console.log("Iniciando autenticaÃ§Ã£o...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.error("Erro do Supabase:", error);
      setErro("NÃ£o foi possÃ­vel entrar. Verifique seu e-mail e senha.");
      setCarregando(false);
      return;
    }

    console.log("AutenticaÃ§Ã£o concluÃ­da:", data.user?.email);
    console.log("Redirecionando para o dashboard...");

    router.replace("/dashboard");
    router.refresh();

   } catch (err) {
    console.error("Erro inesperado no login:", err);
    setErro("Ocorreu um erro inesperado. Tente novamente.");
    setCarregando(false);
   }
  };


  return (
    <main className={styles.container}>

      {/* ================= LADO ESQUERDO ================= */}
      <section className={styles.loginSide}>

        <header className={styles.header}>

          <div className={styles.logo}>
            <div className={styles.logoIcon}>â–¦</div>

            <div>
              <span className={styles.logoTitle}>
                Grand Plaza
              </span>

              <small>
                CENTRAL DE RESERVAS
              </small>
            </div>
          </div>

          <span className={styles.language}>
            â—‰ PortuguÃªs (Brasil)
          </span>

        </header>


        <div className={styles.loginContent}>

          <h1>
            Bem-vindo ao HotelPro
          </h1>

          <p className={styles.description}>
            Acesse sua conta administrativa para gerenciar reservas e
            operaÃ§Ãµes do hotel.
          </p>


          <form
            className={styles.form}
            onSubmit={handleLogin}
          >

            <label htmlFor="usuario">
              UsuÃ¡rio ou E-mail
            </label>

            <input
              id="usuario"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />


            <div className={styles.passwordLabel}>

              <label htmlFor="senha">
                Senha
              </label>

              <a href="#">
                Esqueci minha senha
              </a>

            </div>


            <div className={styles.passwordInput}>

              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />

              <span className={styles.eye}>
                â—‰
              </span>

            </div>


            <label className={styles.checkbox}>

              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                Manter conectado neste dispositivo
              </span>

            </label>

            {erro && (
              <p role="alert" style={{ color: "#dc2626" }}>
                {erro}
              </p>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar no Sistema"}
            </button>

          </form>


          {/* ================= AJUDA ================= */}

          <div className={styles.helpBox}>

            <div className={styles.helpIcon}>
              i
            </div>

            <div>

              <strong>
                Precisa de ajuda?
              </strong>

              <p>
                Caso tenha problemas com seu acesso, entre em contato
                com o suporte de T.I. da unidade ou ligue para{" "}
                <strong>0800-HOTELPRO</strong>.
              </p>

            </div>

          </div>

        </div>


        {/* ================= RODAPÃ‰ ================= */}

        <footer className={styles.footer}>

          <span>
            HotelPro Admin Â© 2024
          </span>

          <span>
            Privacidade
          </span>

          <span>
            Termos de Uso
          </span>

          <span>
            Suporte
          </span>

        </footer>

      </section>


      {/* ================= LADO DIREITO ================= */}

      <section className={styles.imageSide}>

        <div className={styles.overlay}></div>

        <div className={styles.presentation}>

          <span className={styles.secure}>
            ðŸ›¡ ACESSO SEGURO & CRIPTOGRAFADO
          </span>


          <h2>
            ExcelÃªncia em GestÃ£o
            <br />
            Hoteleira.
          </h2>


          <p>
            Potencialize a operaÃ§Ã£o do seu hotel com ferramentas
            precisas de check-in, reservas e controle financeiro.
          </p>


          {/* ================= BENEFÃCIOS ================= */}

          <div className={styles.features}>

            <span>
              <b>âœ“</b>
              GestÃ£o em tempo real
            </span>

            <span>
              <b>âŒ</b>
              Indicadores de ocupaÃ§Ã£o
            </span>

            <span>
              <b>â–£</b>
              Faturamento integrado
            </span>

            <span>
              <b>â™§</b>
              Suporte 24/7
            </span>

          </div>


          {/* ================= DEPOIMENTO ================= */}

          <div className={styles.testimonial}>

            <div className={styles.stars}>
              â˜…â˜…â˜…â˜…â˜…
            </div>

            <p>
              O HotelPro Admin transformou nossa produtividade na
              recepÃ§Ã£o do hotel. A interface Ã© rÃ¡pida e extremamente
              intuitiva para o dia a dia.
            </p>


            <div className={styles.testimonialUser}>

              <div className={styles.avatar}>
                DP
              </div>

              <div>

                <strong>
                  Daniel Pinto Silva
                </strong>

                <small>
                  Gerente de OperaÃ§Ãµes
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
