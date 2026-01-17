import { fetchApi } from '../config/api';
import type { SwapMatch } from '../types';

export const matchService = {
    // Find swap matches
    async findSwapMatches(skillToLearn: string, skillToTeach: string): Promise<SwapMatch[]> {
        const params = new URLSearchParams({
            skillToLearn,
            skillToTeach,
        });
        return fetchApi<SwapMatch[]>(`/api/matches/swap?${params.toString()}`);
    },
};
