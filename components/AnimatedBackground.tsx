
import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-deep-purple to-black opacity-90"></div>
            <div 
                className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-red to-brand-orange animate-gradient-flow opacity-60"
                style={{ backgroundSize: '400% 400%' }}
            ></div>
            <div className="absolute inset-0 mix-blend-overlay">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${Math.random() * 10 + 5}vw`,
                            height: `${Math.random() * 10 + 5}vw`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `blob-move ${Math.random() * 40 + 20}s linear infinite`,
                        }}
                    ></div>
                ))}
            </div>
             <style>{`
                @keyframes blob-move {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(${Math.random() * 100-50}vw, ${Math.random() * 100-50}vh) scale(1.2); }
                    50% { transform: translate(${Math.random() * 100-50}vw, ${Math.random() * 100-50}vh) scale(0.8); }
                    75% { transform: translate(${Math.random() * 100-50}vw, ${Math.random() * 100-50}vh) scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;
