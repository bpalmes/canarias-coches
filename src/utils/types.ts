import { Car as PrismaCar, Image as PrismaImage, Offer as PrismaOffer } from '@prisma/client';

export type CarImage = PrismaImage;
export type Offer = PrismaOffer;

export type Car = Omit<PrismaCar, 'createdAt' | 'updatedAt'> & {
    id: number;
    name: string;
    description: string | null;
    sku: string;
    numberplate: string | null;
    kms: number;
    year: number;
    fuel: string;
    bodytype: string;
    version: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    images?: CarImage[];
  };
  
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// Interfaces para el sistema de autenticación
export interface AuthResponse {
    jwt: string;
    user: {
        id: number;
        email: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    }
}

export interface AuthCredentials {
    identifier: string;
    password: string;
}

// Mantener compatibilidad con nombres anteriores
export type StrapiAuthResponse = AuthResponse;
export type StrapiCredentials = AuthCredentials;
