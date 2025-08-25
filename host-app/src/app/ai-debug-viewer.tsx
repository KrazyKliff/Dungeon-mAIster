import React from 'react';

interface AIDebugViewerProps {
  lastResponse: { type: string; response: string } | null;
  onClose: () => void;
}

export const AIDebugViewer: React.FC<AIDebugViewerProps> = ({ lastResponse, onClose }) => {
  const viewerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    width: 'calc(100% - 20px)',
    maxHeight: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid #555',
    borderRadius: '8px',
    color: '#0f0',
    fontFamily: 'monospace',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={viewerStyle}>
      <div style={{ padding: '8px', backgroundColor: '#333', display: 'flex', justifyContent: 'space-between' }}>
        <span>AI Debug Viewer</span>
        <button onClick={onClose} style={{ color: '#0f0', background: 'none', border: 'none', cursor: 'pointer' }}>[X]</button>
      </div>
      <pre style={{ padding: '8px', margin: 0, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
        {lastResponse ? `Type: ${lastResponse.type}\n\nResponse:\n${lastResponse.response}` : 'Waiting for AI response...'}
      </pre>
    </div>
  );
};
