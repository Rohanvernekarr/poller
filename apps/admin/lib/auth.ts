import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin@poller.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@poller.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "supersecret";

        if (
          credentials?.username === adminEmail &&
          credentials?.password === adminPassword
        ) {
          const { prisma } = await import("@repo/db");
          const dbUser = await prisma.user.findUnique({
            where: { email: adminEmail }
          });

          if (dbUser && dbUser.role === "ADMIN") {
            if (dbUser.isBlocked) return null;
            return { 
              id: dbUser.id, 
              name: dbUser.name || "Admin", 
              email: dbUser.email, 
              role: dbUser.role 
            };
          }

          return { id: "admin-static", name: "Admin (Static)", email: adminEmail, role: "ADMIN" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  // Ensure secret is consistent. 
  // It is better to fail than have a mismatch with an implicit fallback.
  secret: process.env.NEXTAUTH_SECRET,
};
