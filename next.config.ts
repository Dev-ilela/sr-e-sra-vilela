import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As fontes da arte de compartilhar são lidas do disco em tempo de execução.
  outputFileTracingIncludes: {
    "/mural/[id]/opengraph-image": ["./assets/fontes/**"],
    "/mural/[id]/twitter-image": ["./assets/fontes/**"],
  },
  // Atalho fácil de lembrar para o painel dos presentes (a sessão vive em /mural/noivos).
  async redirects() {
    return [
      { source: "/presentes/noivos", destination: "/mural/noivos/presentes", permanent: false },
      { source: "/noivos", destination: "/mural/noivos", permanent: false },
    ];
  },
};

export default nextConfig;
