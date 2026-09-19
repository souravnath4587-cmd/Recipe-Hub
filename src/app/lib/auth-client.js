import { createAuthClient } from "better-auth/react";

// No baseURL: the auth API lives on the same origin (/api/auth), so this works locally and on Vercel.
export const authClient = createAuthClient();
export const { signIn, signUp, useSession } = authClient;
