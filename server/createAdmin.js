const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  onboardingCompleted: Boolean,
  isAdmin: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wedwise');
    console.log('Connected to MongoDB');

    const adminEmail = 'pratiktanikella@gmail.com';
    const adminPassword = 'WedWise2024!Admin';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      name: 'Pratik Tanikella',
      email: adminEmail,
      password: hashedPassword,
      onboardingCompleted: true,
      isAdmin: true,
      createdAt: new Date(),
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
