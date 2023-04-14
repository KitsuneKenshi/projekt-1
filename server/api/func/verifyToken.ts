import { getAuth } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import app from "~/server/utlis/firebase";

export default (token: string) => {
    const auth = getAuth(app);
    return auth.verifyIdToken(token).then((decodedToken: DecodedIdToken) => {
        return decodedToken;
    }).catch((error: any) => {
        return null;
    });
}