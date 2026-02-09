import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Archive, Trash2, Copy, Search, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface WorkspaceCard {
  _id: string;
  name: string;
  weddingDate: string;
  weddingType: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  lastActivity: string;
  progressMetrics?: {
    tasksCompleted: number;
    tasksTotal: number;
    vendorsBooked: number;
    budgetAllocated: number;
  };
}

interface PlannerWorkspaceHome {
  onCreateWorkspace: () => void;
  onSelectWorkspace: (workspaceId: string) => void;
}

export default function PlannerWorkspaceHome({ onCreateWorkspace, onSelectWorkspace }: PlannerWorkspaceHome) {
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/workspaces`, {
        withCredentials: true,
      });
      setWorkspaces(response.data.workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (workspaceId: string) => {
    try {
      await axios.patch(`${API_URL}/api/workspaces/${workspaceId}/archive`, {}, {
        withCredentials: true,
      });
      setWorkspaces(workspaces.filter(w => w._id !== workspaceId));
      setMenuOpen(null);
    } catch (error) {
      console.error('Error archiving workspace:', error);
    }
  };

  const handleDuplicate = async (workspaceId: string, name: string) => {
    try {
      const newName = `${name} (Copy)`;
      const response = await axios.post(
        `${API_URL}/api/workspaces/${workspaceId}/duplicate`,
        { newName },
        { withCredentials: true }
      );
      setWorkspaces([response.data.workspace, ...workspaces]);
      setMenuOpen(null);
    } catch (error) {
      console.error('Error duplicating workspace:', error);
    }
  };

  const handleDelete = async (workspaceId: string) => {
    if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/workspaces/${workspaceId}`, {
          withCredentials: true,
        });
        setWorkspaces(workspaces.filter(w => w._id !== workspaceId));
        setMenuOpen(null);
      } catch (error) {
        console.error('Error deleting workspace:', error);
      }
    }
  };

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || workspace.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'active':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getProgressPercentage = (metrics?: { tasksCompleted: number; tasksTotal: number }) => {
    if (!metrics || metrics.tasksTotal === 0) return 0;
    return Math.round((metrics.tasksCompleted / metrics.tasksTotal) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Your Weddings</h1>
              <p className="text-gray-600 mt-2">Manage and organize all your wedding planning projects</p>
            </div>
            <button
              onClick={onCreateWorkspace}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create New Wedding
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search weddings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'planning', 'active', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === f
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-300'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600"></div>
            <p className="text-gray-600 mt-4">Loading your weddings...</p>
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No weddings yet</p>
            <p className="text-gray-500 mb-6">Create your first wedding to get started</p>
            <button
              onClick={onCreateWorkspace}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Create New Wedding
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <div
                key={workspace._id}
                onClick={() => onSelectWorkspace(workspace._id)}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer border border-gray-200 overflow-hidden hover:border-pink-300"
              >
                {/* Card Header with Status */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 relative">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">
                        {workspace.name}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(workspace.status)}`}>
                          {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                        </span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                          {workspace.weddingType.charAt(0).toUpperCase() + workspace.weddingType.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === workspace._id ? null : workspace._id);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {menuOpen === workspace._id && (
                        <div
                          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(workspace._id, workspace.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(workspace._id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 border-t border-gray-200"
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workspace._id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-gray-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Wedding Date */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">{formatDate(workspace.weddingDate)}</span>
                  </div>

                  {/* Progress Indicator */}
                  {workspace.progressMetrics && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1 text-gray-700">
                          <TrendingUp className="w-4 h-4 text-pink-500" />
                          <span className="text-sm font-medium">Progress</span>
                        </div>
                        <span className="text-sm font-bold text-pink-600">
                          {getProgressPercentage(workspace.progressMetrics)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-rose-600 h-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(workspace.progressMetrics)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {workspace.progressMetrics && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Tasks</p>
                        <p className="text-lg font-bold text-gray-900">
                          {workspace.progressMetrics.tasksCompleted}/{workspace.progressMetrics.tasksTotal}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Vendors</p>
                        <p className="text-lg font-bold text-gray-900">{workspace.progressMetrics.vendorsBooked}</p>
                      </div>
                    </div>
                  )}

                  {/* Last Activity */}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Last activity: {formatDate(workspace.lastActivity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
