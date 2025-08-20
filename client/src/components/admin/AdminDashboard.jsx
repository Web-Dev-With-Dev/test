import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUploadRefresh } from '../../context/UploadRefreshContext';
import { useSocket } from '../../context/SocketContext';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import { 
  Users as UsersIcon, 
  FileText as FileIcon, 
  BarChart2 as ChartIcon, 
  Clock as ClockIcon,
  MessageSquare as MessageIcon,
  Activity as ActivityIcon
} from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

// Environment-based URL configuration
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const StatCard = ({ title, value, icon: Icon, color, onClick, link }) => {
  const theme = useTheme();
  
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            color: theme.palette.primary.main,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'rgba(124, 58, 237, 0.1)',
              mr: 2,
            }}
          >
            <Icon size={24} />
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
            {value}
          </Typography>
        </Box>
        <Link to={link} className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
          View details →
        </Link>
      </Box>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayLogs: 0,
    totalLogs: 0,
    todayUploads: 0,
    totalUploads: 0,
    totalUsers: 0,
    totalCharts: 0,
    totalFiles: 0
  });
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const { needsRefresh, setNeedsRefresh } = useUploadRefresh();
  const { socket, connected } = useSocket();

  // Auth headers helper
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Fetch stats when component mounts
  useEffect(() => {
    console.log(' AdminDashboard mounted - initial data fetch');
    fetchStats();
    
    // Set up auto-refresh every 30 seconds as fallback
    const intervalId = setInterval(() => {
      if (!socketConnected) {
        console.log(' Fallback polling triggered (socket disconnected)');
        fetchStats();
      }
    }, 30000); // 30 seconds interval
    
    // Clean up interval on component unmount
    return () => {
      console.log(' Cleaning up refresh interval');
      clearInterval(intervalId);
    };
  }, [socketConnected]);
  
  // Also fetch when needsRefresh changes to true (triggered by uploads/chart saves)
  useEffect(() => {
    if (needsRefresh) {
      console.log(' Manual refresh triggered by context update');
      fetchStats();
      setNeedsRefresh(false);
    }
  }, [needsRefresh, setNeedsRefresh]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for stats updates
    const handleStatsUpdate = (data) => {
      console.log(' Real-time stats update received:', data);
      if (data && data.data) {
        setStats(prevStats => ({
          ...prevStats,
          ...data.data
        }));
        toast.success('Dashboard updated in real-time!');
      }
    };

    // Listen for connection status
    const handleConnect = () => {
      console.log(' Socket connected');
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log(' Socket disconnected');
      setSocketConnected(false);
    };

    // Set up event listeners
    socket.on('stats-update', handleStatsUpdate);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial connection status
    setSocketConnected(connected);

    // Clean up event listeners
    return () => {
      socket.off('stats-update', handleStatsUpdate);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, connected]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Use the new comprehensive stats endpoint with BASE_URL
      const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, getAuthHeaders());
      
      // The new endpoint returns data directly without success/data wrapper
      setStats(statsResponse.data);
      console.log(' Dashboard stats updated successfully:', statsResponse.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error.response?.data || error.message);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
      </Box>

      {loading ? (
        <div className="flex justify-center py-12">
          <div>Loading...</div>
        </div>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Users"
              value={stats.totalUsers}
              icon={UsersIcon}
              link="/admin/users"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Files"
              value={stats.totalFiles}
              icon={FileIcon}
              link="/admin/files"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Charts"
              value={stats.totalCharts}
              icon={ChartIcon}
              link="/admin/charts"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Today's Uploads"
              value={stats.todayUploads}
              icon={ClockIcon}
              link="/admin/file-history"
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;