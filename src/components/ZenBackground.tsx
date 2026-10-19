'use client';

import React from 'react';

interface ZenBackgroundProps {
  isFocusMode?: boolean;
}

export const ZenBackground: React.FC<ZenBackgroundProps> = ({ isFocusMode = false }) => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden select-none bg-[#eaf4f4]">
      {/* 1. Serene misty landscape background image with gentle Ken Burns animation and light blur */}
      <div
        className="absolute inset-0 bg-cover bg-center zen-landscape-animate transition-all duration-1000"
        style={{
          backgroundImage: `url('/zen-landscape.jpg')`,
          filter: isFocusMode ? 'blur(28px) brightness(0.96)' : 'blur(16px) saturate(115%) brightness(1.04)',
          transform: 'scale(1.08)',
        }}
      />

      {/* 2. Soft Light Turquoise / Mint Green / Sky Blue ambient color blend overlay */}
      <div
        className={`absolute -top-[15%] -left-[10%] w-[60vw] h-[60vw] rounded-full zen-light-orb-1 transition-all duration-1000 ${
          isFocusMode ? 'opacity-35' : 'opacity-60'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.45) 0%, rgba(56, 189, 248, 0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className={`absolute top-[20%] -right-[15%] w-[55vw] h-[55vw] rounded-full zen-light-orb-2 transition-all duration-1000 ${
          isFocusMode ? 'opacity-30' : 'opacity-50'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.5) 0%, rgba(14, 165, 233, 0.25) 50%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* 3. Airy semi-translucent crisp white glaze to ensure text readability */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isFocusMode ? 'bg-white/75 backdrop-blur-[4px]' : 'bg-white/45'
        }`}
      />

      {/* 4. Delicate subtle noise / ambient shimmer */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 65, 60, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
