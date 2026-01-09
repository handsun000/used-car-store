import api from '../axios';
import { AuthResponse, LoginRequest } from '@/types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};
