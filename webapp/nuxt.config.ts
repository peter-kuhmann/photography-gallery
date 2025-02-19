import Aura from "@primevue/themes/aura";
import "@nuxt/fonts";
import tailwindcss from "@tailwindcss/vite";

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
    providers: {},
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
});
