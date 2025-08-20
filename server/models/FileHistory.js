const mongoose = require('mongoose');

const fileHistorySchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  chartType: { 
    type: String, 
    default: 'unknown' 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better query performance
fileHistorySchema.index({ uploadedBy: 1, uploadedAt: -1 });
fileHistorySchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('FileHistory', fileHistorySchema); 