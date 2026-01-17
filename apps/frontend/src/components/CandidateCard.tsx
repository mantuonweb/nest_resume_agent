import React, { useState } from 'react';

interface Candidate {
  name: string;
  skills: string[];
  experience: string;
  matchPercentage: number;
  whyGoodFit: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 70) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent Match';
    if (percentage >= 70) return 'Good Match';
    if (percentage >= 50) return 'Moderate Match';
    return 'Partial Match';
  };

  return (
    <div className="candidate-card">
      <div className="candidate-header">
        <div className="candidate-rank">#{rank}</div>
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <div className="match-badge" style={{ backgroundColor: getMatchColor(candidate.matchPercentage) }}>
            {candidate.matchPercentage}% - {getMatchLabel(candidate.matchPercentage)}
          </div>
        </div>
      </div>

      <div className="candidate-skills">
        <div className="skills-label">🎯 Skills:</div>
        <div className="skills-tags">
          {candidate.skills.map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {candidate.whyGoodFit && (
        <div className="candidate-fit">
          <button 
            className="expand-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▼' : '▶'} Why they're a good fit
          </button>
          {expanded && (
            <div className="fit-content">
              {candidate.whyGoodFit}
            </div>
          )}
        </div>
      )}

      <div className="candidate-actions">
        <button className="action-btn primary">📄 View Resume</button>
        <button className="action-btn secondary">📧 Contact</button>
      </div>
    </div>
  );
}