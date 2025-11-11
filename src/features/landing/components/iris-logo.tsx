'use client';

import Image from 'next/image';

interface IrisLogoProps {
  className?: string;
  size?: number;
}

export function IrisLogo({ className = '', size = 32 }: IrisLogoProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/iris.svg"
        alt="Iris Logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );
}
