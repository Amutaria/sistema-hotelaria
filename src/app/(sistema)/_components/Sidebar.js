"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Playfair_Display } from "next/font/google";
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
  { label: "Configurações", href: "/configuracoes", icon: icons.settings },
  { label: "Suporte", href: "/suporte", icon: icons.help },
];
 
export default function Sidebar() {
  const pathname = usePathname();
 
  const renderItem = (item) => {
    const ativo = pathname === item.href || pathname.startsWith(item.href + "/");
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
 
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>{icons.building}</span>
        <div>
          <span className={`${styles.brandName} ${playfair.className}`}>Grand Plaza</span>
          <span className={styles.brandSub}>Central de Reservas</span>
        </div>
      </div>
 
      <nav className={styles.nav}>{menu.map(renderItem)}</nav>
 
      <div className={styles.sidebarFooter}>{footerMenu.map(renderItem)}</div>
    </aside>
  );
}