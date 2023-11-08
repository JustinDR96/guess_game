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
    // Plugin pour copier les répertoires "audio" et "images" dans le répertoire de sortie
    copy({
      targets: [ 
        { src: "assets", dest: "dist" }, // Copier le répertoire "images" dans "dist/images"
      ],
      hook: "writeBundle",
    }),
  ],
});