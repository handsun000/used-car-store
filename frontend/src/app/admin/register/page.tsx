'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerCar } from '@/lib/api/cars'; // Assuming this alias exists or use relative path
import { CarRequest } from '@/types';
import CarForm from '@/components/CarForm';

// Fix import path if necessary based on project structure
// In original file it was: import { registerCar } from '@/lib/api/cars'; 
// But in api.ts view earlier it was export async function createCar ... inside @/lib/api.ts
// Use createCar from @/lib/api
import { createCar } from '@/lib/api';

export default function RegisterCarPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: CarRequest, images: File[]) => {
        setIsLoading(true);
        try {
            // Convert to FormData
            const data = new FormData();

            // Append JSON part
            data.append('carRequest', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

            // Append Images
            images.forEach(image => {
                data.append('images', image);
            });

            await createCar(data);
            alert('차량 등록이 완료되었습니다.');
            router.push('/admin/manage'); // Redirect to manage page after registration
        } catch (error) {
            console.error('Registration failed:', error);
            alert('차량 등록 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">차량 매물 등록</h1>
            <CarForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                buttonText="차량 등록하기"
            />
        </div>
    );
}

