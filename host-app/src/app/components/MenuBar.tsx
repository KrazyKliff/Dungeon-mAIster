import React from 'react';
import styled from '@emotion/styled';
import { darkTheme } from '@dungeon-maister/ui-shared';

const MenuBarRoot = styled.div`
  display: flex;
  gap: ${darkTheme.spacing(2)};
  padding: ${darkTheme.spacing(1)};
  background-color: ${darkTheme.colors.surface};
  border-bottom: 1px solid ${darkTheme.colors.primary};
`;

const MenuButton = styled.button`
  background: none;
  border: 1px solid ${darkTheme.colors.accent};
  color: ${darkTheme.colors.accent};
  padding: ${darkTheme.spacing(1)} ${darkTheme.spacing(2)};
  font-family: ${darkTheme.typography.fontFamily.heading};
  cursor: pointer;

  &:hover {
    background-color: ${darkTheme.colors.accent};
    color: ${darkTheme.colors.background};
  }
`;

export const MenuBar = () => {
  return (
    <MenuBarRoot>
      <MenuButton>Game</MenuButton>
      <MenuButton>Settings</MenuButton>
      <MenuButton>Help</MenuButton>
    </MenuBarRoot>
  );
};
