import { CarResponse, CarSearchCondition } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function fetchCars(condition?: CarSearchCondition): Promise<CarResponse[]> {
    const params = new URLSearchParams();
    if (condition) {
        Object.entries(condition).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
    }

    const res = await fetch(`${API_BASE_URL}/cars/search?${params.toString()}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch cars');
    }

    return res.json();
}

export async function fetchCar(id: number): Promise<CarResponse> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch car');
    }

    return res.json();
}
