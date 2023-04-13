<template>
  <v-app>
    <v-app-bar app>
      <nuxt-link to="/" class="text-decoration-none text-text ml-4">
        <v-toolbar-title >App </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-btn to="/login" v-if="!firebaseUser.isLoggedIn" class="mr-2" text>Login</v-btn>
      <v-btn v-if="firebaseUser.isLoggedIn" @click="logout()">Log out</v-btn>
      <v-btn to="/panel" v-if="firebaseUser.isLoggedIn" >Panel </v-btn>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme()"></v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt-page></nuxt-page>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { useFirebaseUser } from '~/stores/firebase';
const firebaseUser = useFirebaseUser();
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
const logout = async () => {
  await firebaseUser.logout();
}

const autoLogin = () => {
  if(!process.server) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if(user) {
        firebaseUser.user = user;
      }
    });
  }
}
autoLogin();
</script>