'use client';

import { useEffect, useState } from 'react';
import AnchorGlyph from './AnchorGlyph';

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // fade in → hold → fade out
    const holdTimer = setTimeout(() => setPhase('hold'), 800);
    const outTimer = setTimeout(() => setPhase('out'), 1800);
    const doneTimer = setTimeout(() => onDone(), 2500);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fdfaf4 0%, #fbf7f0 50%, #f5eee4 100%)',
        transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: phase === 'out' ? 0 : 1,
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Soft ambient glow behind logo */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,139,106,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'loaderPulse 2.5s ease-in-out infinite',
        }}
      />

      {/* Logo container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          animation: 'loaderRise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        }}
      >
        {/* Glowing icon badge */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 0 1px rgba(201,139,106,0.2), 0 20px 60px -10px rgba(201,139,106,0.3)',
            animation: 'loaderFloat 3s ease-in-out infinite',
          }}
        >
          <AnchorGlyph className="h-9 w-9 text-clay" />
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Fraunces, ui-serif, Georgia, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: '#2f3330',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Anchor
          </div>
          <div
            style={{
              marginTop: '6px',
              fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#c98b6a',
              opacity: 0.85,
            }}
          >
            hold steady
          </div>
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#c98b6a',
                opacity: 0.6,
                animation: `loaderDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loaderRise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes loaderDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
