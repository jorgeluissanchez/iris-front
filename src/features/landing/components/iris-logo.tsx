'use client';

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
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Gradientes para cada triángulo */}
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.6" />
          </linearGradient>
          
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.5" />
          </linearGradient>

          {/* Filtro de brillo/resplandor */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Triángulo superior izquierdo - Cyan */}
        <path
          d="M 20 15 L 50 45 L 35 60 L 10 35 Z"
          fill="url(#grad1)"
          filter="url(#glow)"
          className="triangle"
        />

        {/* Triángulo superior derecho - Amarillo */}
        <path
          d="M 50 10 L 80 40 L 65 55 L 50 45 Z"
          fill="url(#grad2)"
          filter="url(#glow)"
          className="triangle"
        />

        {/* Triángulo inferior derecho - Rosa */}
        <path
          d="M 65 55 L 90 65 L 70 85 L 50 75 Z"
          fill="url(#grad3)"
          filter="url(#glow)"
          className="triangle"
        />

        {/* Triángulo inferior izquierdo - Púrpura */}
        <path
          d="M 30 75 L 50 75 L 50 90 L 15 70 Z"
          fill="url(#grad4)"
          filter="url(#glow)"
          className="triangle"
        />

        {/* Triángulo central - Mezcla */}
        <path
          d="M 50 45 L 65 55 L 50 75 L 35 60 Z"
          fill="url(#grad3)"
          opacity="0.4"
          className="triangle-center"
        />
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(2deg); }
        }

        .triangle {
          animation: float 3s ease-in-out infinite;
        }

        .triangle:nth-child(2) {
          animation-delay: 0.3s;
        }

        .triangle:nth-child(3) {
          animation-delay: 0.6s;
        }

        .triangle:nth-child(4) {
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  );
}
