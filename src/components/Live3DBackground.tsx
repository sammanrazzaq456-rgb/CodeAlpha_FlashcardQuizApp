import React, { useEffect, useState, useRef } from 'react';
import { Theme } from '../types';

interface Live3DBackgroundProps {
  theme: Theme;
  isAudioPlaying?: boolean;
}

export const Live3DBackground: React.FC<Live3DBackgroundProps> = ({
  theme,
  isAudioPlaying = false,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Smooth mouse parallax interpolation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized from -1 to 1
      targetPos.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: (e.clientY / innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let currentX = 0;
    let currentY = 0;

    const loop = () => {
      // Lerp for buttery smoothness
      currentX += (targetPos.current.x - currentX) * 0.05;
      currentY += (targetPos.current.y - currentY) * 0.05;
      setMousePos({ x: currentX, y: currentY });
      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      aria-hidden="true"
    >
      {/* 3D Scene Wrapper responding to mouse parallax */}
      <div
        className="absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-75 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg) translateZ(0px)`,
        }}
      >
        {/* Layer 1: Distant 3D Ambient Horizon Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(to right, #8B8BF5 1px, transparent 1px), linear-gradient(to bottom, #8B8BF5 1px, transparent 1px)'
              : 'linear-gradient(to right, #5B5BD6 1px, transparent 1px), linear-gradient(to bottom, #5B5BD6 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            transform: 'rotateX(55deg) translateZ(-200px) translateY(10%)',
            transformOrigin: 'center bottom',
          }}
        />

        {/* Layer 2: Deep 3D Glow Orbs with Floating Animation */}
        {/* Orb 1 - Top Left Primary Pulse */}
        <div
          className={`absolute rounded-full blur-[90px] sm:blur-[130px] transition-all duration-700 ${
            isDark
              ? 'bg-indigo-600/25 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px]'
              : 'bg-indigo-400/20 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px]'
          } ${isAudioPlaying ? 'animate-pulse' : ''}`}
          style={{
            top: '8%',
            left: '12%',
            transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25}px, -100px)`,
            animation: 'floatSlow1 18s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 2 - Right Mid Floating Accent */}
        <div
          className={`absolute rounded-full blur-[100px] sm:blur-[140px] transition-all duration-700 ${
            isDark
              ? 'bg-purple-600/20 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px]'
              : 'bg-violet-300/30 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px]'
          } ${isAudioPlaying ? 'animate-pulse' : ''}`}
          style={{
            top: '35%',
            right: '10%',
            transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, -50px)`,
            animation: 'floatSlow2 22s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 3 - Bottom Left Warm Glow */}
        <div
          className={`absolute rounded-full blur-[90px] sm:blur-[120px] transition-all duration-700 ${
            isDark
              ? 'bg-cyan-700/20 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]'
              : 'bg-amber-200/35 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]'
          }`}
          style={{
            bottom: '10%',
            left: '20%',
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * 18}px, 20px)`,
            animation: 'floatSlow3 16s ease-in-out infinite alternate',
          }}
        />

        {/* Layer 3: Interactive 3D Floating Geometry Badges */}
        {/* Floating 3D Geometric Card Symbol 1 */}
        <div
          className="absolute hidden md:flex items-center justify-center w-14 h-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-md shadow-lg"
          style={{
            top: '20%',
            left: '8%',
            transform: `translate3d(${mousePos.x * -45}px, ${mousePos.y * -45}px, 60px) rotate(${12 + mousePos.x * 10}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="text-xl opacity-75">✨</span>
        </div>

        {/* Floating 3D Geometric Card Symbol 2 */}
        <div
          className="absolute hidden md:flex items-center justify-center w-12 h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-md shadow-lg"
          style={{
            top: '72%',
            right: '12%',
            transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 40px) rotate(${-15 - mousePos.y * 8}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="text-lg opacity-70">💡</span>
        </div>

        {/* Floating 3D Geometric Card Symbol 3 (Top Right) */}
        <div
          className="absolute hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)]/30 backdrop-blur-md shadow-md"
          style={{
            top: '15%',
            right: '18%',
            transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * -25}px, 30px) rotate(${8 + mousePos.y * 6}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <span className="text-sm opacity-60">🧠</span>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow1 {
          0% { transform: translate3d(0, 0, -100px) scale(1); }
          50% { transform: translate3d(40px, -30px, -80px) scale(1.08); }
          100% { transform: translate3d(-30px, 35px, -110px) scale(0.95); }
        }
        @keyframes floatSlow2 {
          0% { transform: translate3d(0, 0, -50px) scale(1); }
          50% { transform: translate3d(-45px, 35px, -30px) scale(1.05); }
          100% { transform: translate3d(35px, -40px, -60px) scale(0.97); }
        }
        @keyframes floatSlow3 {
          0% { transform: translate3d(0, 0, 20px) scale(0.98); }
          50% { transform: translate3d(30px, 25px, 40px) scale(1.04); }
          100% { transform: translate3d(-25px, -30px, 10px) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
