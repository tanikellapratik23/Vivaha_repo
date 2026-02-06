import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Post from '../models/Post';
import User from '../models/User';

const router = Router();

// Get all posts (with optional category filter)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { postType, category, content, photoUrl, location, tags, appRating } = req.body;

    const post = new Post({
      userId,
      userName: user.name,
      postType,
      category,
      content,
      photoUrl,
      location,
      tags: tags || [],
      appRating,
    });

    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like/unlike a post
router.post('/:postId/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = post.likedBy.includes(userId!);

    if (hasLiked) {
      // Unlike
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter((id) => id !== userId);
    } else {
      // Like
      post.likes += 1;
      post.likedBy.push(userId!);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes,
      hasLiked: !hasLiked,
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add comment to a post
router.post('/:postId/comment', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      userId: userId!,
      userName: user.name,
      content,
      createdAt: new Date(),
    } as any);

    await post.save();

    res.json({
      success: true,
      comment: post.comments[post.comments.length - 1],
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;
