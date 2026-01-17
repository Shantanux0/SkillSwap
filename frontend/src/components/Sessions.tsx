import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/sessionService';
import type { SessionDto } from '../types';
import './Sessions.css';

export const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<SessionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await sessionService.getMySessions();
            setSessions(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (sessionId: number, status: string) => {
        try {
            await sessionService.updateStatus(sessionId, status);
            loadSessions(); // Reload
        } catch (err: any) {
            alert("Failed to update status: " + err.message);
        }
    };

    // Sort sessions by date desc
    const sortedSessions = [...sessions].sort((a, b) => {
        // This assumes sessionDto has a date or scheduledTime logic.
        // Based on previous mocks, we had dates. The SessionDto has `scheduledTime`.
        // Let's use `createdAt` as fallback if scheduledTime is missing
        const dateA = new Date(a.scheduledTime || a.createdAt).getTime();
        const dateB = new Date(b.scheduledTime || b.createdAt).getTime();
        return dateB - dateA;
    });

    const filteredSessions = sortedSessions.filter(s => {
        if (filter === 'ALL') return true;
        if (filter === 'UPCOMING') return s.status === 'UPCOMING' || s.status === 'REQUESTED';
        if (filter === 'COMPLETED') return s.status === 'COMPLETED' || s.status === 'CANCELLED';
        return true;
    });

    if (loading) return <div className="loading-spinner">Loading Sessions...</div>;

    // Empty state
    if (sessions.length === 0) {
        return (
            <div className="sessions-page">
                <div className="empty-state glass-panel">
                    <h3>No Sessions Yet</h3>
                    <p>Go to Matching page to find partners and request sessions!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sessions-page">
            <div className="sessions-header">
                <h2>My Sessions</h2>
                <div className="filter-tabs">
                    <button
                        className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'UPCOMING' ? 'active' : ''}`}
                        onClick={() => setFilter('UPCOMING')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`filter-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="sessions-list">
                {filteredSessions.map(session => (
                    <div key={session.sessionId} className="session-card glass-panel">
                        <div className="date-badge">
                            <span className="month">
                                {new Date(session.scheduledTime || session.createdAt).toLocaleString('default', { month: 'short' })}
                            </span>
                            <span className="day">
                                {new Date(session.scheduledTime || session.createdAt).getDate()}
                            </span>
                        </div>

                        <div className="session-info">
                            <h3>{session.skillName}</h3>
                            <p className="partner">
                                {session.role === 'TEACHER' ? 'Teaching' : 'Learning from'} {session.partnerName}
                            </p>
                            <div className="time-info">
                                <span className={`status-badge ${session.status.toLowerCase()}`}>
                                    {session.status}
                                </span>
                                <span> • {session.role}</span>
                            </div>
                        </div>

                        <div className="session-actions">
                            {(session.status === 'REQUESTED' || session.status === 'UPCOMING') && (
                                <>
                                    <button
                                        className="btn-primary btn-sm"
                                        onClick={() => handleStatusUpdate(session.sessionId, 'COMPLETED')}
                                    >
                                        Mark Complete
                                    </button>
                                    <button
                                        className="btn-secondary btn-sm"
                                        onClick={() => handleStatusUpdate(session.sessionId, 'CANCELLED')}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
