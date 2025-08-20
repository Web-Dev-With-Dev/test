const UserLog = require('../models/UserLog');
const FileHistory = require('../models/FileHistory');

/**
 * Log a user action
 * @param {string} userId - User ID
 * @param {string} action - Action performed
 * @param {string} details - Additional details
 */
const logAction = async (userId, action, details = '') => {
  try {
    await UserLog.create({ userId, action, details });
  } catch (error) {
    console.error('Error logging user action:', error);
  }
};

/**
 * Log file upload
 * @param {string} filename - Name of uploaded file
 * @param {string} uploadedBy - User ID who uploaded
 * @param {number} fileSize - Size of file in bytes
 * @param {string} chartType - Type of chart generated
 */
const logFileUpload = async (filename, uploadedBy, fileSize, chartType = 'unknown') => {
  try {
    await FileHistory.create({ 
      filename, 
      uploadedBy, 
      fileSize, 
      chartType 
    });
  } catch (error) {
    console.error('Error logging file upload:', error);
  }
};

/**
 * Get user activity logs with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} userId - Filter by user ID (optional)
 */
const getUserLogs = async (page = 1, limit = 50, userId = null) => {
  try {
    const skip = (page - 1) * limit;
    const query = userId ? { userId } : {};
    
    const logs = await UserLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await UserLog.countDocuments(query);
    
    return { logs, total, page, limit };
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
};

/**
 * Get file upload history with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} uploadedBy - Filter by user ID (optional)
 */
const getFileHistory = async (page = 1, limit = 50, uploadedBy = null) => {
  try {
    const skip = (page - 1) * limit;
    const query = uploadedBy ? { uploadedBy } : {};
    
    const history = await FileHistory.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await FileHistory.countDocuments(query);
    
    return { history, total, page, limit };
  } catch (error) {
    console.error('Error fetching file history:', error);
    throw error;
  }
};

module.exports = {
  logAction,
  logFileUpload,
  getUserLogs,
  getFileHistory
}; 