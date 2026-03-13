import { CarResponse, CarSearchCondition } from '@/types';
import api from './axios';

export async function fetchCars(condition?: CarSearchCondition): Promise<CarResponse[]> {
    const params: Record<string, any> = {};
    if (condition) {
        Object.entries(condition).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'statuses' && Array.isArray(value)) {
                    params['statuses'] = value.join(',');
                } else {
                    params[key] = value;
                }
            }
        });
    }

    const { data } = await api.get<CarResponse[]>('/cars/search', { params });
    return data;
}

export async function fetchCar(id: number): Promise<CarResponse> {
    const { data } = await api.get<CarResponse>(`/cars/${id}`);
    return data;
}

export async function createCar(formData: FormData): Promise<void> {
    await api.post('/cars', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function updateCar(id: number, formData: FormData): Promise<void> {
    await api.put(`/cars/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function updateCarStatus(id: number, status: string): Promise<void> {
    await api.patch(`/cars/${id}/status`, JSON.stringify(status), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function deleteCar(id: number): Promise<void> {
    await api.delete(`/cars/${id}`);
}
