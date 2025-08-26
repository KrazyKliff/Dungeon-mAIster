export interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    danger: string;
    success: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    fontSize: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  };
  spacing: (factor: number) => string;
}

export const darkTheme: Theme = {
  colors: {
    primary: '#1a1a1a', // Near black for primary elements
    background: '#0d0d0d', // Deepest black for background
    surface: '#2c2c2c', // Dark grey for cards, panels
    text: '#e0e0e0', // Light grey for readability
    accent: '#d4af37', // Muted, ancient gold for highlights
    danger: '#8b0000', // Deep, dark red
    success: '#3e8e41', // Muted green
  },
  typography: {
    fontFamily: {
      heading: '"Times New Roman", Times, serif', // A classic fantasy-esque serif font
      body: 'Georgia, serif',
    },
    fontSize: {
      small: '0.8rem',
      medium: '1rem',
      large: '1.5rem',
      xlarge: '2.5rem',
    },
  },
  spacing: (factor: number) => `${factor * 8}px`,
};
