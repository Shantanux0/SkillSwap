// Skill Level Types
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface SkillLevel {
    id?: number;
    skillName: string;
    proficiencyLevel: ProficiencyLevel;
    yearsOfExperience?: number;
    selfRating?: number; // 1-5
    projectsCompleted?: number;
    lastUsedDate?: string; // ISO date
    willingToTeach: boolean;
}

// Profile Types
export type LearningGoal = 'JOB_PREP' | 'CAREER_SWITCH' | 'PERSONAL_PROJECT' | 'EXPLORATION';
export type GoalTimeline = 'URGENT' | 'MEDIUM' | 'FLEXIBLE' | 'CASUAL';
export type TeachingMotivation = 'LOVE_TEACHING' | 'REINFORCE_KNOWLEDGE' | 'BUILD_REPUTATION' | 'NETWORKING';
export type TeachingApproach = 'STEP_BY_STEP' | 'PROJECT_BASED' | 'PROBLEM_SOLVING' | 'CONCEPT_FIRST';
export type CommunicationPace = 'FAST' | 'MODERATE' | 'SLOW';

export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    profileImageUrl?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    location?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    skills: string;
    interests?: string;

    // Enhanced matching fields
    skillsToLearn?: string;
    timezone?: string;
    hoursPerWeek?: number;
    availabilitySchedule?: string; // JSON string
    learningGoal?: LearningGoal;
    goalTimeline?: GoalTimeline;
    teachingMotivation?: TeachingMotivation;
    teachingApproach?: TeachingApproach;
    preferredLearningMethod?: string;
    communicationPace?: CommunicationPace;
    preferredLanguage?: string;
    domainFocus?: string;
    profileCompletenessScore?: number;

    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    skillLevels?: SkillLevel[];
}

export interface UserProfileUpdate {
    firstName: string;
    lastName: string;
    bio?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    location?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    skills: string;
    interests?: string;

    // Enhanced matching fields
    skillsToLearn?: string;
    timezone?: string;
    hoursPerWeek?: number;
    availabilitySchedule?: string;
    learningGoal?: LearningGoal;
    goalTimeline?: GoalTimeline;
    teachingMotivation?: TeachingMotivation;
    teachingApproach?: TeachingApproach;
    preferredLearningMethod?: string;
    communicationPace?: CommunicationPace;
    preferredLanguage?: string;
    domainFocus?: string;
}

// Swap Match Types
export type SwapType = 'PERFECT_SWAP' | 'PARTIAL_MATCH';

export interface SwapMatch {
    partnerId: number;
    partnerName: string;
    partnerEmail: string;
    profileImageUrl?: string;
    location?: string;
    timezone?: string;

    skillILearn: string;
    skillITeach: string;

    matchScore: number; // 0-1
    swapType: SwapType;
    mutualMatch: boolean;

    // Component scores (0-1)
    skillLevelGapScore: number;
    goalAlignmentScore: number;
    availabilityScore: number;
    timeCommitmentScore: number;
    learningStyleScore: number;

    // Historical scores (0-1)
    theirTestScore: number;
    theirCertScore: number;
    theirReputationScore: number;
    myTestScore: number;
    myCertScore: number;
    myReputationScore: number;

    // Context
    theirSkillLevel: string;
    mySkillLevel: string;
    theirGoal?: string;
    myGoal?: string;
    availabilityOverlapHours: number;
    compatibilityReason: string;

    // Partner info
    partnerBio?: string;
    partnerSkills?: string;
    partnerSkillsToLearn?: string;
    partnerHoursPerWeek?: number;
    partnerLearningMethod?: string;
    partnerDomainFocus?: string;
}

// Auth Types
export interface AuthRequest {
    email: string;
    password?: string;
}

export interface AuthResponse {
    email: string;
    accessToken: string;
}

export interface RegisterRequest {
    name: string; // "firstName lastName"
    email: string;
    password?: string;
}

// Test Types
export interface GenerateTestRequest {
    skillName: string;
}

export interface QuestionDto {
    questionId: number;
    questionText: string;
    options: string[];
}

export interface TestResponse {
    testId: number;
    skillName: string;
    totalQuestions: number;
    passingScore: number;
    questions?: QuestionDto[];
    expiresAt: number;
    testStatus: string;
}

export interface SubmitTestRequest {
    testId: number;
    answers: { questionId: number; selectedOptionIndex: number }[];
}

export interface QuestionResult {
    questionId: number;
    questionText: string;
    userAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    explanation?: string;
}

export interface TestResultResponse {
    testId: number;
    skillName: string;
    score: number;
    totalQuestions: number;
    passingScore: number;
    isPassed: boolean;
    questionResults?: QuestionResult[];
}

// Session Types
export interface SessionDto {
    sessionId: number;
    skillName: string;
    status: 'REQUESTED' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    partnerId: number;
    partnerName: string;
    role: 'TEACHER' | 'LEARNER' | 'PEER';
    createdAt: string;
    scheduledTime?: string;
}
