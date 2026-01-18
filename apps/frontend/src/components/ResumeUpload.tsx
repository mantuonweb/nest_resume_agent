import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';

interface ResumeUploadProps {
  onUploadSuccess: () => void;
}

export function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setMessage(null);
  };

  const handleSingleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    try {
      const result = await apiClient.uploadResume(files[0]);
      setMessage({ type: 'success', text: result.message });
      setFiles(null);
      onUploadSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    try {
      const result = await apiClient.uploadMultipleResumes(Array.from(files));
      setMessage({
        type: 'success',
        text: `${result.count} files uploaded successfully`,
      });
      setFiles(null);
      onUploadSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleIngest = async () => {
    setUploading(true);
    setMessage(null);

    try {
      const result = await apiClient.ingestResumes();
      setMessage({ type: 'success', text: result.message });
      onUploadSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Ingestion failed',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-upload">
      <h2>📤 Upload Resumes</h2>

      <div className="upload-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".pdf,.txt"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {files && files.length > 0
              ? `${files.length} file(s) selected`
              : '📁 Choose PDF or TXT files'}
          </label>
        </div>

        {files && files.length > 0 && (
          <div className="file-list">
            <h3>Selected Files:</h3>
            <ul>
              {Array.from(files).map((file, idx) => (
                <li key={idx}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="upload-buttons">
          <button
            onClick={handleSingleUpload}
            disabled={!files || files.length === 0 || uploading}
            className="btn-primary"
          >
            Upload Single File
          </button>
          <button
            onClick={handleMultipleUpload}
            disabled={!files || files.length === 0 || uploading}
            className="btn-primary"
          >
            Upload Multiple Files
          </button>
        </div>
      </div>

      <div className="ingest-section">
        <h3>🔄 Process Uploaded Resumes</h3>
        <p>
          Ingest all resumes from the ./resumes folder into the vector database
        </p>
        <button
          onClick={handleIngest}
          disabled={uploading}
          className="btn-secondary"
        >
          {uploading ? 'Processing...' : 'Ingest Resumes'}
        </button>
      </div>

      {message && (
        <div className={`message-box ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}
