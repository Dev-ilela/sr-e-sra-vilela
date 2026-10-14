import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/jost/index.css";
import { casamento, dataPorExtenso } from "@/config/casamento";
import "./globals.css";

export const metadata: Metadata = {
  title: `${casamento.noivo} e ${casamento.noiva}`,
  description: `Nosso casamento, ${dataPorExtenso}.`,
};

export const viewport: Viewport = {
  themeColor: "#14233b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
