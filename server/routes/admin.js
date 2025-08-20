const express = require('express');
const router = express.Router();
const { getUserLogs, getFileHistory } = require('../utils/logUtils');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const DataSet = require('../models/DataSet');
const UserLog = require('../models/UserLog');
const FileHistory = require('../models/FileHistory');

// GET /api/admin/users - Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Similarly update all other GET routes to use .lean()
// PUT /api/admin/users/:id - Update user
// Add this near the top of the file
const { 
  emitUserUpdate, 
  emitFileUpdate, 
  emitChartUpdate, 
  emitLogUpdate, 
  emitContactUpdate, 
  emitStatsUpdate,
  getUpdatedStats
} = require('../utils/socketUtils');

// Then in each route handler, add the appropriate emit after successful operations
// For example, in the PUT /users/:id route:
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    ).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    emitUserUpdate(io, 'update', user);
    
    // Also emit stats update if this affects user count
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Emit stats update after user deletion
    const io = req.app.get('io');
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Emit stats update after role change
    const io = req.app.get('io');
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// GET /api/admin/files - Get all uploaded files
router.get('/files', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const files = await DataSet.find().populate('uploadedBy', 'name email').sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

// GET /api/admin/files/:id/download - Download file
router.get('/files/:id/download', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const file = await DataSet.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // For now, just return file info. In a real app, you'd serve the actual file
    res.json({
      filename: file.filename,
      originalName: file.originalName,
      size: file.size
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// DELETE /api/admin/files/:id - Delete file
router.delete('/files/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const file = await DataSet.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Emit stats update after file deletion
    const io = req.app.get('io');
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// GET /api/admin/charts - Get all charts
router.get('/charts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const charts = await DataSet.find({ chartType: { $exists: true } })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(charts);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ message: 'Failed to fetch charts' });
  }
});

// GET /api/admin/charts/:id/preview - Get chart preview data
router.get('/charts/:id/preview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const chart = await DataSet.findById(req.params.id);
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    // Return mock chart data for preview
    res.json({
      type: chart.chartType || 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 3, 5, 2],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {},
      title: chart.filename || 'Chart Preview',
      xAxis: chart.xAxis || 'X Axis',
      yAxis: chart.yAxis || 'Y Axis'
    });
  } catch (error) {
    console.error('Error fetching chart preview:', error);
    res.status(500).json({ message: 'Failed to fetch chart preview' });
  }
});

// DELETE /api/admin/charts/:id - Delete chart
router.delete('/charts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const chart = await DataSet.findByIdAndDelete(req.params.id);
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    // Emit stats update after chart deletion
    const io = req.app.get('io');
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    console.error('Error deleting chart:', error);
    res.status(500).json({ message: 'Failed to delete chart' });
  }
});

// GET /api/admin/contacts - Get all contact messages
router.get('/contacts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // For now, return empty array since we don't have a Contact model yet
    // In a real app, you'd fetch from Contact model
    res.json([]);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// DELETE /api/admin/contacts/:id - Delete contact message
router.delete('/contacts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // For now, just return success since we don't have a Contact model yet
    // Note: When Contact model is implemented, add stats emission here
    
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact message' });
  }
});

// GET /api/admin/logs - Get user activity logs
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, userId } = req.query;
    const result = await getUserLogs(parseInt(page), parseInt(limit), userId);
    
    res.json({
      success: true,
      data: result.logs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user logs' 
    });
  }
});

// GET /api/admin/files/history - Get file upload history
router.get('/files/history', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, uploadedBy } = req.query;
    const result = await getFileHistory(parseInt(page), parseInt(limit), uploadedBy);
    
    res.json({
      success: true,
      data: result.history,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching file history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch file history' 
    });
  }
});

// GET /api/admin/stats - Get comprehensive admin statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [users, files, charts, logs, todaysUploads, todaysLogs] = await Promise.all([
      User.countDocuments().lean(),
      DataSet.countDocuments().lean(),
      DataSet.countDocuments({ chartType: { $exists: true } }).lean(),
      UserLog.countDocuments().lean(),
      DataSet.countDocuments({ createdAt: { $gte: today } }).lean(),
      UserLog.countDocuments({ createdAt: { $gte: today } }).lean()
    ]);
    
    res.json({ users, files, charts, logs, todaysUploads, todaysLogs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// GET /api/admin/logs/stats - Get log statistics (keeping for backward compatibility)
router.get('/logs/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const UserLog = require('../models/UserLog');
    const FileHistory = require('../models/FileHistory');
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get statistics
    const todayLogs = await UserLog.countDocuments({ 
      timestamp: { $gte: today } 
    });
    
    const totalLogs = await UserLog.countDocuments();
    
    const todayUploads = await FileHistory.countDocuments({ 
      uploadedAt: { $gte: today } 
    });
    
    const totalUploads = await FileHistory.countDocuments();
    
    res.json({
      success: true,
      data: {
        todayLogs,
        totalLogs,
        todayUploads,
        totalUploads
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    });
  }
});

// Add this new route after the existing user routes

// PATCH /api/admin/users/:id/status - Update user status
router.patch('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    emitUserUpdate(io, 'status', user);
    
    // Also emit stats update
    if (io) {
      const UserLog = require('../models/UserLog');
      const FileHistory = require('../models/FileHistory');
      
      const updatedStats = await getUpdatedStats(User, DataSet, UserLog, FileHistory);
      emitStatsUpdate(io, updatedStats);
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

module.exports = router;