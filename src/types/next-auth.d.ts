import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      color?: string; // Öğretmenler için renk kodu
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    color?: string; // Öğretmenler için renk kodu
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    color?: string; // Öğretmenler için renk kodu
  }
} 