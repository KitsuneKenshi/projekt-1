import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const firebaseConfig = {
        apiKey: runtimeConfig.public.FIREBASE_API_KEY,
        authDomain: runtimeConfig.public.FIREBASE_AUTH_DOMAIN,
        projectId: runtimeConfig.public.FIREBASE_PROJECT_ID,
        storageBucket: runtimeConfig.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: runtimeConfig.public.FIREBASE_MESSAGING_SENDER_ID,
        appId: runtimeConfig.public.FIREBASE_APP_ID,
    }
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth);
})