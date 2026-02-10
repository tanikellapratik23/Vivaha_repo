import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Registry from '../models/Registry';

const router = Router();

// Get all registries for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const registries = await Registry.find({ userId: req.userId }).sort({ addedAt: -1 });
    res.json(registries);
  } catch (error: any) {
    console.error('Get registries error:', error);
    res.status(500).json({ error: 'Failed to fetch registries' });
  }
});

// Add new registry
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, type, url, notes } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const registry = new Registry({
      userId: req.userId,
      name,
      type: type || 'other',
      url,
      notes,
    });

    await registry.save();
    res.status(201).json(registry);
  } catch (error: any) {
    console.error('Add registry error:', error);
    res.status(500).json({ error: 'Failed to add registry' });
  }
});

// Update registry
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, type, url, notes } = req.body;

    const registry = await Registry.findOne({ _id: req.params.id, userId: req.userId });

    if (!registry) {
      return res.status(404).json({ error: 'Registry not found' });
    }

    if (name) registry.name = name;
    if (type) registry.type = type;
    if (url) registry.url = url;
    if (notes !== undefined) registry.notes = notes;

    await registry.save();
    res.json(registry);
  } catch (error: any) {
    console.error('Update registry error:', error);
    res.status(500).json({ error: 'Failed to update registry' });
  }
});

// Delete registry
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await Registry.deleteOne({ _id: req.params.id, userId: req.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Registry not found' });
    }

    res.json({ message: 'Registry deleted' });
  } catch (error: any) {
    console.error('Delete registry error:', error);
    res.status(500).json({ error: 'Failed to delete registry' });
  }
});

export default router;
