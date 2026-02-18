'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchCars } from '@/lib/api/cars';
import { CarResponse, CarSearchCondition, FuelType, Transmission } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Search State
  const [condition, setCondition] = useState<CarSearchCondition>({
    brand: '',
    modelName: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const validCondition: CarSearchCondition = {};
      if (condition.brand) validCondition.brand = condition.brand;
      if (condition.modelName) validCondition.modelName = condition.modelName;
      if (condition.minPrice) validCondition.minPrice = condition.minPrice;
      if (condition.maxPrice) validCondition.maxPrice = condition.maxPrice;

      const data = await searchCars(validCondition);
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatter Helpers
  const formatFuelType = (type: FuelType) => {
    switch (type) {
      case 'GASOLINE': return '가솔린';
      case 'DIESEL': return '디젤';
      case 'ELECTRIC': return '전기';
      case 'HYBRID': return '하이브리드';
      default: return type;
    }
  };

  const formatTransmission = (type: Transmission) => {
    switch (type) {
      case 'AUTOMATIC': return '자동';
      case 'MANUAL': return '수동';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* 1. Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
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
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Hero Content - Removed as requested */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          {/* Text and buttons removed to show only video */}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer" onClick={scrollToContent}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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

      {/* 2. Content Section (Search & List) */}
      <section ref={contentRef} className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">

        {/* Modern Minimal Search Filter */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Find Your Model</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 items-end">

            <div className="flex flex-col group">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Brand</label>
              <input
                type="text"
                placeholder="All Brands"
                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300"
                value={condition.brand || ''}
                onChange={(e) => setCondition({ ...condition, brand: e.target.value })}
              />
            </div>

            <div className="flex flex-col group">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Model</label>
              <input
                type="text"
                placeholder="Model Name"
                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300"
                value={condition.modelName || ''}
                onChange={(e) => setCondition({ ...condition, modelName: e.target.value })}
              />
            </div>

            <div className="flex flex-col group">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Min Price</label>
              <input
                type="number"
                placeholder="0"
                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300"
                value={condition.minPrice || ''}
                onChange={(e) => setCondition({ ...condition, minPrice: Number(e.target.value) || undefined })}
              />
            </div>

            <div className="flex flex-col group">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Max Price</label>
              <input
                type="number"
                placeholder="Unlimited"
                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300"
                value={condition.maxPrice || ''}
                onChange={(e) => setCondition({ ...condition, maxPrice: Number(e.target.value) || undefined })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-bold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Car List - Premium Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-light text-lg">
              조건에 맞는 차량이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {cars.map((car) => (
                <Link key={car.id} href={`/cars/${car.id}`} className="group block cursor-pointer">
                  <div className="overflow-hidden mb-4">
                    <div className="aspect-w-16 aspect-h-10 w-full h-64 bg-gray-100 relative overflow-hidden">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={`http://localhost:8080/images/${car.images[0]}`}
                          alt={`${car.brand} ${car.modelName}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                      )}
                      <div className="absolute top-0 right-0 p-4">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold uppercase tracking-wide text-black">
                          {car.productionYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {car.brand} {car.modelName}
                    </h3>
                    <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 mt-3">
                      <p className="text-lg font-bold text-black">
                        {car.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">만원</span>
                      </p>
                      <div className="text-sm text-gray-400 space-x-2">
                        <span>{car.mileage.toLocaleString()} km</span>
                        <span>·</span>
                        <span>{formatFuelType(car.fuelType)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
      `}</style>
    </div>
  );
}
