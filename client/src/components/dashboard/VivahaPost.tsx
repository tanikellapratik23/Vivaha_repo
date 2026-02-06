import { useState, useEffect } from 'react';
import { Camera, MapPin, Tag, MessageCircle, Heart, Send, Image as ImageIcon, User, Star, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { authStorage } from '../../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type PostType = 'photo' | 'blog';
type PostCategory = 'wedding-rave' | 'app-feedback';

interface Post {
  _id: string;
  userId: string;
  userName: string;
  postType: PostType;
  category: PostCategory;
  content: string;
  photoUrl?: string;
  location?: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  appRating?: number; // 1-5 stars for app feedback
  createdAt: string;
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export default function VivahaPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'wedding' | 'feedback'>('all');
  
  // Create post state
  const [newPost, setNewPost] = useState({
    postType: 'photo' as PostType,
    category: 'wedding-rave' as PostCategory,
    content: '',
    photoUrl: '',
    location: '',
    tags: [] as string[],
    appRating: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const token = authStorage.getToken();
      const response = await axios.get(`${API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { category: activeTab === 'all' ? undefined : activeTab === 'wedding' ? 'wedding-rave' : 'app-feedback' }
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      const token = authStorage.getToken();
      await axios.post(`${API_URL}/api/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setShowCreateModal(false);
      setNewPost({
        postType: 'photo',
        category: 'wedding-rave',
        content: '',
        photoUrl: '',
        location: '',
        tags: [],
        appRating: 0,
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const likePost = async (postId: string) => {
    try {
      const token = authStorage.getToken();
      await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const addComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      const token = authStorage.getToken();
      await axios.post(`${API_URL}/api/posts/${postId}/comment`, { content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost({ ...newPost, tags: [...newPost.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewPost({ ...newPost, tags: newPost.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">VivahaPost</h1>
        <p className="text-white/90 text-lg">
          Share your wedding journey, connect with others, and help us improve Vivaha
        </p>
      </div>

      {/* Tabs & Create Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setActiveTab('wedding')}
            className={`px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'wedding'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Wedding Raves
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'feedback'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            App Feedback
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
        >
          <Camera className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share your wedding story!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{post.userName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {post.category === 'app-feedback' && post.appRating && (
                    <div className="ml-auto flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < post.appRating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo for photo posts */}
                {post.postType === 'photo' && post.photoUrl && (
                  <img
                    src={post.photoUrl}
                    alt="Post"
                    className="w-full rounded-xl mb-4 max-h-96 object-cover"
                  />
                )}

                {/* Content */}
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Location & Tags */}
                {(post.location || post.tags.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {post.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4" />
                        <span>{post.location}</span>
                      </div>
                    )}
                    {post.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Like & Comment Buttons */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => likePost(post._id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.likedBy.includes(authStorage.getUser()?._id || '')
                        ? 'text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.likedBy.includes(authStorage.getUser()?._id || '') ? 'fill-red-500' : ''}`} />
                    <span className="font-semibold">{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{post.comments.length}</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="px-6 pb-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-400 text-white p-2 rounded-full h-fit">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addComment(post._id)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => addComment(post._id)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Post Category</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewPost({ ...newPost, category: 'wedding-rave' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newPost.category === 'wedding-rave'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Camera className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="font-semibold text-gray-900">Wedding Rave</div>
                    <div className="text-xs text-gray-600">Share your wedding story</div>
                  </button>
                  <button
                    onClick={() => setNewPost({ ...newPost, category: 'app-feedback' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newPost.category === 'app-feedback'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="font-semibold text-gray-900">App Feedback</div>
                    <div className="text-xs text-gray-600">Rate and review Vivaha</div>
                  </button>
                </div>
              </div>

              {/* Post Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Post Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewPost({ ...newPost, postType: 'photo' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      newPost.postType === 'photo'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 inline mr-2" />
                    Photo Post
                  </button>
                  <button
                    onClick={() => setNewPost({ ...newPost, postType: 'blog' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      newPost.postType === 'blog'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Blog Post
                  </button>
                </div>
              </div>

              {/* App Rating (only for feedback) */}
              {newPost.category === 'app-feedback' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rate Vivaha</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewPost({ ...newPost, appRating: rating })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newPost.appRating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo URL (only for photo posts) */}
              {newPost.postType === 'photo' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL</label>
                  <input
                    type="url"
                    value={newPost.photoUrl}
                    onChange={(e) => setNewPost({ ...newPost, photoUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {newPost.postType === 'photo' ? 'Caption' : 'Content'}
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder={newPost.category === 'wedding-rave' ? 'Share your wedding story...' : 'Tell us about your experience with Vivaha...'}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Location */}
              {newPost.category === 'wedding-rave' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Wedding Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newPost.location}
                      onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                      placeholder="City, State"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (people, places, vendors)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                disabled={!newPost.content.trim() || (newPost.category === 'app-feedback' && !newPost.appRating)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
