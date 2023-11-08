import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

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
  ],
});
