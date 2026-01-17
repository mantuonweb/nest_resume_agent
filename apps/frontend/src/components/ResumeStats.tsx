import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface ResumeStatsProps {
  refreshTrigger: number;
}

export function ResumeStats({ refreshTrigger }: ResumeStatsProps) {
  const [pendingCount, setPendingCount] = useState<string>('');
  const [agentHealth, setAgentHealth] = useState<'ok' | 'error' | 'loading'>('loading');

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      const [countResult, healthResult] = await Promise.all([
        apiClient.countResumes(),
        apiClient.checkAgentHealth(),
      ]);

      setPendingCount(countResult.message);
      setAgentHealth(healthResult.status === 'ok' ? 'ok' : 'error');
    } catch (error) {
      setAgentHealth('error');
    }
  };

  return (
    <div className="resume-stats">
      <div className="stat-card">
        <h4>📊 Pending Resumes</h4>
        <p>{pendingCount || 'Loading...'}</p>
      </div>
      <div className="stat-card">
        <h4>🏥 Agent Status</h4>
        <p className={`status-${agentHealth}`}>
          {agentHealth === 'ok' ? '✅ Healthy' : agentHealth === 'error' ? '❌ Error' : '⏳ Loading'}
        </p>
      </div>
    </div>
  );
}