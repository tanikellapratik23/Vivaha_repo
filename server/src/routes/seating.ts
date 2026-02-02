import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Seating from '../models/Seating';

const router = Router();

// Get seating arrangement
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let seating = await Seating.findOne({ userId: req.userId });
    if (!seating) {
      seating = new Seating({ userId: req.userId, tables: [] });
      await seating.save();
    }
    res.json({ success: true, data: seating });
  } catch (error) {
    console.error('Failed to fetch seating:', error);
    res.status(500).json({ error: 'Failed to fetch seating arrangement' });
  }
});

// Save/update seating arrangement
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { tables } = req.body;
    let seating = await Seating.findOne({ userId: req.userId });
    
    if (!seating) {
      seating = new Seating({ userId: req.userId, tables });
    } else {
      seating.tables = tables;
    }
    
    seating.updatedAt = new Date();
    await seating.save();
    res.json({ success: true, data: seating });
  } catch (error) {
    console.error('Failed to save seating:', error);
    res.status(500).json({ error: 'Failed to save seating arrangement' });
  }
});

// Update seating arrangement
router.put('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { tables } = req.body;
    let seating = await Seating.findOne({ userId: req.userId });
    
    if (!seating) {
      seating = new Seating({ userId: req.userId, tables });
    } else {
      seating.tables = tables;
    }
    
    seating.updatedAt = new Date();
    await seating.save();
    res.json({ success: true, data: seating });
  } catch (error) {
    console.error('Failed to update seating:', error);
    res.status(500).json({ error: 'Failed to update seating arrangement' });
  }
});

// Delete seating arrangement (clear tables)
router.delete('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Seating.deleteOne({ userId: req.userId });
    res.json({ success: true, message: 'Seating arrangement deleted' });
  } catch (error) {
    console.error('Failed to delete seating:', error);
    res.status(500).json({ error: 'Failed to delete seating arrangement' });
  }
});

export default router;
