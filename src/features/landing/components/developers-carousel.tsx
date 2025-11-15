'use client';

import { RefObject, useEffect, useRef } from 'react';
import { landingContent } from '../content';

interface DevelopersCarouselProps {
  developersRef: RefObject<HTMLElement>;
}

export function DevelopersCarousel({ developersRef }: DevelopersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const developers = landingContent.developers.team;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Duplicar el array para efecto infinito
  const duplicatedDevelopers = [...developers, ...developers, ...developers];

  return (
    <section
      ref={developersRef}
      className="relative z-10 py-12 md:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-border/50 mb-3">
            <div className="w-0 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            <span>{landingContent.developers.badge}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            {landingContent.developers.title} <span className="prismatic-text">{landingContent.developers.titleHighlight}</span>
          </h2>
        </div>
      </div>

      {/* Carousel container with controlled width */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
        {/* Scrolling container with mask for fade effect */}
        <div
          ref={scrollRef}
          className="flex gap-8 md:gap-12 overflow-x-hidden py-8"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 85%, transparent 100%)'
          }}
        >
          {duplicatedDevelopers.map((dev, index) => (
            <div
              key={`${dev.name}-${index}`}
              className="flex-shrink-0 flex items-center gap-8 md:gap-12"
            >
              {/* Developer info */}
              <div className="flex flex-col items-center text-center whitespace-nowrap">
                <h3 className="text-lg md:text-xl font-semibold text-foreground/90 mb-1">
                  {dev.name}
                </h3>
                <p className="text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  {dev.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom subtle line */}
      <div className="mt-8 max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      </div>
    </section>
  );
}
