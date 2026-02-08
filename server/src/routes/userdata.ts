import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Guest from '../models/Guest';
import BudgetCategory from '../models/BudgetCategory';
import Todo from '../models/Todo';

const router = Router();

// Get all user data (onboarding, guests, budget, todos)
router.get('/sync', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    console.log('📊 Syncing all user data for:', userId);

    // Fetch all related data in parallel
    const [user, guests, budgetCategories, todos] = await Promise.all([
      User.findById(userId).select('onboardingData onboardingCompleted weddingPageData navigationPreferences'),
      Guest.find({ userId }),
      BudgetCategory.find({ userId }),
      Todo.find({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Data synced - Guests:', guests.length, 'Budget:', budgetCategories.length, 'Todos:', todos.length);

    res.json({
      success: true,
      data: {
        onboardingData: user.onboardingData || {},
        onboardingCompleted: user.onboardingCompleted,
        weddingPageData: user.weddingPageData || {},
        navigationPreferences: user.navigationPreferences || { order: [], hidden: [] },
        guests,
        budgetCategories,
        todos,
      },
    });
  } catch (error) {
    console.error('❌ Error syncing user data:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

export default router;
