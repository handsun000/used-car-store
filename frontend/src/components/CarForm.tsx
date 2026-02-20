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
        imageUrls: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.imageUrls) {
                setPreviewUrls(initialData.imageUrls);
            }
        }
    }, [initialData]);

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
        // If removing an existing image (from initialData), we just remove it from preview.
        // Handling logic for deleting existing images on server is complex, currently we just support adding new ones for simplicity or replacing.
        // However, for pure UI, we update the preview list.
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => {
            // Adjust index if mixed with existing images... 
            // Simplified: We assumes added images are appended. 
            // If we remove an image that was just added, we remove it from `images`.
            // If we remove an initial image, `images` array might not have it.
            // Complex logic needed for full support. For now, simplifed:
            return i !== index; // This is buggy if mixing initial valid URLs with File objects.
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: If no initial images and no new images, alert.
        const totalImages = (initialData?.imageUrls?.length || 0) + images.length;
        if (previewUrls.length === 0) { // Using previewUrls as proxy for total visible images
            alert('최소 1장의 이미지를 등록해주세요.');
            return;
        }

        await onSubmit(formData, images);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">제조사 (Brand)</label>
                    <input
                        type="text"
                        name="brand"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="예: Hyundai, BMW"
                        value={formData.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">모델명 (Model)</label>
                    <input
                        type="text"
                        name="modelName"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="예: Sonata, 520d"
                        value={formData.modelName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">연식 (Year)</label>
                    <input
                        type="number"
                        name="productionYear"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
                        value={formData.productionYear}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">주행거리 (km)</label>
                    <input
                        type="number"
                        name="mileage"
                        required
                        min="0"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
                        value={formData.mileage}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Price & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">가격 (만원)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
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
                    <label htmlFor="accidentHistory" className="ml-2 block text-sm text-gray-700 font-bold">
                        사고 이력 있음 (Accident History)
                    </label>
                </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">연료 (Fuel)</label>
                    <select
                        name="fuelType"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900"
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">변속기 (Transmission)</label>
                    <select
                        name="transmission"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">차량 설명</label>
                <textarea
                    name="description"
                    rows={4}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder="차량 상세 설명을 입력하세요..."
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">차량 이미지</label>

                <div className="flex flex-wrap gap-4 mb-4">
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            {/* Deletion disabled for now for simplicity in MVP edit */}
                            {/* <button type="button" onClick={() => removeImage(idx)} ...>삭제</button> */}
                        </div>
                    ))}

                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-gray-50 transition-colors">
                        <span className="text-2xl text-gray-400">+</span>
                        <span className="text-xs text-gray-500 mt-1">추가</span>
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
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isLoading ? '처리 중...' : buttonText}
                </button>
            </div>
        </form>
    );
}
