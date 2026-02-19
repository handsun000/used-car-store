'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        >
          <source src="/videos/중고차%20홍보%20영상1.mp4" type="video/mp4" />
          {/* Fallback pattern if video fails or while loading */}
          <div className="w-full h-full bg-gray-900" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fadeInUp">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
              The New Experience
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide">
              투명한 가격, 검증된 품질. 당신만의 드림카를 만나보세요.
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="/buy"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              매물 보러가기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sound Control */}
        <div className="absolute bottom-10 right-10 z-30">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all border border-white/20"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
