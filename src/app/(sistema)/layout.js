import Sidebar from "./_components/Sidebar";
import styles from "./layout.module.css";

export default function SistemaLayout({ children }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}