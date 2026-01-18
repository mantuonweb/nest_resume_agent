import React, { useState } from 'react';
import { ResumeUpload } from './ResumeUpload';
import { ResumeList } from './ResumeList';
import { AgentChat } from './AgentChat';
import { ResumeStats } from './ResumeStats';
import './NestResumeAgent.css';

export function NestResumeAgent() {
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'manage'>(
    'chat',
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="nest-resume-agent">
      <header className="agent-header">
        <h1>Resume Management AI Agent</h1>
        <p>AI-powered resume management system with LangGraph agent</p>
      </header>

      <nav className="agent-nav">
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          💬 AI Chat
        </button>
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Resumes
        </button>
        <button
          className={activeTab === 'manage' ? 'active' : ''}
          onClick={() => setActiveTab('manage')}
        >
          📋 Manage Database
        </button>
      </nav>

      <main className="agent-content">
        {activeTab === 'chat' && <AgentChat />}
        {activeTab === 'upload' && (
          <ResumeUpload onUploadSuccess={handleRefresh} />
        )}
        {activeTab === 'manage' && (
          <ResumeList
            refreshTrigger={refreshTrigger}
            onRefresh={handleRefresh}
          />
        )}
      </main>
    </div>
  );
}
