<template>
        <v-card>
            <v-card-text>
                <v-form>
                    <v-text-field label="Email" type="email" required v-model="email"></v-text-field>
                    <v-text-field label="Password" type="password" required v-model="password"></v-text-field>
                    <v-btn class="mr-4" color="primary" :disabled="inProgress" @click="login()">Login</v-btn>
                    <v-btn color="primary">Register</v-btn>
                    <v-alert text="..." type="error"></v-alert>
                </v-form>
            </v-card-text>
        </v-card>
</template>

<script setup lang="ts">
    import { useFirebaseUser } from '~/stores/firebase';
    const firebaseUser = useFirebaseUser();
    const inProgress = ref(false);
    const email = ref('');
    const password = ref('');
    const login = () => {
        inProgress.value = true;
        firebaseUser.login(email.value, password.value).then(res => {
            if(!res) {

            }
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            inProgress.value = false;
        });
   }
</script>

<style scoped>

</style>