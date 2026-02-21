'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCarDetail } from '@/lib/api/cars';
import { CarResponse, FuelType, Transmission } from '@/types';

export default function CarDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [car, setCar] = useState<CarResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        const id = params.id;
        if (id) {
            fetchCarDetail(Number(id));
        }
    }, [params.id]);

    const fetchCarDetail = async (id: number) => {
        setIsLoading(true);
        try {
            const data = await getCarDetail(id);
            setCar(data);
            if (data.images && data.images.length > 0) {
                setSelectedImage(data.images[0]);
            }
        } catch (error) {
            console.error('Failed to fetch car detail:', error);
            alert('차량 정보를 불러오는데 실패했습니다.');
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handlePurchaseInquiry = () => {
        alert('판매자에게 문의가 접수되었습니다.');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!car) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-gray-600 hover:text-blue-600 flex items-center font-medium"
                >
                    ← 목록으로 돌아가기
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                        {/* Left Column: Image Gallery */}
                        <div className="p-6 lg:p-8 bg-gray-50 lg:border-r border-gray-100">
                            <div className="aspect-w-4 aspect-h-3 w-full bg-white rounded-xl overflow-hidden shadow-sm mb-4 relative">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={`${car.brand} ${car.modelName}`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                        No Image
                                    </div>
                                )}
                                {!selectedImage && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 -z-10">
                                        No Image
                                    </div>
                                )}
                                {car.status === 'RESERVED' && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-red-500/95 shadow-md backdrop-blur-sm px-4 py-2 text-sm font-bold tracking-wide text-white rounded-lg">
                                            예약중 차량
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {car.images && car.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {car.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                                                ? 'border-blue-600 ring-2 ring-blue-100'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Car Info */}
                        <div className="p-6 lg:p-8 flex flex-col">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {car.brand} {car.modelName}
                                </h1>
                                <p className="text-4xl font-extrabold text-blue-600 mb-8">
                                    {car.price.toLocaleString()} <span className="text-lg font-medium text-gray-500">만원</span>
                                </p>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm text-gray-500 mb-1">연식</span>
                                        <span className="text-lg font-semibold text-gray-900">{car.productionYear}년</span>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm text-gray-500 mb-1">주행거리</span>
                                        <span className="text-lg font-semibold text-gray-900">{car.mileage.toLocaleString()} km</span>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm text-gray-500 mb-1">연료</span>
                                        <span className="text-lg font-semibold text-gray-900">{formatFuelType(car.fuelType)}</span>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm text-gray-500 mb-1">변속기</span>
                                        <span className="text-lg font-semibold text-gray-900">{formatTransmission(car.transmission)}</span>
                                    </div>
                                    <div className="col-span-2 border-b border-gray-100 pb-2">
                                        <span className="block text-sm text-gray-500 mb-1">사고 유무</span>
                                        <span className={`text-lg font-semibold ${car.accidentHistory ? 'text-red-500' : 'text-green-600'}`}>
                                            {car.accidentHistory ? '사고 이력 있음' : '무사고'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">차량 설명</h3>
                                    <div className="prose prose-blue text-gray-600 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                        {car.description}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <button
                                    onClick={handlePurchaseInquiry}
                                    className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    구매 문의하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
