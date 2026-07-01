import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadZone() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      console.log(data);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    }}>
      
      <div style={{ 
        width: '64px', 
        height: '64px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--bg-color)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid var(--border-color)'
      }}>
        {status === 'success' ? <CheckCircle color="#4ade80" /> : 
         status === 'error' ? <AlertCircle color="#f87171" /> : 
         <UploadCloud color="var(--text-secondary)" size={28} />}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
          {file ? file.name : "Select a PDF to vectorize"}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Only PDF files are supported"}
        </p>
      </div>

      {status === 'idle' && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{
            cursor: 'pointer',
            padding: '8px 16px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-tech)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-color)'
          }}>
            BROWSE FILES
            <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          
          {file && (
            <button onClick={handleUpload} style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-color)' }}>
              START INGESTION
            </button>
          )}
        </div>
      )}

      {status === 'uploading' && (
        <div style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          // EXTRACTING AND EMBEDDING...
        </div>
      )}
      
      {status === 'success' && (
        <div style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: '#4ade80' }}>
          // VECTORIZATION COMPLETE
        </div>
      )}
    </div>
  );
}
