import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect"; 
import User from "@/models/User";       
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // ✅ Updated: Pull status from DB (default to 'pending' if not found)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'applicant',
          status: user.status || 'pending', 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.status = (user as any).status; 
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).status = token.status; 
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in', 
    newUser: '/create-account'
  }
};