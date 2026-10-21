import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As fontes da arte de compartilhar são lidas do disco em tempo de execução.
  outputFileTracingIncludes: {
    "/mural/[id]/opengraph-image": ["./assets/fontes/**"],
    "/mural/[id]/twitter-image": ["./assets/fontes/**"],
  },
};

export default nextConfig;
