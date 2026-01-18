import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { ResumeStats } from './ResumeStats';

interface ResumeListProps {
  refreshTrigger: number;
  onRefresh: () => void;
}

export function ResumeList({ refreshTrigger, onRefresh }: ResumeListProps) {
  const [resumes, setResumes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadResumes();
  }, [refreshTrigger]);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const result = await apiClient.listResumes();
      const resumeList = result.message
        .split('\n')
        .filter((line: string) => line.match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
      setResumes(resumeList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load resumes' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to clear the entire database? This cannot be undone.',
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await apiClient.clearResumes();
      setMessage({ type: 'success', text: result.message });
      setResumes([]);
      onRefresh();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-list">
      <h2>📋 Resume Database Management</h2>

      <ResumeStats refreshTrigger={refreshTrigger} />

      <div className="database-section">
        <div className="section-header">
          <h3>Resumes in Database ({resumes.length})</h3>
          <button
            onClick={loadResumes}
            disabled={loading}
            className="btn-refresh"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : resumes.length === 0 ? (
          <p className="empty-state">
            No resumes in database yet. Upload and ingest some resumes to get
            started.
          </p>
        ) : (
          <ul className="resume-items">
            {resumes.map((resume, idx) => (
              <li key={idx} className="resume-item">
                📄 {resume}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <p>
          Clear all resumes from the vector database. This action cannot be
          undone.
        </p>
        <button
          onClick={handleClearDatabase}
          disabled={loading}
          className="btn-danger"
        >
          🗑️ Clear Database
        </button>
      </div>

      {message && (
        <div className={`message-box ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}
