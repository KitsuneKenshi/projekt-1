import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    onAuthStateChanged(getAuth(), (user) => {
        if(!user && to.path == 'panel') {
            return '/login'
        }
    });
})