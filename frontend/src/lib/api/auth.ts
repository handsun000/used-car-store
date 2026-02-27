import api from '../axios';
import { AuthResponse, LoginRequest, SignupRequest, EmailVerificationRequest } from '@/types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};

export const sendVerificationEmail = async (data: EmailVerificationRequest): Promise<string> => {
    const response = await api.post<string>('/auth/email/send', data);
    return response.data;
};

export const verifyEmailCode = async (data: EmailVerificationRequest): Promise<boolean> => {
    const response = await api.post<boolean>('/auth/email/verify', data);
    return response.data;
};

export const signup = async (data: SignupRequest): Promise<string> => {
    const response = await api.post<string>('/auth/signup', data);
    return response.data;
};

export const checkUsername = async (username: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/auth/check-username?username=${username}`);
    return response.data;
};
