import Aura from "@primevue/themes/aura";
import "@nuxt/fonts";
import tailwindcss from "@tailwindcss/vite";
import { SUPPORTED_ALBUM_VIEW_FONTS } from "~/infrastructure/constants";
import { albumFontNameToClass } from "~/infrastructure/utils";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@primevue/nuxt-module",
    "@nuxt/fonts",
    "nuxt-auth-utils",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "nuxt-svgo",
  ],
  devtools: { enabled: true },
  css: ["~/styles/global.css"],
  compatibilityDate: "2024-11-01",
  nitro: {
    preset: "bun",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: false,
    },
  },
  fonts: {
    provider: "google",
  },
  i18n: {
    vueI18n: "./i18n/config.ts",
    locales: [
      { code: "en", language: "en-US" },
      { code: "de", language: "de" },
    ],
    defaultLocale: "en",
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".__ignore",
        },
      },
    },
  },
  svgo: {
    defaultImport: "component",
  },
  hooks: {
    "build:before": async () => {
      let generatedCss = "";

      for (const { name, fallback } of SUPPORTED_ALBUM_VIEW_FONTS) {
        generatedCss += `.${albumFontNameToClass(name)} {\n`;
        generatedCss += `  font-family: "${name}", ${fallback};\n`;
        generatedCss += `}\n\n`;
      }

      await Bun.write(import.meta.dir + "/styles/fonts.css", generatedCss);
    },
  },
});
