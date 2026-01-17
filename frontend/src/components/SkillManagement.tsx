import React, { useState, useEffect } from 'react';
import { skillLevelService } from '../services/skillLevelService';
import type { SkillLevel, ProficiencyLevel } from '../types';
import './SkillManagement.css';

export const SkillManagement: React.FC = () => {
    const [skills, setSkills] = useState<SkillLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState<SkillLevel | null>(null);

    // Form state
    const [formData, setFormData] = useState<Omit<SkillLevel, 'id'>>({
        skillName: '',
        proficiencyLevel: 'BEGINNER',
        yearsOfExperience: 0,
        selfRating: 3,
        projectsCompleted: 0,
        lastUsedDate: new Date().toISOString().split('T')[0],
        willingToTeach: true,
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            const data = await skillLevelService.getAll();
            setSkills(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingSkill(null);
        setFormData({
            skillName: '',
            proficiencyLevel: 'BEGINNER',
            yearsOfExperience: 0,
            selfRating: 3,
            projectsCompleted: 0,
            lastUsedDate: new Date().toISOString().split('T')[0],
            willingToTeach: true,
        });
        setShowModal(true);
    };

    const handleEdit = (skill: SkillLevel) => {
        setEditingSkill(skill);
        setFormData({
            skillName: skill.skillName,
            proficiencyLevel: skill.proficiencyLevel,
            yearsOfExperience: skill.yearsOfExperience || 0,
            selfRating: skill.selfRating || 3,
            projectsCompleted: skill.projectsCompleted || 0,
            lastUsedDate: skill.lastUsedDate || new Date().toISOString().split('T')[0],
            willingToTeach: skill.willingToTeach,
        });
        setShowModal(true);
    };

    const handleDelete = async (skillName: string) => {
        if (!confirm(`Delete ${skillName}?`)) return;

        try {
            await skillLevelService.delete(skillName);
            await loadSkills();
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await skillLevelService.addOrUpdate(formData);
            setShowModal(false);
            await loadSkills();
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const getProficiencyBadge = (level: ProficiencyLevel) => {
        const colors = {
            BEGINNER: 'badge-beginner',
            INTERMEDIATE: 'badge-intermediate',
            ADVANCED: 'badge-advanced',
            EXPERT: 'badge-expert',
        };
        return colors[level];
    };

    if (loading) return <div className="loading">Loading skills...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="skill-management">
            <div className="header">
                <h2>My Skills</h2>
                <button onClick={handleAdd} className="btn-primary">+ Add Skill</button>
            </div>

            {skills.length === 0 ? (
                <div className="empty-state">
                    <p>No skills added yet. Add your first skill to get started!</p>
                </div>
            ) : (
                <div className="skills-list">
                    {skills.map((skill) => (
                        <div key={skill.id} className="skill-card">
                            <div className="skill-header">
                                <h3>{skill.skillName}</h3>
                                <span className={`badge ${getProficiencyBadge(skill.proficiencyLevel)}`}>
                                    {skill.proficiencyLevel}
                                </span>
                            </div>

                            <div className="skill-details">
                                {skill.yearsOfExperience && (
                                    <div className="detail-item">
                                        <span className="icon">📅</span>
                                        {skill.yearsOfExperience} years experience
                                    </div>
                                )}
                                {skill.selfRating && (
                                    <div className="detail-item">
                                        <span className="icon">⭐</span>
                                        Self-rating: {'⭐'.repeat(skill.selfRating)}
                                    </div>
                                )}
                                {skill.projectsCompleted && (
                                    <div className="detail-item">
                                        <span className="icon">🚀</span>
                                        {skill.projectsCompleted} projects completed
                                    </div>
                                )}
                                <div className="detail-item">
                                    {skill.willingToTeach ? (
                                        <span className="teach-badge">✅ Willing to teach</span>
                                    ) : (
                                        <span className="no-teach-badge">⚠️ Not teaching yet</span>
                                    )}
                                </div>
                            </div>

                            <div className="skill-actions">
                                <button onClick={() => handleEdit(skill)} className="btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(skill.skillName)} className="btn-danger">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="skill-form">
                            <div className="form-group">
                                <label>Skill Name *</label>
                                <input
                                    type="text"
                                    value={formData.skillName}
                                    onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                                    placeholder="e.g., Spring Boot, Java, Python"
                                    required
                                    disabled={!!editingSkill}
                                />
                            </div>

                            <div className="form-group">
                                <label>Proficiency Level *</label>
                                <select
                                    value={formData.proficiencyLevel}
                                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value as ProficiencyLevel })}
                                    required
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Self Rating (1-5)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.selfRating}
                                        onChange={(e) => setFormData({ ...formData, selfRating: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Projects Completed</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.projectsCompleted}
                                    onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Used Date</label>
                                <input
                                    type="date"
                                    value={formData.lastUsedDate}
                                    onChange={(e) => setFormData({ ...formData, lastUsedDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.willingToTeach}
                                        onChange={(e) => setFormData({ ...formData, willingToTeach: e.target.checked })}
                                    />
                                    Willing to teach this skill
                                </label>
                                {formData.willingToTeach && (
                                    <p className="warning-text">
                                        ⚠️ You must pass a test (score ≥ 10/15) before you can teach this skill
                                    </p>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingSkill ? 'Update' : 'Add'} Skill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
