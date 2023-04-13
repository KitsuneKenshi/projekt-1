<template>
        <v-card>
            <v-card-text>
                <v-form>
                    <v-text-field @keyup.enter="login()" label="Email" type="email" required v-model="email"></v-text-field>
                    <v-text-field @keyup.enter="login()" label="Password" type="password" required v-model="password"></v-text-field>
                    <v-btn  class="mr-4" color="primary" :disabled="inProgress" @click="login()">Login</v-btn>
                    <v-btn color="primary" :disabled="inProgress" @click="register()">Register</v-btn>
                    <v-alert class="mt-4" v-if="error" type="error">{{ errorMessage }}</v-alert>
                </v-form>
            </v-card-text>
        </v-card>
</template>

<script setup lang="ts">
    import { useFirebaseUser } from '~/stores/firebase';
    onMounted(() => {
        if(firebaseUser.isLoggedIn) navigateTo('/');
    });
    const firebaseUser = useFirebaseUser();
    const inProgress = ref(false);
    const error = ref(false);
    const errorMessage = ref('');
    const email = ref('');
    const password = ref('');
    const login = () => {
        inProgress.value = true;
        firebaseUser.login(email.value, password.value).then(res => {
            if(!res) {
                error.value = true;
                errorMessage.value = 'Invalid email or password';
                setTimeout(() => {
                    error.value = false;
                    errorMessage.value = '';
                }, 3000);
            } else {
                error.value = false;
                errorMessage.value = '';
                navigateTo('/')
            }
        }).catch(err => {
            console.log(err);
            error.value = true;
            errorMessage.value = 'Unknown error';
            setTimeout(() => {
                error.value = false;
                errorMessage.value = '';
            }, 3000);
        }).finally(() => {
            inProgress.value = false;
        });
   }
   const register = () => {
       inProgress.value = true;
       firebaseUser.register(email.value, password.value).then(res => {
           if(!res) {
                error.value = true;
                errorMessage.value = 'User already exists';
                setTimeout(() => {
                    error.value = false;
                    errorMessage.value = '';
                }, 3000);
           } else {
                error.value = false;
                errorMessage.value = '';
                navigateTo('/')
           }
       }).catch(err => {
           console.log(err);
           error.value = true;
            errorMessage.value = 'Unknown error';
            setTimeout(() => {
                error.value = false;
                errorMessage.value = '';
            }, 3000);
       }).finally(() => {
           inProgress.value = false;
       });
   }
</script>

<style scoped>

</style>