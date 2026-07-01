import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'System initialized. Ready for queries based on ingested documents.' }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userQuery = input.trim();
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setInput('');
    
    // Add a temporary loading message
    setMessages(prev => [...prev, { role: 'assistant', text: '// QUERYING KNOWLEDGE BASE...', isLoading: true }]);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuery })
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      
      // Replace the loading message with the real answer
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 ? { role: 'assistant', text: data.answer } : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 ? { role: 'assistant', text: '// ERROR: Failed to reach backend.' } : msg
      ));
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid var(--border-color)',
      borderRight: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-color)',
      margin: '0 auto'
    }}>
      {/* Message History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              textTransform: 'uppercase'
            }}>
              {msg.role === 'user' ? 'USER_INPUT' : 'SYS_RESPONSE'}
            </div>
            <div 
              className={msg.isLoading ? 'loading-pulse' : ''}
              style={{
              maxWidth: '85%',
              padding: msg.role === 'user' ? '12px 16px' : '0',
              backgroundColor: msg.role === 'user' ? 'var(--surface-color)' : 'transparent',
              border: msg.role === 'user' ? '1px solid var(--border-color)' : 'none',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              fontSize: '14px',
              fontFamily: msg.role === 'user' ? 'var(--font-main)' : 'var(--font-main)',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface-color)',
        display: 'flex',
        gap: '12px'
      }}>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Query the vectorized knowledge base..."
          style={{
            flex: 1,
            resize: 'none',
            height: '44px',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            padding: '12px 16px',
            fontFamily: 'var(--font-main)',
            color: 'var(--text-primary)'
          }}
        />
        <button 
          onClick={handleSend}
          style={{
            height: '44px',
            width: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-color)',
            padding: 0
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
