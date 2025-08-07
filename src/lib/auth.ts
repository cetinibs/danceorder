import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession as getServerSessionNextAuth } from 'next-auth';
import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('E-posta ve şifre gerekli');
          }

          const client = await clientPromise;
          const db = client.db("pilatesstudio");
          
          // Önce users koleksiyonunda ara (admin için)
          let user = await db.collection("users").findOne({ 
            email: credentials.email,
            isActive: true 
          });

          // Kullanıcı bulunamazsa öğretmenler koleksiyonunda ara
          if (!user) {
            user = await db.collection("teachers").findOne({
              email: credentials.email,
              isActive: true
            });
          }

          if (!user) {
            throw new Error('Kullanıcı bulunamadı');
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Hatalı şifre');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'teacher',
            color: user.color // Öğretmenler için renk kodu
          };
        } catch (error: any) {
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.color) token.color = user.color; // Öğretmen renk kodu
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.color) session.user.color = token.color; // Öğretmen renk kodu
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  secret: process.env.NEXTAUTH_SECRET
};

// getServerSession fonksiyonunu export et
export const getServerSession = () => getServerSessionNextAuth(authOptions); 