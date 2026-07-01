import React from 'react';
import { Terminal, Settings, UploadCloud, MessageSquare } from 'lucide-react';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Sidebar - ultra minimal */}
      <nav style={{
        width: '60px',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        gap: '28px'
      }}>
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
          <Terminal size={22} color="var(--text-primary)" />
        </div>
        
        {/* Navigation Icons */}
        <UploadCloud size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        <MessageSquare size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        
        <div style={{ flex: 1 }} />
        <Settings size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
      </nav>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          fontFamily: 'var(--font-tech)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.5px'
        }}>
          RAG_ENGINE v1.0.0
        </header>

        {/* Content Area (Placeholder for upload and chat) */}
        <div style={{ 
          flex: 1, 
          padding: '24px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'var(--bg-color)' 
        }}>
           <span style={{ 
             color: 'var(--text-secondary)', 
             fontFamily: 'var(--font-tech)',
             fontSize: '13px' 
           }}>
             // SYSTEM READY
           </span>
        </div>

      </main>
    </div>
  );
}
