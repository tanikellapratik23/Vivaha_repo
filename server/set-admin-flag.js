require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function setAdminFlag() {
  try {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedwise';
    console.log('Connecting to MongoDB:', mongoUrl);
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'pratiktanikella@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found with email: pratiktanikella@gmail.com');
      console.log('Searching for all users...');
      const allUsers = await User.find({});
      console.log('All users:');
      allUsers.forEach(u => console.log(`- ${u.name} (${u.email}), isAdmin: ${u.isAdmin}`));
      await mongoose.disconnect();
      return;
    }

    console.log('Found admin user:', adminUser.name, adminUser.email);
    console.log('Current isAdmin flag:', adminUser.isAdmin);

    // Set isAdmin to true
    adminUser.isAdmin = true;
    await adminUser.save();

    console.log('✅ Admin flag set to true');
    console.log('Updated user:', adminUser.name, 'isAdmin:', adminUser.isAdmin);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setAdminFlag();
