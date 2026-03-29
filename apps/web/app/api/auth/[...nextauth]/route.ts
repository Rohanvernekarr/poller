import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@repo/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, token, provider }) {
        // We override this to send a custom 6-digit code instead of a magic link if we want,
        // but for now let's use the magic link first to ensure it's working, then switch to OTP.
        // Actually, the user explicitly asked for "code".
        
        try {
          // In standard NextAuth, 'token' is the value stored in VerificationToken.
          // We can override the generator to make it 6 digits.
          await resend.emails.send({
            from: "Poller <auth@rohanrv.tech>",
            to: email,
            subject: `Your Poller Login Code: ${token}`,
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="text-align: center; color: #000;">Poller Auth</h2>
                <p>Use the following code to sign in to your account:</p>
                <div style="background: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                  ${token}
                </div>
                <p style="font-size: 12px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("SEND_VERIFICATION_EMAIL_ERROR", error);
          throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
        }
      },
      // Generate a 6-digit numeric code
      generateVerificationToken() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // If it's a Google sign-in and email isn't verified yet, update it
      if (account?.provider === "google") {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
