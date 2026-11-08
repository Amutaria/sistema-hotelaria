import { Inter } from "next/font/google";
import "./globals.css";
 
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
 
export const metadata = {
  title: "Grand Plaza | Central de Reservas",
  description: "Sistema de gestão de reservas do Hotel Grand Plaza",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}