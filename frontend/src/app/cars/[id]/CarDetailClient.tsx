'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CarResponse, FuelType, Transmission } from '@/types';

interface CarDetailClientProps {
    car: CarResponse;
}

export default function CarDetailClient({ car }: CarDetailClientProps) {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string>(car.images && car.images.length > 0 ? car.images[0] : '');

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
        alert('판매자에게 구매 문의가 접수되었습니다. (손승진 대표가 직접 확인 및 답변합니다.)');
    };

    return (
        <article className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Semantic Breadcrumbs (Internal Links for Crawler & User) */}
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                        <li><button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors focus:outline-none">홈</button></li>
                        <li className="text-slate-300">/</li>
                        <li><button onClick={() => router.push('/buy')} className="hover:text-blue-600 transition-colors focus:outline-none">내차사기</button></li>
                        <li className="text-slate-300">/</li>
                        <li className="text-slate-900" aria-current="page">{car.brand} {car.modelName}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Left Column: Images */}
                        <section aria-label="차량 사진 갤러리" className="p-6 lg:p-8 bg-slate-100/50">
                            {/* Main Image */}
                            <div className="aspect-w-4 aspect-h-3 w-full h-[400px] lg:h-[500px] bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-4 relative group">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={`${car.brand} ${car.modelName} 실매물 중고차 전면 및 측면 외관`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-400 bg-slate-50 font-medium">
                                        No Image Available
                                    </div>
                                )}
                                {car.status === 'RESERVED' && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-blue-600 shadow-md backdrop-blur-sm px-4 py-2 text-sm font-bold tracking-wide text-white rounded-lg">
                                            예약중 차량
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {car.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        aria-label={`${car.brand} ${car.modelName} 외부 전경 및 실내 상세 뷰 ${idx + 1}`}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedImage === img
                                                ? 'border-blue-600 shadow-md scale-100'
                                                : 'border-transparent hover:border-blue-300 hover:scale-105 opacity-80 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${car.brand} ${car.modelName} 세부 이미지 ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Right Column: Car Info */}
                        <section aria-labelledby="car-details-title" className="p-6 lg:p-8 flex flex-col">
                            <div>
                                <h1 id="car-details-title" className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                    {car.brand} {car.modelName}
                                </h1>
                                <p className="text-4xl font-extrabold text-blue-600 mb-8">
                                    {car.price.toLocaleString()} <span className="text-lg font-bold text-slate-900">만원</span>
                                </p>

                                {/* Specs Grid */}
                                <h2 className="sr-only">차량 주요 제원 및 스펙</h2>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                    <div className="border-b border-slate-100 pb-2">
                                        <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">연식</span>
                                        <span className="text-lg font-bold text-slate-900">{car.productionYear}년</span>
                                    </div>
                                    <div className="border-b border-slate-100 pb-2">
                                        <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">주행거리</span>
                                        <span className="text-lg font-bold text-slate-900">{car.mileage.toLocaleString()} km</span>
                                    </div>
                                    <div className="border-b border-slate-100 pb-2">
                                        <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">연료</span>
                                        <span className="text-lg font-bold text-slate-900">{formatFuelType(car.fuelType)}</span>
                                    </div>
                                    <div className="border-b border-slate-100 pb-2">
                                        <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">변속기</span>
                                        <span className="text-lg font-bold text-slate-900">{formatTransmission(car.transmission)}</span>
                                    </div>
                                    <div className="col-span-2 border-b border-slate-100 pb-2">
                                        <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">사고 유무</span>
                                        <span className={`text-lg font-extrabold ${car.accidentHistory ? 'text-red-500' : 'text-blue-600'}`}>
                                            {car.accidentHistory ? '사고 이력 있음' : '무사고 확인 (손승진 대표 보증)'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-3">딜러의 차량 상세 설명</h2>
                                    <div className="prose prose-blue prose-slate max-w-none bg-slate-50 p-6 rounded-2xl whitespace-pre-wrap font-medium leading-relaxed border border-slate-100">
                                        {car.description}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <button
                                    onClick={handlePurchaseInquiry}
                                    aria-label={`${car.brand} ${car.modelName} 차량 안심 구매 문의하기`}
                                    className="w-full bg-blue-600 text-white text-lg font-extrabold py-5 rounded-xl hover:bg-blue-500 transition-all duration-300 hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center tracking-wide"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    안심 구매 문의하기
                                </button>
                                <p className="text-center text-xs text-slate-400 font-medium mt-4">
                                    손승진 대표가 허위매물 여부를 직접 100% 검증한 매물입니다.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </article>
    );
}
