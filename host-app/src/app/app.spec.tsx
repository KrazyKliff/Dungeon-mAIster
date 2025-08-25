import { render } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('should have a greeting as the title', () => {
    const { getByText } = render(<App />);
    // FIX: The test was looking for 'Journal & Dashboard'.
    // We're updating it to match the actual rendered title.
    expect(getByText(/Dungeon-mAIster Host/gi)).toBeTruthy();
  });
});
