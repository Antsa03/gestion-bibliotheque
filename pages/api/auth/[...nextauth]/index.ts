import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma-client";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProviders({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password }: any = credentials;

        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.name + " " + user.firstname,
          userRole: user.role,
          profil: user.profile,
          utilisateur: user,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return { ...session, ...token };
    },
  },
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
