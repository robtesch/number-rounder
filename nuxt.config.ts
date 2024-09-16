import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  srcDir: "src",
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "@vesp/nuxt-fontawesome",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
    components: {
      prefix: "P",
    },
  },
  fontawesome: {
    icons: {
      solid: ["cog", "times", "circle-xmark", "backspace", "check"],
    },
  },
  typescript: {
    typeCheck: true,
  },
});
