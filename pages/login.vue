<template>
    <div>
        <Login />
    </div>
</template>

<script lang="ts" setup>
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if(user) navigateTo('/');
});
</script>

<style scoped>

</style>