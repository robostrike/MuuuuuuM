import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#424242', // Changed to dark grey
    },
    secondary: {
      main: '#f0f0f0',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 14,
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0, // Extra small devices
      sm: 500, // Small devices
      md: 960, // Medium devices (regular size)
      lg: 1280, // Large devices
      xl: 1920, // Extra large devices
    },
  },
});

export default theme;