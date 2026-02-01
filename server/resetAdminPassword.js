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

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wedwise');
    console.log('Connected to MongoDB');

    const email = 'pratiktanikella@gmail.com';
    const newPassword = 'WedWise2024!Admin';

    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({ email }, { $set: { password: hashed } }, { new: true });

    if (user) {
      console.log('✅ Admin password reset successfully for', email);
    } else {
      console.log('⚠️ Admin user not found:', email);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
})();
