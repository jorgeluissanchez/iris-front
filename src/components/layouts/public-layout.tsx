'use client';

import { Navbar } from '@/components/layouts/navbar';
import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
  showNavLinks?: boolean;
}

export function PublicLayout({ children, showNavLinks = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar showNavLinks={showNavLinks} />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
}
