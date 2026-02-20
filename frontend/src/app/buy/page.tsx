'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchCars } from '@/lib/api/cars';
import { CarResponse, CarSearchCondition, FuelType, Transmission } from '@/types';

export default function BuyPage() {
    const [cars, setCars] = useState<CarResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            const validCondition: CarSearchCondition = {
                statuses: ['FOR_SALE', 'RESERVED']
            };
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
        <div className="min-h-screen bg-gray-50 pt-24 font-sans text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Page Title */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">내차사기</h1>
                    <p className="text-gray-500 text-lg">원하는 조건으로 최적의 차량을 검색해보세요.</p>
                </div>

                {/* Modern Minimal Search Filter */}
                <div className="mb-20 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-8 tracking-tight text-gray-900">Find Your Model</h2>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-6 items-end">

                        <div className="flex flex-col group">
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Brand</label>
                            <input
                                type="text"
                                placeholder="All Brands"
                                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300 text-gray-900"
                                value={condition.brand || ''}
                                onChange={(e) => setCondition({ ...condition, brand: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Model</label>
                            <input
                                type="text"
                                placeholder="Model Name"
                                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300 text-gray-900"
                                value={condition.modelName || ''}
                                onChange={(e) => setCondition({ ...condition, modelName: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Min Price</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300 text-gray-900"
                                value={condition.minPrice || ''}
                                onChange={(e) => setCondition({ ...condition, minPrice: Number(e.target.value) || undefined })}
                            />
                        </div>

                        <div className="flex flex-col group">
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold group-focus-within:text-black transition-colors">Max Price</label>
                            <input
                                type="number"
                                placeholder="Unlimited"
                                className="w-full border-b border-gray-300 py-3 bg-transparent text-lg focus:border-black focus:outline-none transition-all placeholder-gray-300 text-gray-900"
                                value={condition.maxPrice || ''}
                                onChange={(e) => setCondition({ ...condition, maxPrice: Number(e.target.value) || undefined })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-bold rounded-lg shadow-md md:col-span-2 lg:col-span-1"
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
                                <Link key={car.id} href={`/cars/${car.id}`} className="group block cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="overflow-hidden mb-4">
                                        <div className="aspect-w-16 aspect-h-10 w-full h-64 bg-gray-100 relative overflow-hidden">
                                            {car.images && car.images.length > 0 ? (
                                                <img
                                                    src={car.images[0]}
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
                                                <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold uppercase tracking-wide text-black rounded-md">
                                                    {car.productionYear}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-2 space-y-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {car.brand} {car.modelName}
                                        </h3>
                                        <div className="flex justify-between items-baseline pt-4 border-t border-gray-100 mt-4">
                                            <p className="text-2xl font-bold text-black">
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
            </div>
        </div>
    );
}
