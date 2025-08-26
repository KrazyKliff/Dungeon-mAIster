import styled from '@emotion/styled';
import { darkTheme } from '@dungeon-maister/ui-shared';

export const HostLayoutRoot = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${darkTheme.colors.background};
  color: ${darkTheme.colors.text};
  font-family: ${darkTheme.typography.fontFamily.body};
`;

export const LeftPanel = styled.div`
  flex: 0 0 25%;
  border-right: 1px solid ${darkTheme.colors.surface};
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${darkTheme.spacing(2)};
`;

export const GmScreenContainer = styled.div`
  flex: 3; /* 75% of the left panel */
  overflow-y: auto;
  padding: ${darkTheme.spacing(2)};
  display: flex;
  flex-direction: column;
`;

export const TechnicalLogContainer = styled.div`
  flex: 1; /* 25% of the left panel */
  border-top: 1px solid ${darkTheme.colors.surface};
  overflow-y: auto;
  padding: ${darkTheme.spacing(2)};
`;
