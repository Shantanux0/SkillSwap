import { fetchApi } from '../config/api';
import type { SkillLevel } from '../types';

export const skillLevelService = {
    // Get all skill levels for current user
    async getAll(): Promise<SkillLevel[]> {
        return fetchApi<SkillLevel[]>('/api/profile/skills');
    },

    // Get specific skill level
    async getBySkill(skillName: string): Promise<SkillLevel> {
        return fetchApi<SkillLevel>(`/api/profile/skills/${encodeURIComponent(skillName)}`);
    },

    // Add or update skill level
    async addOrUpdate(skillLevel: Omit<SkillLevel, 'id'>): Promise<SkillLevel> {
        return fetchApi<SkillLevel>('/api/profile/skills', {
            method: 'POST',
            body: JSON.stringify(skillLevel),
        });
    },

    // Delete skill level
    async delete(skillName: string): Promise<{ message: string }> {
        return fetchApi<{ message: string }>(`/api/profile/skills/${encodeURIComponent(skillName)}`, {
            method: 'DELETE',
        });
    },
};
