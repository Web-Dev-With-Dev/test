import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  LayoutDashboard as DashboardIcon,
  Users as UsersIcon,
  FileText as FilesIcon,
  BarChart2 as ChartsIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  X as CloseIcon
} from 'lucide-react';

const sidebarItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/admin' },
  { text: 'Users', icon: UsersIcon, path: '/admin/users' },
  { text: 'Files', icon: FilesIcon, path: '/admin/files' },
  { text: 'Charts', icon: ChartsIcon, path: '/admin/charts' },
  { text: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
];

const drawerWidth = 240;

export default function AdminSidebar({ open, onClose, isMobile }) {
  const theme = useTheme();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)',
        color: 'white',
      }}
    >
      {/* Logo / Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <DashboardIcon size={20} color="white" />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          Excel Analytics
        </Typography>
        {isMobile && (
          <Box sx={{ ml: 'auto' }} onClick={onClose}>
            <CloseIcon size={20} />
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mt: 1, mb: 2 }} />

      {/* Navigation Items */}
      <List sx={{ px: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <item.icon size={20} />
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.9375rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
          sx={{
            borderRadius: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9375rem'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
}