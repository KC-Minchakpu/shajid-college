// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Adds ID to the session object
      email: string;
      role: string;
      name?: string | null;
    }
  }
}