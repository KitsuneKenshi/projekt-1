<template>
        <v-container v-if="firebaseUser.isLoggedIn">
            <panel-list/>
        </v-container>
</template>

<script setup lang="ts">
    import { useFirebaseUser } from '~/stores/firebase';
    const firebaseUser = useFirebaseUser();
</script>

<style scoped>

</style>