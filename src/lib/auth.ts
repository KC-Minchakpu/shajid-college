import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "./db"; // If using Prisma or a database

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", // JSON Web Tokens are best for this setup
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check if email/password exists
        if (!credentials?.email || !credentials?.password) return null;

        // 2. FIND USER IN YOUR DATABASE
        // const user = await db.user.findUnique({ where: { email: credentials.email } });
        
        // DUMMY USER for testing (Replace this with real DB logic)
        const user = { id: "1", email: "test@nursing.com", password: "password123", role: "applicant" };

        if (user && user.password === credentials.password) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  callbacks: {
    // Add the user's role to the session so the frontend can see it
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // Points to custom login page
  }
};