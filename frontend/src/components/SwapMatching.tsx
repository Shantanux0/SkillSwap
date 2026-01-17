import React, { useState } from 'react';
import { matchService } from '../services/matchService';
import type { SwapMatch } from '../types';
import './SwapMatching.css';

export const SwapMatching: React.FC = () => {
    const [skillToLearn, setSkillToLearn] = useState('');
    const [skillToTeach, setSkillToTeach] = useState('');
    const [matches, setMatches] = useState<SwapMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<SwapMatch | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const results = await matchService.findSwapMatches(skillToLearn, skillToTeach);
            setMatches(results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getSwapBadge = (swapType: string) => {
        return swapType === 'PERFECT_SWAP'
            ? { text: '🟢 PERFECT SWAP', class: 'badge-perfect' }
            : { text: '🟡 PARTIAL MATCH', class: 'badge-partial' };
    };

    const formatScore = (score: number) => Math.round(score * 100);

    return (
        <div className="swap-matching">
            <div className="search-section">
                <h2>Find Your Perfect Skill Swap Partner</h2>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>I want to learn:</label>
                            <input
                                type="text"
                                value={skillToLearn}
                                onChange={(e) => setSkillToLearn(e.target.value)}
                                placeholder="e.g., Java, Python, React"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>I can teach:</label>
                            <input
                                type="text"
                                value={skillToTeach}
                                onChange={(e) => setSkillToTeach(e.target.value)}
                                placeholder="e.g., Spring Boot, Django"
                                required
                            />
                            <small className="hint">⚠️ Test required for this skill</small>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary btn-large" disabled={loading}>
                        {loading ? 'Searching...' : 'Find Matches'}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        <strong>Error:</strong> {error}
                        {error.includes('TEST') && (
                            <div className="error-action">
                                <a href="/tests" className="link-button">Take Test Now</a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {matches.length > 0 && (
                <div className="results-section">
                    <h3>{matches.length} Matches Found</h3>

                    <div className="matches-list">
                        {matches.map((match, index) => {
                            const badge = getSwapBadge(match.swapType);

                            return (
                                <div key={match.partnerId} className="match-card" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                                    <div className="match-body">
                                        <div className="partner-section">
                                            <div className="avatar">
                                                {match.profileImageUrl ? (
                                                    <img src={match.profileImageUrl} alt={match.partnerName} />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {match.partnerName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="info-content">
                                                <h4>{match.partnerName}</h4>
                                                <div className="meta-tags">
                                                    <span className="meta-tag">
                                                        📍 {match.location || 'Remote'}
                                                    </span>
                                                    <span className="meta-tag">
                                                        🕐 {match.timezone || 'UTC'}
                                                    </span>
                                                    {badge.text.includes('PERFECT') && (
                                                        <span className="meta-tag" style={{ color: 'var(--success)', background: '#ecfdf5' }}>
                                                            ✨ Perfect Swap
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {match.compatibilityReason?.split('!')[0]}...
                                                </p>
                                            </div>
                                        </div>

                                        <div className="match-score-container">
                                            <div className="score-circle" style={{ '--percent': `${formatScore(match.matchScore)}%` } as any}>
                                                <span className="score-value">{formatScore(match.matchScore)}<span style={{ fontSize: '0.9rem' }}>%</span></span>
                                            </div>
                                            <span className="score-label">Match Score</span>
                                        </div>
                                    </div>

                                    <div className="swap-card-footer">
                                        <div className="swap-exchange">
                                            <div className="swap-item">
                                                <span className="swap-label">You Learn</span>
                                                <span className="swap-skill">{match.skillILearn}</span>
                                            </div>
                                            <div className="swap-arrow">
                                                {match.mutualMatch ? '⟷' : '←'}
                                            </div>
                                            <div className="swap-item">
                                                <span className="swap-label">They Learn</span>
                                                <span className="swap-skill">{match.skillITeach}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedMatch(match)}
                                            className="action-btn btn-view"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Match Details Modal */}
            {selectedMatch && (
                <div className="modal-overlay" onClick={() => setSelectedMatch(null)}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedMatch.partnerName} - Match Details</h3>
                            <button onClick={() => setSelectedMatch(null)} className="close-btn">✕</button>
                        </div>

                        <div className="match-details-content">
                            <div className="details-section">
                                <h4>Compatibility Breakdown</h4>
                                <div className="score-bars">
                                    <div className="score-bar">
                                        <label>Skill Level Gap</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${formatScore(selectedMatch.skillLevelGapScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.skillLevelGapScore)}%</span>
                                    </div>

                                    <div className="score-bar">
                                        <label>Goal Alignment</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${formatScore(selectedMatch.goalAlignmentScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.goalAlignmentScore)}%</span>
                                    </div>

                                    <div className="score-bar">
                                        <label>Schedule Overlap</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${formatScore(selectedMatch.availabilityScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.availabilityScore)}%</span>
                                    </div>

                                    <div className="score-bar">
                                        <label>Learning Style</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${formatScore(selectedMatch.learningStyleScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.learningStyleScore)}%</span>
                                    </div>

                                    <div className="score-bar">
                                        <label>Their Test Score</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill bar-test"
                                                style={{ width: `${formatScore(selectedMatch.theirTestScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.theirTestScore)}%</span>
                                    </div>

                                    <div className="score-bar">
                                        <label>Their Reputation</label>
                                        <div className="bar">
                                            <div
                                                className="bar-fill bar-reputation"
                                                style={{ width: `${formatScore(selectedMatch.theirReputationScore)}%` }}
                                            />
                                        </div>
                                        <span>{formatScore(selectedMatch.theirReputationScore)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="details-section">
                                <h4>Partner Information</h4>
                                <p><strong>Bio:</strong> {selectedMatch.partnerBio || 'No bio available'}</p>
                                <p><strong>Skills:</strong> {selectedMatch.partnerSkills}</p>
                                <p><strong>Wants to learn:</strong> {selectedMatch.partnerSkillsToLearn}</p>
                                <p><strong>Availability:</strong> {selectedMatch.partnerHoursPerWeek || 'Not set'} hours/week</p>
                                <p><strong>Domain:</strong> {selectedMatch.partnerDomainFocus || 'Not specified'}</p>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-primary btn-large">
                                    Send Connection Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
