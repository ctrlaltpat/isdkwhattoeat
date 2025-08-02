import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    firstName?: string;
    lastName?: string;
  }
}
