import React from 'react';
import { Card as MuiCard, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.cardRadius || 16,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
}));

const CardHeaderGradient = styled(Box)(({ theme }) => ({
  background: theme.palette.gradients?.primary || 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
  padding: theme.spacing(2, 3),
  color: 'white'
}));

const Card = ({
  title,
  subtitle,
  action,
  children,
  headerVariant = 'h6',
  contentPadding = 3,
  headerGradient = true,
  ...props
}) => {
  return (
    <StyledCard {...props}>
      {title && (
        headerGradient ? (
          <CardHeaderGradient>
            <Typography variant={headerVariant} fontWeight="600" color="white">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                {subtitle}
              </Typography>
            )}
          </CardHeaderGradient>
        ) : (
          <CardHeader
            title={title}
            subheader={subtitle}
            action={action}
            titleTypographyProps={{
              variant: headerVariant,
              fontWeight: 600,
              color: 'text.primary'
            }}
            subheaderTypographyProps={{
              variant: 'body2',
              color: 'text.secondary'
            }}
          />
        )
      )}
      <CardContent sx={{ p: contentPadding }}>
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default Card;
