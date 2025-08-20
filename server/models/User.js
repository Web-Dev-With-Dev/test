const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: "user" },
  phone: String,
  status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true }); // This adds createdAt and updatedAt fields automatically

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model("User", userSchema);
