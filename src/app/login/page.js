"use client";

import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className={styles.container}>

      {/* ================= LADO ESQUERDO ================= */}
      <section className={styles.loginSide}>

        <header className={styles.header}>

          <div className={styles.logo}>
            <div className={styles.logoIcon}>▦</div>

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
            ◉ Português (Brasil)
          </span>

        </header>


        <div className={styles.loginContent}>

          <h1>
            Bem-vindo ao HotelPro
          </h1>

          <p className={styles.description}>
            Acesse sua conta administrativa para gerenciar reservas e
            operações do hotel.
          </p>


          <form
            className={styles.form}
            onSubmit={handleLogin}
          >

            <label htmlFor="usuario">
              Usuário ou E-mail
            </label>

            <input
              id="usuario"
              type="text"
              placeholder="ex: admin_joao"
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
                placeholder="••••••••"
              />

              <span className={styles.eye}>
                ◉
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


            <button
              type="submit"
              className={styles.loginButton}
            >
              Entrar no Sistema
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


        {/* ================= RODAPÉ ================= */}

        <footer className={styles.footer}>

          <span>
            HotelPro Admin © 2024
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
            🛡 ACESSO SEGURO & CRIPTOGRAFADO
          </span>


          <h2>
            Excelência em Gestão
            <br />
            Hoteleira.
          </h2>


          <p>
            Potencialize a operação do seu hotel com ferramentas
            precisas de check-in, reservas e controle financeiro.
          </p>


          {/* ================= BENEFÍCIOS ================= */}

          <div className={styles.features}>

            <span>
              <b>✓</b>
              Gestão em tempo real
            </span>

            <span>
              <b>⌁</b>
              Indicadores de ocupação
            </span>

            <span>
              <b>▣</b>
              Faturamento integrado
            </span>

            <span>
              <b>♧</b>
              Suporte 24/7
            </span>

          </div>


          {/* ================= DEPOIMENTO ================= */}

          <div className={styles.testimonial}>

            <div className={styles.stars}>
              ★★★★★
            </div>

            <p>
              O HotelPro Admin transformou nossa produtividade na
              recepção do hotel. A interface é rápida e extremamente
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
                  Gerente de Operações
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}