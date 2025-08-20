/**
 * Utility functions for Socket.io events
 */

// Emit event to all admin users
const emitAdminEvent = (io, event, data) => {
  io.to("admin-room").emit(event, data);
};

// Emit user update event
const emitUserUpdate = (io, action, userData) => {
  emitAdminEvent(io, "user-update", { action, data: userData });
};

// Emit file update event
const emitFileUpdate = (io, action, fileData) => {
  emitAdminEvent(io, "file-update", { action, data: fileData });
};

// Emit chart update event
const emitChartUpdate = (io, action, chartData) => {
  emitAdminEvent(io, "chart-update", { action, data: chartData });
};

// Emit log update event
const emitLogUpdate = (io, logData) => {
  emitAdminEvent(io, "log-update", { data: logData });
};

// Emit contact update event
const emitContactUpdate = (io, action, contactData) => {
  emitAdminEvent(io, "contact-update", { action, data: contactData });
};

// Helper function to get updated stats
const getUpdatedStats = async (User, DataSet, UserLog, FileHistory) => {
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
  
  return {
    users,
    files,
    charts,
    logs,
    todaysUploads,
    todaysLogs
  };
};

// Emit stats update event
const emitStatsUpdate = (io, statsData) => {
  emitAdminEvent(io, "stats-update", { data: statsData });
};

module.exports = {
  emitAdminEvent,
  emitUserUpdate,
  emitFileUpdate,
  emitChartUpdate,
  emitLogUpdate,
  emitContactUpdate,
  emitStatsUpdate,
  getUpdatedStats
};