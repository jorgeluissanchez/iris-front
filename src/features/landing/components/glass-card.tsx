import type React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'pink' | 'yellow' | 'none';
}

export function GlassCard({ children, className, glow = 'none' }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-effect rounded-xl p-6 transition-all duration-300 hover:glass-effect-strong',
        glow !== 'none' && `glow-${glow}`,
        className
      )}
    >
      {children}
    </div>
  );
}
