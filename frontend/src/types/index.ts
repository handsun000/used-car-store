export type FuelType = 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type Transmission = 'AUTOMATIC' | 'MANUAL';
export type CarStatus = 'FOR_SALE' | 'SOLD' | 'RESERVED';

export interface CarRequest {
    brand: string;
    modelName: string;
    productionYear: number;
    mileage: number;
    price: number;
    fuelType: FuelType;
    transmission: Transmission;
    accidentHistory: boolean;
    description: string;
    imageUrls: string[]; // Keep for compatibility, though files are preferred
}

export type Car = CarResponse;

export interface CarResponse {
    id: number;
    brand: string;
    modelName: string;
    productionYear: number;
    mileage: number;
    price: number;
    fuelType: FuelType;
    transmission: Transmission;
    accidentHistory: boolean;
    status: CarStatus;
    description: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CarSearchCondition {
    brand?: string;
    modelName?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    minMileage?: number;
    maxMileage?: number;
    fuelType?: FuelType;
    transmission?: Transmission;
    statuses?: CarStatus[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
    email: string;
    name: string;
    code: string;
}

export interface EmailVerificationRequest {
    email: string;
    code?: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
}

export interface PostRequest {
    title: string;
    content: string;
}

export interface PostResponse {
    id: number;
    title: string;
    authorName: string;
    views: number;
    createdAt: string;
}

export interface PostDetailResponse extends PostResponse {
    content: string;
}
