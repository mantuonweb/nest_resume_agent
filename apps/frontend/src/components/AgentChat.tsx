import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { CandidateCard } from './CandidateCard';

interface Message {
  role: 'user' | 'agent';
  content: string;
  steps?: any[];
  iterations?: number;
  timestamp: Date;
  candidates?: Candidate[];
}

interface Candidate {
  name: string;
  skills: string[];
  experience: string;
  matchPercentage: number;
  whyGoodFit: string;
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadId] = useState('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseCandidates = (content: string): Candidate[] | null => {
    const candidates: Candidate[] = [];
    
    // Check if response contains candidate information
    if (!content.includes('**') || !content.includes('Matching Percentage')) {
      return null;
    }

    // Split by numbered candidates
    const candidateSections = content.split(/\d+\.\s+\*\*/).filter(s => s.trim());

    candidateSections.forEach(section => {
      const nameMatch = section.match(/^([^*]+)\*\*/);
      const skillsMatch = section.match(/\*\*Relevant Skills:\*\*\s*([^\n]+)/);
      const fitMatch = section.match(/\*\*Why They Are a Good Fit:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
      const percentageMatch = section.match(/\*\*Matching Percentage:\*\*\s*(\d+)%/);

      if (nameMatch && skillsMatch) {
        candidates.push({
          name: nameMatch[1].trim(),
          skills: skillsMatch[1].split(',').map(s => s.trim()),
          experience: fitMatch ? fitMatch[1].trim() : '',
          matchPercentage: percentageMatch ? parseInt(percentageMatch[1]) : 0,
          whyGoodFit: fitMatch ? fitMatch[1].trim() : ''
        });
      }
    });

    return candidates.length > 0 ? candidates : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.queryAgent({
        query: input,
        threadId,
        maxIterations: 5,
      });

      const candidates = parseCandidates(response.output);

      const agentMessage: Message = {
        role: 'agent',
        content: response.output,
        steps: response.steps,
        iterations: response.iterations,
        timestamp: new Date(),
        candidates: candidates || undefined,
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'agent',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQueries = [
    'Find candidates with Python experience',
    'Show me candidates with machine learning skills',
    'List all resumes in the database',
    'Find full-stack developers',
    'Who has Google Cloud experience?',
    'Compare candidates with LangChain knowledge',
  ];

  return (
    <div className="agent-chat">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">A</div>
            <h2>Welcome to the Resume AI Agent</h2>
            <p>Ask me anything about your resume database!</p>
            <div className="suggested-queries">
              <p className="suggestion-title">💡 Try asking:</p>
              <div className="suggestion-grid">
                {suggestedQueries.map((query, idx) => (
                  <button
                    key={idx}
                    className="suggestion-chip"
                    onClick={() => setInput(query)}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? 'U' : 'A'}
            </div>
            <div className="message-bubble">
              <div className="message-header">
                <span className="message-role">
                  {msg.role === 'user' ? 'You' : 'AI Agent'}
                </span>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {msg.candidates ? (
                <div className="candidates-response">
                  <div className="response-summary">
                    Found {msg.candidates.length} matching candidate{msg.candidates.length !== 1 ? 's' : ''}
                  </div>
                  <div className="candidates-grid">
                    {msg.candidates.map((candidate, cidx) => (
                      <CandidateCard key={cidx} candidate={candidate} rank={cidx + 1} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
              
              {msg.iterations && (
                <div className="message-meta">
                  <span className="meta-badge">⚡ {msg.iterations} iterations</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-wrapper agent">
            <div className="message-avatar">A</div>
            <div className="message-bubble loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="loading-text">Analyzing resumes...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about candidates, skills, or resumes..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()} className="send-button">
          {loading ? '⏳' : '→'}
        </button>
      </form>
    </div>
  );
}