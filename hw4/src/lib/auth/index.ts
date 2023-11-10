import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

import CredentialsProvider from "./CredentialProvider";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [GitHub, CredentialsProvider],
    callbacks: {
        async session({ session, token }) {
            const email = token.email || session?.user?.email;
            if (!email) return session;

            const [user] = await db
                .select({
                    id: usersTable.displayId,
                })
                .from(usersTable)
                .where(eq(usersTable.email, email.toLowerCase()))
                .execute();

            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            };
        },

        async jwt({ token, account }) {
            if (!account) return token;
            const { name, email } = token;
            const provider = account.provider;
            if (!name || !email || !provider) return token;

            const [existedUser] = await db
                .select({
                    id: usersTable.displayId,
                })
                .from(usersTable)
                .where(eq(usersTable.email, email.toLowerCase()))
                .execute();
            if (existedUser) return token;
            if (provider !== "github") return token;

            await db.insert(usersTable).values({
                username: name,
                email: email.toLowerCase(),
                provider,
            });

            return token;
        },
    },
    pages: {
        signIn: "/",
    },
});