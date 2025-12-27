import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      status: "pending" | "submitted" | "admitted";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    status: "pending" | "submitted" | "admitted";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    status: "pending" | "submitted" | "admitted";
  }
}
