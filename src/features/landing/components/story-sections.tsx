'use client';

import { RefObject } from 'react';
import { Eye } from 'lucide-react';
import { landingContent } from '../content';

interface StorySectionsProps {
  storySection1Ref: RefObject<HTMLElement>;
  storySection2Ref: RefObject<HTMLElement>;
  storySection3Ref: RefObject<HTMLElement>;
  zoomTextRef: RefObject<HTMLDivElement>;
  layeredTextRef: RefObject<HTMLDivElement>;
}

export function StorySections({
  storySection1Ref,
  storySection2Ref,
  storySection3Ref,
  zoomTextRef,
  layeredTextRef,
}: StorySectionsProps) {
  return (
    <>
      {/* Story Section 1 - Layered Text Fade */}
      <section
        ref={storySection1Ref}
        className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32"
      >
        <div className="max-w-5xl mx-auto space-y-32">
          {landingContent.story.section1.layers.map((layer, index) => (
            <div key={index} className="text-layer text-center" style={{ perspective: '1000px' }}>
              <h2 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                layer.highlighted ? 'prismatic-text' : ''
              }`}>
                {layer.title}
              </h2>
              <p className="text-2xl md:text-3xl text-muted-foreground">
                {layer.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* Layered Text Reveal Section */}
      <section
        ref={storySection3Ref}
        className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32"
      >
        <div
          className="max-w-6xl mx-auto text-center"
          style={{ perspective: '1500px' }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-12">
            {landingContent.story.section3.words.map((word, i) => (
              <span
                key={i}
                className="story-word inline-block mx-2 md:mx-3"
                style={{
                  transformStyle: 'preserve-3d',
                  color: landingContent.story.section3.highlightedIndices.includes(i)
                    ? i === 0
                      ? 'oklch(0.75 0.15 195)'
                      : i === 5
                        ? 'oklch(0.82 0.18 330)'
                        : 'oklch(0.88 0.16 85)'
                    : 'inherit',
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </section>
    </>
  );
}
