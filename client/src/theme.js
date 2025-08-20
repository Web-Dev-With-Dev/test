import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: '#7C3AED' }, // Purple
    secondary: { main: '#3B82F6' }, // Blue
    background: { 
      default: 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)',
      paper: '#FFFFFF'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #60A5FA 100%)'
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700
    },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiButton: { 
      styleOverrides: { 
        root: {
          borderRadius: 8,
          background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
          color: 'white',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }
      } 
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED',
              boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.2)'
            }
          }
        }
      }
    }
  }
});

export default theme;
