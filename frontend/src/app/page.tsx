'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchCars } from '@/lib/api/cars';
import { CarResponse, CarSearchCondition, FuelType, Transmission } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Removed isLoggedIn state as header is removed

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
    <div className="min-h-screen bg-gray-50">
      {/* Header removed as requested */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="제조사 (예: Hyundai)"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
              value={condition.brand || ''}
              onChange={(e) => setCondition({ ...condition, brand: e.target.value })}
            />
            <input
              type="text"
              placeholder="모델명 (예: Sonata)"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
              value={condition.modelName || ''}
              onChange={(e) => setCondition({ ...condition, modelName: e.target.value })}
            />
            <input
              type="number"
              placeholder="최소 가격 (만원)"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
              value={condition.minPrice || ''}
              onChange={(e) => setCondition({ ...condition, minPrice: Number(e.target.value) || undefined })}
            />
            <input
              type="number"
              placeholder="최대 가격 (만원)"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
              value={condition.maxPrice || ''}
              onChange={(e) => setCondition({ ...condition, maxPrice: Number(e.target.value) || undefined })}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* Car Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            등록된 차량이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`} className="group">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 w-full h-48 bg-gray-200 relative">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={`http://localhost:8080/images/${car.images[0]}`}
                        alt={`${car.brand} ${car.modelName}`}
                        className="w-full h-full object-cover z-10 relative"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 z-0">
                      No Image
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-20">
                      {car.productionYear}년식
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                      {car.brand} {car.modelName}
                    </h3>
                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {car.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">만원</span>
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>{car.mileage.toLocaleString()} km</span>
                      <span>{formatFuelType(car.fuelType)}</span>
                      <span>{formatTransmission(car.transmission)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
