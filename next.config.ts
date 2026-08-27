import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Upload de imagens pelas Server Actions.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  /*
   * Essas bibliotecas executam somente no Node.js.
   *
   * Não queremos que o Turbopack tente empacotar
   * Remotion, esbuild e suas dependências nativas.
   */
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "esbuild",
  ],
};

export default nextConfig;