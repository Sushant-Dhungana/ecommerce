import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { User } from "lucide-react";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        //array of regex patterns of paths we want to protect
        // Check for user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // Check if password is correct then return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user doesn't exist or password doesn't match
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Set the user id and role from the token
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Runs at login
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        } else {
          token.name = user.name;
        }

        // Handle cart merging on sign-in/sign-up
        if (trigger === "signIn" || trigger === "signUp") {
          try {
            const cookieStore = await cookies();
            const sessionCartId = cookieStore.get("sessionCartId")?.value;

            if (sessionCartId && user.id) {
              // Find the session cart
              const sessionCart = await prisma.cart.findFirst({
                where: { sessionCartId: sessionCartId },
              });

              if (sessionCart) {
                // Delete any existing cart for this user
                await prisma.cart.deleteMany({
                  where: { userId: user.id },
                });

                // Assign the session cart to the user
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id },
                });
              }
            }
          } catch (error) {
            console.error("Error merging carts:", error);
            // Don't throw error, just log it - auth should still proceed
          }
        }
      }

      //handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    authorized({ request, auth }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/admin\/(.*)/,
        /\/order\/(.*)/,
      ];

      // Get the pathname from the request URL
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        // Redirect to sign-in page with return URL
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", request.url);
        return Response.redirect(signInUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
