import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  InputBase, 
  Badge, 
  Menu, 
  MenuItem, 
  Avatar, 
  Box, 
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  Bell as NotificationsIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  User as UserIcon
} from 'lucide-react';

const AdminNavbar = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // Show success message
    // toast.success('Logged out successfully');
    
    // Navigate to login page
    // navigate('/login');
    console.log('Logout clicked');
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: 64 }}>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2,
            color: 'text.primary',
            display: { md: 'none' }
          }}
        >
          <MenuIcon size={24} />
        </IconButton>

        {/* Logo / Title - Hidden on mobile when search is open */}
        {!mobileSearchOpen && (
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/admin"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              textDecoration: 'none',
              color: 'primary.main',
              background: theme.palette.gradients?.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: 3,
            }}
          >
            Excel Analytics
          </Typography>
        )}

        {/* Search Bar - Hidden on mobile when search is closed */}
        {(!isMobile || mobileSearchOpen) && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.action.hover, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.15),
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
              display: 'flex',
              alignItems: 'center',
              maxWidth: 500,
            }}
          >
            <Box sx={{ padding: theme.spacing(0, 2) }}>
              <SearchIcon size={20} color={theme.palette.text.secondary} />
            </Box>
            <InputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'text.primary',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(1)})`,
                  transition: theme.transitions.create('width'),
                  [theme.breakpoints.up('md')]: {
                    width: '20ch',
                    '&:focus': {
                      width: '30ch',
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Icon - Only shown on mobile when search is closed */}
          {isMobile && !mobileSearchOpen && (
            <IconButton 
              color="inherit"
              onClick={() => setMobileSearchOpen(true)}
              sx={{ mr: 1 }}
            >
              <SearchIcon size={20} />
            </IconButton>
          )}

          {/* Close Search Icon - Only shown on mobile when search is open */}
          {isMobile && mobileSearchOpen && (
            <IconButton 
              color="inherit"
              onClick={() => setMobileSearchOpen(false)}
              sx={{ mr: 1 }}
            >
              <Box component="span" sx={{ fontSize: 20 }}>×</Box>
            </IconButton>
          )}

          {/* Notifications */}
          <IconButton 
            color="inherit"
            sx={{ 
              p: 1,
              mr: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon size={20} />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton 
            color="inherit"
            component={RouterLink}
            to="/admin/settings"
            sx={{ 
              p: 1,
              mr: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <SettingsIcon size={20} />
          </IconButton>

          {/* User Profile */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              <UserIcon size={16} />
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" noWrap>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={RouterLink} to="/admin/profile">
          <UserIcon size={16} style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/admin/settings">
          <SettingsIcon size={16} style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon size={16} style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AdminNavbar;