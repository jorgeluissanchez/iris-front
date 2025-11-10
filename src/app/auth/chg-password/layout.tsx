import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cambio de Contraseña - Iris',
  description: 'Cambia tu contraseña de Iris',
};

export default function ChangePasswordLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
