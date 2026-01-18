const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async uploadMultipleResumes(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/resume/upload-multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async ingestResumes() {
    const response = await fetch(`${API_BASE_URL}/resume/ingest`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Ingestion failed');
    return response.json();
  },

  async listResumes() {
    const response = await fetch(`${API_BASE_URL}/resume/list`);
    if (!response.ok) throw new Error('Failed to fetch resumes');
    return response.json();
  },

  async countResumes() {
    const response = await fetch(`${API_BASE_URL}/resume/count`);
    if (!response.ok) throw new Error('Failed to count resumes');
    return response.json();
  },

  async clearResumes() {
    const response = await fetch(`${API_BASE_URL}/resume/clear`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to clear database');
    return response.json();
  },

  async queryAgent(data: {
    query: string;
    threadId?: string;
    maxIterations?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/agent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Query failed');
    return response.json();
  },

  async checkAgentHealth() {
    const response = await fetch(`${API_BASE_URL}/agent/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },
};
