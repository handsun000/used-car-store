'use client';

import React, { useState, useEffect } from 'react';
import { CarRequest, FuelType, Transmission } from '@/types';

interface CarFormProps {
    initialData?: CarRequest;
    onSubmit: (formData: CarRequest, images: File[]) => Promise<void>;
    isLoading: boolean;
    buttonText: string;
}

export default function CarForm({ initialData, onSubmit, isLoading, buttonText }: CarFormProps) {
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

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
        imageUrls: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.imageUrls) {
                setExistingImages(initialData.imageUrls);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount to avoid re-initializing on parent re-renders when form submits

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
            setNewImages(prev => [...prev, ...files]);

            // Create preview URLs
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: If no images at all
        if (existingImages.length === 0 && newImages.length === 0) {
            alert('최소 1장의 이미지를 등록해주세요.');
            return;
        }

        // Update formData with the potentially modified existingImages list
        const finalFormData = {
            ...formData,
            imageUrls: existingImages
        };

        await onSubmit(finalFormData, newImages);
    };

    // Style classes
    const inputClass = "w-full rounded-lg border-slate-200 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 py-3 px-4 border bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none";
    const labelClass = "block text-sm font-extrabold text-slate-800 mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>제조사 (Brand)</label>
                    <input
                        type="text"
                        name="brand"
                        required
                        className={inputClass}
                        placeholder="예: Hyundai, BMW"
                        value={formData.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className={labelClass}>모델명 (Model)</label>
                    <input
                        type="text"
                        name="modelName"
                        required
                        className={inputClass}
                        placeholder="예: Sonata, 520d"
                        value={formData.modelName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className={labelClass}>연식 (Year)</label>
                    <input
                        type="number"
                        name="productionYear"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className={inputClass}
                        value={formData.productionYear}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className={labelClass}>주행거리 (km)</label>
                    <input
                        type="number"
                        name="mileage"
                        required
                        min="0"
                        className={inputClass}
                        value={formData.mileage}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Price & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>가격 (만원)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        className={inputClass}
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center pt-6">
                    <input
                        type="checkbox"
                        name="accidentHistory"
                        id="accidentHistory"
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer transition-transform duration-200 checked:scale-105"
                        checked={formData.accidentHistory}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="accidentHistory" className="ml-2 block text-sm text-gray-700 font-bold cursor-pointer hover:text-blue-600 transition-colors">
                        사고 이력 있음 (Accident History)
                    </label>
                </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>연료 (Fuel)</label>
                    <select
                        name="fuelType"
                        className={inputClass}
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
                    <label className={labelClass}>변속기 (Transmission)</label>
                    <select
                        name="transmission"
                        className={inputClass}
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
                <label className={labelClass}>차량 설명</label>
                <textarea
                    name="description"
                    rows={4}
                    required
                    className={inputClass}
                    placeholder="차량 상세 설명을 입력하세요..."
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className={labelClass + " mb-2"}>차량 이미지</label>

                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Existing Images */}
                    {existingImages.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="이미지 삭제"
                            >
                                &times;
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 text-center truncate">기존</span>
                        </div>
                    ))}

                    {/* New Images */}
                    {newImagePreviews.map((url, idx) => (
                        <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-blue-200 ring-2 ring-blue-100 group">
                            <img src={url} alt={`New ${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeNewImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="이미지 삭제"
                            >
                                &times;
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 bg-blue-500/70 text-white text-[10px] px-1 text-center truncate">신규</span>
                        </div>
                    ))}

                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 bg-gray-50 transition-all duration-200 group">
                        <span className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors">+</span>
                        <span className="text-xs text-gray-500 mt-1 group-hover:text-blue-600 transition-colors">추가</span>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                <p className="text-xs text-gray-500">* 첫 번째 이미지가 대표 이미지가 됩니다.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-lg font-bold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed opacity-70'
                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:-translate-y-0.5'
                        }`}
                >
                    {isLoading ? '처리 중...' : buttonText}
                </button>
            </div>
        </form>
    );
}
