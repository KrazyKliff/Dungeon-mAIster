import React from 'react';
import styled from '@emotion/styled';
import { darkTheme } from '@dungeon-maister/ui-shared';

const LogEntry = styled.p`
  margin: 0 0 ${darkTheme.spacing(1)} 0;
  font-size: ${darkTheme.typography.fontSize.small};
  color: ${darkTheme.colors.text}
`;

export const TechnicalLog = () => {
  return (
    <div>
      <h3 style={{ fontFamily: darkTheme.typography.fontFamily.heading }}>Action Log</h3>
      {/* Mock data */}
      <LogEntry>Player attacks Goblin for 5 damage.</LogEntry>
      <LogEntry>Goblin misses Player.</LogEntry>
      <LogEntry>Player moves to (12, 34).</LogEntry>
    </div>
  );
};
