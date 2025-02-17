import Aura from '@primevue/themes/aura';
import '@nuxt/fonts';
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    preset: "bun"
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxt/fonts',
  ],
  css: ['~/styles/global.css'],
  fonts: {
    providers: {

    }
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})
