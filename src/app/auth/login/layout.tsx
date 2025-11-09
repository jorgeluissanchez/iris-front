import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Inicio de Sesión - Iris',
  description: 'Inicia sesión en tu cuenta de Iris',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
