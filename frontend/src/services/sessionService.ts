import { fetchApi } from '../config/api';
import type {
    SessionDto
} from '../types';

export const sessionService = {
    // Request a new session
    async requestSession(teacherId: number, skill: string): Promise<SessionDto> {
        const params = new URLSearchParams({
            teacherId: teacherId.toString(),
            skill,
        });
        return fetchApi<SessionDto>(`/api/sessions/request?${params.toString()}`, {
            method: 'POST'
        });
    },

    // Update session status (ACCEPT, CANCEL, COMPLETE)
    async updateStatus(sessionId: number, status: string): Promise<SessionDto> {
        return fetchApi<SessionDto>(`/api/sessions/${sessionId}/status?status=${status}`, {
            method: 'PUT'
        });
    },

    // Get my sessions
    async getMySessions(): Promise<SessionDto[]> {
        return fetchApi<SessionDto[]>('/api/sessions/my-sessions');
    }
};
