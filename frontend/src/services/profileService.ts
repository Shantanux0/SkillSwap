import { fetchApi } from '../config/api';
import type { UserProfile, UserProfileUpdate } from '../types';

export const profileService = {
    // Get current user's profile
    async get(): Promise<UserProfile> {
        return fetchApi<UserProfile>('/api/profile');
    },

    // Create profile
    async create(profile: UserProfileUpdate): Promise<UserProfile> {
        return fetchApi<UserProfile>('/api/profile', {
            method: 'POST',
            body: JSON.stringify(profile),
        });
    },

    // Update profile
    async update(profile: UserProfileUpdate): Promise<UserProfile> {
        return fetchApi<UserProfile>('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(profile),
        });
    },

    // Delete profile
    async delete(): Promise<{ message: string }> {
        return fetchApi<{ message: string }>('/api/profile', {
            method: 'DELETE',
        });
    },

    // Search profiles
    async search(keyword: string, page = 0, size = 10): Promise<{
        content: UserProfile[];
        totalPages: number;
        totalElements: number;
    }> {
        return fetchApi(`/api/profile/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    },
};
