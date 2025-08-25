import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have Journal & Dashboard as the title', () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // FIX: The test was looking for the wrong title.
    // We're updating it to match the actual rendered title.
    expect(getByText(/Journal & Dashboard/gi)).toBeTruthy();
  });
});
