'use client';

import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

export default function GlobalBackground() {
  return (
    <>
      {/* Animated gradient background */}
      <div className="animated-bg" />
      
      {/* Grid overlay */}
      <div className="grid-bg fixed inset-0 -z-10 opacity-20" />
      
      {/* Three.js 3D background */}
      <ThreeBackground />
    </>
  );
}
