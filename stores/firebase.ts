import {defineStore} from 'pinia';
import { createUserWithEmailAndPassword, User, Auth, signInWithEmailAndPassword } from 'firebase/auth';

export const useFirebaseUser = defineStore('user', {
    state: () => ({
        user: null as User | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
    },
    actions: {
        async register(email: string, password: string) {
            const {$auth} = useNuxtApp();
            try {
                const userCredential = await createUserWithEmailAndPassword(($auth as Auth), email, password);
                this.user = userCredential.user;
                return true;
            } catch(error) {
                console.log(error)
                return false;
            }
        },
        async login(email: string, password: string) {
            const {$auth} = useNuxtApp();
            try {
                if(this.user) await this.user.delete();
                const userCredential = await signInWithEmailAndPassword(($auth as Auth), email, password);
                this.user = userCredential.user;
                return true
            } catch(error) {
                console.log(error)
                return false
            }
        },
        async logout() {
            if(this.user) await this.user.delete();
            this.user = null;
        }
    }
})

