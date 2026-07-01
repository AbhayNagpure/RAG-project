import React from 'react';
import { Terminal, Settings, MessageSquare } from 'lucide-react';
import UploadZone from './components/UploadZone.jsx';
import ChatInterface from './components/ChatInterface.jsx';

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
        <div style={{ cursor: 'pointer', opacity: 1 }}>
          <MessageSquare size={20} color="var(--text-primary)" />
        </div>
        
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

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex',
          backgroundColor: 'var(--bg-color)',
          overflow: 'hidden'
        }}>
           
           {/* Center Chat Area */}
           <div style={{ flex: 1 }}>
             <ChatInterface />
           </div>

           {/* Right Panel for Knowledge Base / Upload */}
           <div style={{ 
             width: '320px', 
             borderLeft: '1px solid var(--border-color)',
             backgroundColor: 'var(--surface-color)',
             display: 'flex',
             flexDirection: 'column'
           }}>
             <div style={{
               padding: '16px 20px',
               borderBottom: '1px solid var(--border-color)',
               fontFamily: 'var(--font-tech)',
               fontSize: '11px',
               color: 'var(--text-secondary)',
               letterSpacing: '0.5px'
             }}>
               // KNOWLEDGE BASE
             </div>
             <div style={{ padding: '20px' }}>
               <UploadZone />
             </div>
           </div>

        </div>

      </main>
    </div>
  );
}
