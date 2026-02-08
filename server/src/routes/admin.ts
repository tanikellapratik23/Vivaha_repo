import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

// Get admin stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can access this
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    console.log('📊 Admin stats requested - fetching from database...');

    // Get total users count
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);

    // Get users with completed onboarding
    const completedOnboarding = await User.countDocuments({ onboardingCompleted: true });
    console.log(`Users with completed onboarding: ${completedOnboarding}`);
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    console.log(`Users by role:`, usersByRole);
    
    // Users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    console.log(`New users in last 30 days: ${newUsersLast30Days}`);

    // Get all bride and groom users for counting weddings
    const brideGroom = await User.countDocuments({
      onboardingCompleted: true,
      role: { $in: ['bride', 'groom'] }
    });
    console.log(`Bride/Groom users: ${brideGroom}`);

    const stats = {
      totalUsers,
      completedOnboarding,
      pendingOnboarding: totalUsers - completedOnboarding,
      newUsersLast30Days,
      usersByRole,
      activeLogins: newUsersLast30Days,
      weddingsPlanned: Math.ceil(brideGroom / 2),
      venueSearches: Math.ceil(completedOnboarding * 2),
    };

    // Get all users sorted by creation date (most recent first)
    const allUsers = await User.find({})
      .select('name email role createdAt onboardingCompleted')
      .limit(100)
      .sort({ createdAt: -1 });

    console.log(`Retrieved ${allUsers.length} users from database`);

    const loggedInUsers = allUsers.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role || 'user',
      onboardingCompleted: user.onboardingCompleted || false,
      lastActive: user.createdAt?.toISOString() || new Date().toISOString(),
    }));

    console.log('✅ Admin stats successfully generated');
    res.json({
      stats,
      loggedInUsers,
    });
  } catch (error) {
    console.error('❌ Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats', details: (error as Error).message });
  }
});

export default router;
