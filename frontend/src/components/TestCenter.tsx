import React, { useState, useEffect } from 'react';
import { testService } from '../services/testService';
import { authService } from '../services/authService';
import type { QuestionDto, TestResponse } from '../types';
import './TestCenter.css';

export const TestCenter: React.FC = () => {
    const [activeTest, setActiveTest] = useState<TestResponse | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ questionId: number; selectedOptionIndex: number }[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            setIsAuthenticated(isAuth);
        } catch (e) {
            setIsAuthenticated(false);
        }
    };

    const startTest = async (skillName: string) => {
        if (!isAuthenticated) {
            alert("Please login strictly required to take tests!");
            window.location.href = '/login';
            return;
        }

        try {
            setLoading(true);
            const test = await testService.generateTest(skillName);
            setActiveTest(test);
            setCurrentQuestion(0);
            setAnswers([]);
            setScore(null);
        } catch (err: any) {
            setError(err.message || 'Failed to generate test. Make sure you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: number, optionIndex: number) => {
        // Remove existing answer for this question if any
        const newAnswers = answers.filter(a => a.questionId !== questionId);
        // Add new answer
        newAnswers.push({ questionId, selectedOptionIndex: optionIndex });
        setAnswers(newAnswers);
    };

    const getSelectedAnswer = (questionId: number) => {
        const answer = answers.find(a => a.questionId === questionId);
        return answer ? answer.selectedOptionIndex : undefined;
    };

    const submitTest = async () => {
        if (!activeTest) return;

        try {
            setLoading(true);
            const result = await testService.submitTest({
                testId: activeTest.testId,
                answers
            });
            setScore(result.score);
            // Optionally show full results with explanations
        } catch (err: any) {
            alert('Failed to submit test: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading Test...</div>;
    if (error) return <div className="error-message">{error} <button onClick={() => setError(null)}>Go Back</button></div>;

    if (activeTest && activeTest.questions) {
        if (score !== null) {
            return (
                <div className="test-center">
                    <div className="test-card glass-panel result-card">
                        <h2>Test Complete</h2>
                        <div className="score-display">
                            <span className="score-number">{score}</span>
                            <span className="score-total">/ {activeTest.totalQuestions}</span>
                        </div>
                        <p className={score >= activeTest.passingScore ? 'success-text' : 'fail-text'}>
                            {score >= activeTest.passingScore ? '🎉 Passed! You can now teach this skill.' : '❌ Not Passed. Try again later.'}
                        </p>
                        <button onClick={() => setActiveTest(null)} className="btn-primary">Back to Tests</button>
                    </div>
                </div>
            );
        }

        const question = activeTest.questions[currentQuestion];
        const isLastQuestion = currentQuestion === activeTest.questions.length - 1;

        return (
            <div className="test-center">
                <div className="test-card glass-panel">
                    <div className="test-header">
                        <h3>{activeTest.skillName} Assessment</h3>
                        <span>Question {currentQuestion + 1} / {activeTest.questions.length}</span>
                    </div>

                    <div className="question-content">
                        <p className="question-text">{question.questionText}</p>
                        <div className="options-grid">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`option-btn ${getSelectedAnswer(question.questionId) === idx ? 'selected' : ''}`}
                                    onClick={() => handleAnswer(question.questionId, idx)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="test-footer">
                        {currentQuestion > 0 && (
                            <button
                                className="btn-secondary"
                                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                style={{ marginRight: 'auto' }}
                            >
                                Previous
                            </button>
                        )}

                        {!isLastQuestion ? (
                            <button
                                className="btn-secondary"
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            >
                                Next Question
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={submitTest}
                            >
                                Submit Test
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="test-center-dashboard">
            <h2>Skill Verification Center</h2>
            <p className="subtitle">Prove your expertise. Unlock teaching privileges.</p>

            <div className="tests-grid">
                {['Java', 'Spring Boot', 'Python', 'React', 'Data Structures'].map((skill) => (
                    <div key={skill} className="test-listing-card glass-panel">
                        <div className="listing-header">
                            <h3>{skill}</h3>
                            <span className="level-badge">Standard</span>
                        </div>
                        <div className="listing-details">
                            <span>⏱️ 15 mins</span>
                            <span>📝 15 Questions</span>
                        </div>
                        <p>Pass score: 10/15</p>
                        <button onClick={() => startTest(skill)} className="btn-primary btn-block">
                            Take Test
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
