'use client';

import dynamic from 'next/dynamic';

const CanvasEditor = dynamic(() => import('../components/CanvasEditor'), { ssr: false });

export default function HomePage() {
  return <CanvasEditor />;
}
