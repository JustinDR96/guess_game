import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json"; // Importez le plugin rollup-plugin-json

export default defineConfig({
  base: "/guess_game/", // Remplacez '/chemin-de-votre-application/' par la base souhaitée

  build: {
    rollupOptions: {
      output: {
        dir: "dist",
      },
    },
  },

  plugins: [
    copy({
      targets: [{ src: "assets", dest: "dist" }],
      hook: "writeBundle",
    }),
    json({
      path: "assets/gameIndex.json",
    }),
  ],
});
