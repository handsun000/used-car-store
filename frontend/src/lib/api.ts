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

export async function createCar(formData: FormData): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cars`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create car');
    }
}

export async function updateCar(id: number, formData: FormData): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update car');
    }
}

export async function updateCarStatus(id: number, status: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
    });

    if (!res.ok) {
        throw new Error('Failed to update car status');
    }
}

export async function deleteCar(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete car');
    }
}
