
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 animate-logo-glow">
      <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF4500" />
          </linearGradient>
        </defs>
        <path
          d="M10 90 L30 30 L50 70 L70 30 L90 90 L75 90 L60 55 L40 55 L25 90 Z"
          fill="url(#logoGradient)"
          stroke="#FFD700"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-orbitron text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-orange">
        MySelf
      </span>
    </div>
  );
};

export default Logo;
