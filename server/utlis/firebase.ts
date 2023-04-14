import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

const runtimeConfig = useRuntimeConfig();
const serviceAccount = JSON.parse(runtimeConfig.FIREBASE_USER)
const app = initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default app;