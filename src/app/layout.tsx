import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/jost/index.css";
import { casamento, dataCurta } from "@/config/casamento";
import { RastroCursor } from "@/components/RastroCursor";
import "./globals.css";

const nomes = `${casamento.noivo} & ${casamento.noiva}`;
const descricao = `Acompanhe conosco nossa trajetória até o tão esperado ${dataCurta.replaceAll("/", ".")}`;

export const metadata: Metadata = {
  metadataBase: new URL(casamento.site),
  title: `${nomes} - ${dataCurta}`,
  description: descricao,
  openGraph: {
    title: nomes,
    description: descricao,
    url: "/",
    siteName: nomes,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: nomes,
    description: descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#14233b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <RastroCursor />
      </body>
    </html>
  );
}
