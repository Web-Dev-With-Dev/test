import React from 'react';
import { Button as MuiButton, styled } from '@mui/material';

const StyledButton = styled(MuiButton)(({ theme, variant = 'contained', fullWidth }) => ({
  borderRadius: 8,
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  width: fullWidth ? '100%' : 'auto',
  
  ...(variant === 'contained' && {
    background: theme.palette.gradients?.primary || 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
    color: 'white',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      background: 'linear-gradient(135deg, #6D28D9 0%, #2563EB 100%)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  }),
  
  ...(variant === 'outlined' && {
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(124, 58, 237, 0.04)',
      borderWidth: '2px',
    },
  }),
  
  ...(variant === 'text' && {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(124, 58, 237, 0.04)',
    },
  }),
  
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  },
}));

const Button = ({
  children,
  startIcon: StartIcon,
  endIcon: EndIcon,
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      startIcon={StartIcon && <StartIcon />}
      endIcon={EndIcon && <EndIcon />}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

export default Button;
