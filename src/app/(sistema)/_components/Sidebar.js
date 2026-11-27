
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { createClient } from "@/app/lib/supabase/client";
import { icons } from "./icons";
import styles from "./Sidebar.module.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500"] });

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: icons.dashboard },
  { label: "Reservas", href: "/reservas", icon: icons.calendar },
  { label: "Hóspedes", href: "/hospedes", icon: icons.users },
  { label: "Quartos", href: "/quartos", icon: icons.bed },
  { label: "Financeiro", href: "/financeiro", icon: icons.wallet },
  { label: "Relatórios", href: "/relatorios", icon: icons.chart },
];

const footerMenu = [
  { label: "Meu Perfil", href: "/meu-perfil", icon: icons.users },
  { label: "Configurações", href: "/configuracoes", icon: icons.settings },
  { label: "Suporte", href: "/suporte", icon: icons.help },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("perfis")
        .select("perfil")
        .single();

      if (error) {
        console.error("Erro ao carregar perfil:", error.message);
        return;
      }

      setPerfil(data?.perfil ?? null);
    };

    carregarPerfil();
  }, []);

  const menuVisivel =
    perfil === "admin"
      ? menu
      : menu.filter((item) =>
          ["/reservas", "/hospedes", "/quartos", "/financeiro"].includes(
            item.href
          )
        );

  const footerMenuVisivel =
    perfil === "admin"
      ? footerMenu
      : footerMenu.filter((item) => item.href === "/suporte");

  const renderItem = (item) => {
    const ativo =
      pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${styles.navItem} ${ativo ? styles.navItemActive : ""}`}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  const handleLogout = async () => {
    setCarregando(true);
    setErro("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error.message);
      setErro("Não foi possível sair. Tente novamente.");
      setCarregando(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>{icons.building}</span>
        <div>
          <span className={`${styles.brandName} ${playfair.className}`}>
            Grand Plaza
          </span>
          <span className={styles.brandSub}>Central de Reservas</span>
        </div>
      </div>

      <nav className={styles.nav}>{menuVisivel.map(renderItem)}</nav>

      <div className={styles.sidebarFooter}>
        {footerMenuVisivel.map(renderItem)}

        {erro && <p className={styles.logoutError}>{erro}</p>}

        <button
          type="button"
          className={`${styles.navItem} ${styles.logoutButton}`}
          onClick={handleLogout}
          disabled={carregando}
        >
          {icons.logout}
          <span>{carregando ? "Saindo..." : "Sair"}</span>
        </button>
      </div>
    </aside>
  );
}