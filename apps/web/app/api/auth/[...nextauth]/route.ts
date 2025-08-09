import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@getitdone/db";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'database' },
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    Credentials({
      name: 'Email',
      credentials: { email: { label: 'Email', type: 'text' } },
      async authorize(creds) {
        const email = creds?.email?.toLowerCase();
        if (!email) return null;
        const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } });
        return user as any;
      }
    })
  ]
});

export { handler as GET, handler as POST };
