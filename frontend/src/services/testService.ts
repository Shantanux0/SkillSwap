import { fetchApi } from '../config/api';
import type {
    TestResponse,
    TestResultResponse,
    GenerateTestRequest,
    SubmitTestRequest
} from '../types';

export const testService = {
    // Generate a new test
    async generateTest(skillName: string): Promise<TestResponse> {
        const request: GenerateTestRequest = { skillName };
        return fetchApi<TestResponse>('/api/test/generate', {
            method: 'POST',
            body: JSON.stringify(request)
        });
    },

    // Submit a test
    async submitTest(request: SubmitTestRequest): Promise<TestResultResponse> {
        return fetchApi<TestResultResponse>('/api/test/submit', {
            method: 'POST',
            body: JSON.stringify(request)
        });
    },

    // Get test history
    async getHistory(): Promise<any[]> { // detailed typing deferred if needed
        return fetchApi<any[]>('/api/test/history');
    },

    // Get specific result
    async getResult(testId: number): Promise<TestResultResponse> {
        return fetchApi<TestResultResponse>(`/api/test/result/${testId}`);
    },

    // Check qualification status
    async checkQualification(skill: string): Promise<{ isQualified: boolean }> {
        return fetchApi<{ isQualified: boolean }>(`/api/test/qualification-status?skill=${encodeURIComponent(skill)}`);
    }
};
