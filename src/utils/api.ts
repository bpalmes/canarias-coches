import { getToken } from './auth';

export interface ImportResult {
  message: string;
  created: number;
  updated: number;
  errors: string[];
}

export async function importCsv(file: File): Promise<ImportResult> {
  const token = getToken();
  if (!token) throw new Error('No authentication token found.');

  const formData = new FormData();
  formData.append('file', file); // 'file' instead of 'files'

  const response = await fetch(`/api/cars/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to import CSV.');
  }

  return response.json();
}

export interface Car {
  id: number;
  name: string;
}

export async function searchCars(term: string): Promise<Car[]> {
  const token = getToken();
  if (!token) throw new Error('No authentication token found.');

  const query = new URLSearchParams({ term });
  
  const response = await fetch(`/api/cars/search?${query.toString()}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to search for cars.');
  }

  return response.json();
}

export interface OfferData {
  title: string;
  cars: number[];
}

export interface OfferCreationResponse {
  message: string;
  offerUrl: string;
  offer: {
    id: number;
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  }
}

export async function createOffer(offerData: OfferData): Promise<OfferCreationResponse> {
  const token = getToken();
  if (!token) throw new Error('No authentication token found.');

  const response = await fetch(`/api/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(offerData), // Simplified body
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create offer.');
  }

  return response.json();
} 