import React from 'react';
import styled from '@emotion/styled';
import { darkTheme } from '@dungeon-maister/ui-shared';

const InfoBarRoot = styled.div`
  display: flex;
  justify-content: space-around;
  padding: ${darkTheme.spacing(1)};
  background-color: ${darkTheme.colors.primary};
  font-size: ${darkTheme.typography.fontSize.small};
`;

const InfoItem = styled.div`
  color: ${darkTheme.colors.text};
  span {
    color: ${darkTheme.colors.accent};
    font-weight: bold;
  }
`;

export const InfoBar = () => {
  return (
    <InfoBarRoot>
      <InfoItem>Location: <span>The Whispering Woods</span></InfoItem>
      <InfoItem>Time/Date: <span>Day 3, 14:00</span></InfoItem>
      <InfoItem>Active Quest: <span>The Lost Artifact</span></InfoItem>
      <InfoItem>Environment: <span>Clear, Mild</span></InfoItem>
    </InfoBarRoot>
  );
};
