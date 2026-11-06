import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth.js con sesiones JWT y control de roles.
 * Credenciales de demo (cámbialas vía variables de entorno en producción):
 *   admin@recorcholis.mx / arcade2026
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
    };
  }
  interface User {
    role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/admin' },
  providers: [
    CredentialsProvider({
      name: 'Acceso CRM',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        const validEmail = (process.env.ADMIN_EMAIL ?? 'admin@recorcholis.mx').toLowerCase();
        const validPassword = process.env.ADMIN_PASSWORD ?? 'arcade2026';

        if (email === validEmail && password === validPassword) {
          return { id: 'admin-1', email: validEmail, name: 'Administrador Recórcholis', role: 'ADMIN' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role ?? 'VIEWER';
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
