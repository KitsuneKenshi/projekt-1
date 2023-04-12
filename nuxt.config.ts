import { m } from '@unhead/vue/dist/createHead-26c9c4af';
import vuetify from 'vite-plugin-vuetify';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass'],
    build: {
       transpile: ['vuetify'],
     },
     modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
              config?.plugins?.push(vuetify())
            })
          },
          '@pinia/nuxt'
    ],
    runtimeConfig: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    }
})
