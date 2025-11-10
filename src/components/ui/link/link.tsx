'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

export type LinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: string;
} & NextLinkProps;

export const Link = ({ className, children, href, ...props }: LinkProps) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Only determine active state on client side to avoid hydration issues
    setIsActive(pathname === href.toString());
  }, [pathname, href]);
  
  return (
    <NextLink
      href={href}
      className={cn('text-slate-600 hover:text-slate-900', className)}
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </NextLink>
  );
};
