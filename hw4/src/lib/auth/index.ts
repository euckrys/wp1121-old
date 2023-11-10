import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import CredentialsProvider from "./CredentialProvider";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [GitHub, CredentialsProvider],
});