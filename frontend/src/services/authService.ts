import { fetchApi, setAuthToken, removeAuthToken } from '../config/api';
import type { AuthRequest, AuthResponse, RegisterRequest, UserProfile } from '../types';

export const authService = {
    // Login
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        const response = await fetchApi<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (response.accessToken) {
            setAuthToken(response.accessToken);
        }
        return response;
    },

    // Register (uses ProfileController /register endpoint)
    async register(data: RegisterRequest): Promise<UserProfile> {
        return fetchApi<UserProfile>('/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Check auth status
    async isAuthenticated(): Promise<boolean> {
        return fetchApi<boolean>('/is-authenticated');
    },

    // Logout
    async logout(): Promise<void> {
        await fetchApi('/logout', { method: 'POST' });
        removeAuthToken();
    }
};
