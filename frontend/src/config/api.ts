// API Configuration
export const API_BASE_URL = 'http://localhost:8080';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Set auth token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

// Remove auth token
export const removeAuthToken = (): void => {
    localStorage.removeItem('authToken');
};

// Create headers with auth token
export const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// Handle API errors
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Generic fetch wrapper
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new ApiError(response.status, error.message || 'An error occurred');
    }

    return response.json();
}
