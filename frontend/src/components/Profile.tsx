import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import type { UserProfile } from '../types';
import './Profile.css';

export const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.get();
            setProfile(data);
            setFormData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await profileService.update(formData);
            await loadProfile();
            setIsEditing(false);
        } catch (err: any) {
            alert(`Error updating profile: ${err.message}`);
        }
    };

    if (loading) return <div className="loading-spinner">Loading Profile...</div>;
    // Mock profile for demo if fetch fails (since no auth)
    const displayProfile = profile || {
        firstName: 'Alex',
        lastName: 'Dev',
        email: 'alex@example.com',
        bio: 'Passionate developer learning AI and teaching React.',
        location: 'San Francisco, CA',
        timezone: 'PST',
        hoursPerWeek: 15,
        learningGoal: 'CAREER_SWITCH',
        profileCompletenessScore: 85,
        skillsToLearn: 'Machine Learning, Python',
        linkedinUrl: 'linkedin.com/in/alexdev',
        githubUrl: 'github.com/alexdev',
        skillLevels: []
    };

    return (
        <div className="profile-page">
            <div className="profile-header glass-panel">
                <div className="profile-cover"></div>
                <div className="profile-info-container">
                    <div className="profile-avatar">
                        {displayProfile.firstName?.charAt(0)}
                    </div>
                    <div className="profile-text">
                        <h2>{displayProfile.firstName} {displayProfile.lastName}</h2>
                        <p className="profile-bio">{displayProfile.bio}</p>
                        <div className="profile-meta">
                            <span>📍 {displayProfile.location || 'Remote'}</span>
                            <span>🕐 {displayProfile.timezone || 'UTC'}</span>
                            <span>💼 {displayProfile.learningGoal || 'Learning'}</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button
                            className={`btn-primary ${isEditing ? 'btn-danger' : ''}`}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="completeness-bar">
                    <div className="bar-label">
                        <span>Profile Completeness</span>
                        <span>{displayProfile.profileCompletenessScore}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${displayProfile.profileCompletenessScore}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <div className="edit-section glass-panel slide-up">
                    <h3>Edit Profile Details</h3>
                    <form onSubmit={handleSave} className="edit-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    value={formData.firstName || ''}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    value={formData.lastName || ''}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={formData.bio || ''}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Skills to Learn</label>
                                <input
                                    value={formData.skillsToLearn || ''}
                                    onChange={e => setFormData({ ...formData, skillsToLearn: e.target.value })}
                                    placeholder="Comma separated"
                                />
                            </div>
                            <div className="form-group">
                                <label>Hours Per Week</label>
                                <input
                                    type="number"
                                    value={formData.hoursPerWeek || 0}
                                    onChange={e => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Learning Goal</label>
                            <select
                                value={formData.learningGoal || 'JOB_PREP'}
                                onChange={e => setFormData({ ...formData, learningGoal: e.target.value })}
                            >
                                <option value="JOB_PREP">Job Preparation</option>
                                <option value="CAREER_SWITCH">Career Switch</option>
                                <option value="HOBBY">Hobby / Fun</option>
                                <option value="ACADEMIC">Academic</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary">Save Changes</button>
                    </form>
                </div>
            ) : (
                <div className="profile-details-grid">
                    <div className="detail-card glass-panel">
                        <h3>About Me</h3>
                        <div className="detail-row">
                            <label>Learning Goal</label>
                            <p>{displayProfile.learningGoal?.replace('_', ' ')}</p>
                        </div>
                        <div className="detail-row">
                            <label>Weekly Availability</label>
                            <p>{displayProfile.hoursPerWeek} hours</p>
                        </div>
                        <div className="detail-row">
                            <label>Socials</label>
                            <div className="social-links">
                                {displayProfile.linkedinUrl && <a href={`https://${displayProfile.linkedinUrl}`} target="_blank">LinkedIn</a>}
                                {displayProfile.githubUrl && <a href={`https://${displayProfile.githubUrl}`} target="_blank">GitHub</a>}
                            </div>
                        </div>
                    </div>

                    <div className="detail-card glass-panel">
                        <h3>Learning Interests</h3>
                        <div className="tags-container">
                            {displayProfile.skillsToLearn?.split(',').map((skill: string, i: number) => (
                                <span key={i} className="skill-tag">{skill.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
