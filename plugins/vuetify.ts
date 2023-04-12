import { createVuetify } from 'vuetify'
import 'vuetify/styles' // pre-build css styles
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3F51B5',
            secondary: '#FFC107'
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#3F51B5',
            secondary: '#FFC107'
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
