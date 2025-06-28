import { defineConfig } from "vite";

import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: { port: 3000 },
  ssr: { noExternal: ["react-dropzone"] },
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({ target: "node-server" }),
  ],
});
