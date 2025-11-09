'use client';

import { Button } from '@/components/ui/button';
import { IrisLogo } from '@/features/landing/components/iris-logo';
import { landingContent } from '@/features/landing/content';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  showNavLinks?: boolean;
  showLoginButton?: boolean;
}

export function Navbar({ showNavLinks = true, showLoginButton = true }: NavbarProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const router = useRouter();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 glass-effect border-b border-border/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <IrisLogo size={32} className="animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
          </div>
          <span className="text-2xl font-bold prismatic-text">{landingContent.navbar.brand}</span>
        </Link>

        {showNavLinks && isLandingPage && (
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#ingenierias"
              onClick={(e) => handleSmoothScroll(e, 'ingenierias')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {landingContent.navbar.links.engineering}
            </a>
            
            <a
              href="#eventos"
              onClick={(e) => handleSmoothScroll(e, 'eventos')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {landingContent.navbar.links.events}
            </a>
          </div>
        )}

        {showLoginButton && (
          <Button
            size="sm"
            onClick={() => router.push('/auth/login')}
            style={{ 
              background: 'oklch(0.75 0.15 195)',
              color: 'oklch(0.12 0.01 264)'
            }}
          >
            {landingContent.navbar.cta}
          </Button>
        )}
      </div>
    </nav>
  );
}
