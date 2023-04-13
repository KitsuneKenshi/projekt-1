<template>
        <v-container v-if="firebaseUser.isLoggedIn">
            <v-card>
                <v-card-title>
                    <h1 class="text-h5">Panel</h1>
                </v-card-title>
                <v-card-text>
                    <v-btn @click="firebaseUser.logout()">Log out</v-btn>
                </v-card-text>
            </v-card>
        </v-container>
</template>

<script setup lang="ts">
    import { Auth, onAuthStateChanged, getAuth } from 'firebase/auth';
import { useFirebaseUser } from '~/stores/firebase';
    const firebaseUser = useFirebaseUser();
    onMounted(() => {
        if(!firebaseUser.isLoggedIn) navigateTo('/login');
    })
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if(!user) navigateTo('/login');
    });
</script>

<style scoped>

</style>