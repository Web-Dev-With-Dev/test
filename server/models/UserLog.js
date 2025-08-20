const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  action: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String, 
    default: '' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better query performance
userLogSchema.index({ userId: 1, timestamp: -1 });
userLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('UserLog', userLogSchema); 