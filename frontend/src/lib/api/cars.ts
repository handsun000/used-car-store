import api from '../axios';
import { CarRequest, CarResponse, CarSearchCondition } from '@/types';

export const registerCar = async (data: CarRequest, images: File[]) => {
    const formData = new FormData();

    // 'car' part as JSON
    const carBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('car', carBlob);

    // 'images' part as Files
    images.forEach((image) => {
        formData.append('images', image);
    });

    const response = await api.post('/cars', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const searchCars = async (condition: CarSearchCondition): Promise<CarResponse[]> => {
    const response = await api.get<CarResponse[]>('/cars/search', {
        params: condition,
    });
    return response.data;
};

export const getCarDetail = async (id: number): Promise<CarResponse> => {
    const response = await api.get<CarResponse>(`/cars/${id}`);
    return response.data;
};
