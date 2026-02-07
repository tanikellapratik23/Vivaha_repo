const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wedwise');

// Define User Schema (matching your model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'pratiktanikella@gmail.com' });
    
    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role = 'admin';
      existingAdmin.password = await bcrypt.hash('DqAmcCB4/DqAmcCB4/', 10);
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('DqAmcCB4/DqAmcCB4/', 10);
      
      const admin = new User({
        name: 'Pratik Tanikella',
        email: 'pratiktanikella@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
    }
    
    console.log('Email: pratiktanikella@gmail.com');
    console.log('Password: DqAmcCB4/DqAmcCB4/');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
