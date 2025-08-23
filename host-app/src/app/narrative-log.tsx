import React from 'react';
import { GameMessage } from '@dungeon-maister/data-models';

interface NarrativeLogProps {
  messages: GameMessage[];
}

export const NarrativeLog: React.FC<NarrativeLogProps> = ({ messages }) => {
  const getStyleForMessage = (message: GameMessage) => {
    switch (message.type) {
      case 'narrative':
        return { fontStyle: 'italic', color: '#ccc' };
      case 'dialogue':
        return { fontWeight: 'bold' };
      case 'action':
        return { color: '#888' };
      default:
        return {};
    }
  };

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
      {messages.map((msg, index) => (
        <li key={index} style={{ marginTop: '12px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
          {msg.author && <strong style={getStyleForMessage(msg)}>{msg.author}: </strong>}
          <span style={getStyleForMessage(msg)}>{msg.content}</span>
        </li>
      ))}
    </ul>
  );
};
