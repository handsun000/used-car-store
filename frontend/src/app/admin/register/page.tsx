'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerCar } from '@/lib/api/cars';
import { CarRequest, FuelType, Transmission } from '@/types';

export default function RegisterCarPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState<CarRequest>({
        brand: '',
        modelName: '',
        productionYear: new Date().getFullYear(),
        mileage: 0,
        price: 0,
        fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC',
        accidentHistory: false,
        description: '',
        imageUrls: [], // Backwards compatibility, unused in submission
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'productionYear' || name === 'mileage' || name === 'price') {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            // Create preview URLs
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            // Revoke the URL to avoid memory leaks
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('최소 1장의 이미지를 등록해주세요.');
            return;
        }

        if (!confirm('차량을 등록하시겠습니까?')) return;

        setIsLoading(true);
        try {
            await registerCar(formData, images);
            alert('차량 등록이 완료되었습니다.');
            router.push('/');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('차량 등록 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
            <h1 className="text-3xl font-bold mb-8 text-white">차량 매물 등록</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">제조사 (Brand)</label>
                        <input
                            type="text"
                            name="brand"
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                            placeholder="예: Hyundai, BMW"
                            value={formData.brand}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">모델명 (Model)</label>
                        <input
                            type="text"
                            name="modelName"
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                            placeholder="예: Sonata, 520d"
                            value={formData.modelName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">연식 (Year)</label>
                        <input
                            type="number"
                            name="productionYear"
                            required
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                            value={formData.productionYear}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">주행거리 (km)</label>
                        <input
                            type="number"
                            name="mileage"
                            required
                            min="0"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                            value={formData.mileage}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Price & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">가격 (만원)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex items-center pt-6">
                        <input
                            type="checkbox"
                            name="accidentHistory"
                            id="accidentHistory"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                            checked={formData.accidentHistory}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="accidentHistory" className="ml-2 block text-sm text-white font-bold">
                            사고 이력 있음 (Accident History)
                        </label>
                    </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">연료 (Fuel)</label>
                        <select
                            name="fuelType"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black"
                            value={formData.fuelType}
                            onChange={handleInputChange}
                        >
                            <option value="GASOLINE">가솔린 (Gasoline)</option>
                            <option value="DIESEL">디젤 (Diesel)</option>
                            <option value="ELECTRIC">전기 (Electric)</option>
                            <option value="HYBRID">하이브리드 (Hybrid)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">변속기 (Transmission)</label>
                        <select
                            name="transmission"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black"
                            value={formData.transmission}
                            onChange={handleInputChange}
                        >
                            <option value="AUTOMATIC">자동 (Automatic)</option>
                            <option value="MANUAL">수동 (Manual)</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-white mb-1">차량 설명</label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-black placeholder:text-gray-500"
                        placeholder="차량 상세 설명을 입력하세요..."
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">차량 이미지</label>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg text-xs hover:bg-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}

                        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-700 bg-gray-800 transition-colors">
                            <span className="text-2xl text-gray-400">+</span>
                            <span className="text-xs text-gray-400 mt-1">추가</span>
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-400">* 첫 번째 이미지가 대표 이미지가 됩니다.</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? '등록 처리 중...' : '차량 등록하기'}
                    </button>
                </div>
            </form>
        </div>);
}
