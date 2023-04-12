<template>
  <v-app>
    <v-app-bar app>
      <nuxt-link to="/" class="text-decoration-none text-white ml-4">
        <v-toolbar-title >App </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-btn to="/login" text>Login</v-btn>

    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt-page></nuxt-page>
      </v-container>
    </v-main>
  </v-app>
</template>
