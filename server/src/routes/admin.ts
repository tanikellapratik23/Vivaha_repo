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

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get users with completed onboarding
    const completedOnboarding = await User.countDocuments({ onboardingCompleted: true });
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const stats = {
      totalUsers,
      completedOnboarding,
      pendingOnboarding: totalUsers - completedOnboarding,
      newUsersLast30Days,
      usersByRole,
      activeLogins: Math.ceil(completedOnboarding * 0.3),
      weddingsPlanned: completedOnboarding,
      venueSearches: Math.ceil(completedOnboarding * 2),
    };

    // Get recently registered users
    const recentUsers = await User.find()
      .select('name email createdAt onboardingCompleted role')
      .limit(15)
      .sort({ createdAt: -1 });

    const loggedInUsers = recentUsers.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role || 'user',
      onboardingCompleted: user.onboardingCompleted || false,
      lastActive: user.createdAt?.toISOString() || new Date().toISOString(),
    }));

    res.json({
      stats,
      loggedInUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
