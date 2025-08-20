const mongoose = require('mongoose');
const User = require('./models/User');
const UserLog = require('./models/UserLog');
const FileHistory = require('./models/FileHistory');
const DataSet = require('./models/DataSet');
require('dotenv').config();

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/excel-analytics');
    console.log('Connected to MongoDB');

    // Create admin user if it doesn't exist
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Admin user created');
    }

    // Create some regular users
    const regularUsers = await User.find({ role: 'user' });
    if (regularUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('user123', 10);
      
      const users = [
        { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'user' },
        { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, role: 'user' },
        { name: 'Bob Johnson', email: 'bob@example.com', password: hashedPassword, role: 'uploader' }
      ];

      for (const userData of users) {
        const user = new User(userData);
        await user.save();
      }
      console.log('Regular users created');
    }

    // Create sample user logs
    const users = await User.find();
    const logActions = ['login', 'logout', 'upload', 'download', 'create', 'update'];
    
    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAction = logActions[Math.floor(Math.random() * logActions.length)];
      
      const log = new UserLog({
        userId: randomUser._id,
        action: randomAction,
        details: `User performed ${randomAction} action`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
      });
      await log.save();
    }
    console.log('Sample user logs created');

    // Create sample file history
    const fileNames = ['sales_data.xlsx', 'inventory_report.xlsx', 'customer_data.xlsx', 'financial_report.xlsx'];
    const chartTypes = ['bar', 'line', 'doughnut', 'pie'];
    
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)];
      const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
      
      const fileHistory = new FileHistory({
        filename: randomFileName,
        uploadedBy: randomUser._id,
        fileSize: Math.floor(Math.random() * 1000000) + 10000, // 10KB to 1MB
        chartType: randomChartType,
        uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      await fileHistory.save();
    }
    console.log('Sample file history created');

    // Create sample datasets/files
    for (let i = 0; i < 10; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)];
      
      const dataset = new DataSet({
        filename: randomFileName,
        originalName: randomFileName,
        uploadedBy: randomUser._id,
        size: Math.floor(Math.random() * 1000000) + 10000,
        uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      await dataset.save();
    }
    console.log('Sample datasets created');

    console.log('✅ Sample data seeded successfully!');
    console.log('Admin credentials: admin@example.com / admin123');
    console.log('User credentials: john@example.com / user123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedData(); 