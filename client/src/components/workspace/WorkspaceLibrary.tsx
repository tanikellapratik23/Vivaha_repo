import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Copy, Archive, Trash2, ArrowRight, Calendar, Users } from 'lucide-react';
import axios from 'axios';

interface Workspace {
  _id: string;
  name: string;
  weddingDate: string;
  weddingType: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  lastActivity: string;
  user_role?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function WorkspaceLibrary() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weddingDate: '',
    weddingType: 'secular',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/workspaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(response.data.workspaces);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      setError('');
      if (!formData.name || !formData.weddingDate) {
        setError('Please fill in all required fields');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/workspaces`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaces([response.data.workspace, ...workspaces]);
      setShowCreateModal(false);
      setFormData({ name: '', weddingDate: '', weddingType: 'secular', notes: '' });
      navigate(`/dashboard/workspace/${response.data.workspace._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workspace');
    }
  };

  const handleRename = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/workspaces/${id}/rename`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaces(
        workspaces.map((w) => (w._id === id ? { ...w, name: newName } : w))
      );
      setRenamingId(null);
      setNewName('');
    } catch (err) {
      console.error('Failed to rename workspace:', err);
    }
  };

  const handleDuplicate = async (workspace: Workspace) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/workspaces/${workspace._id}/duplicate`,
        { newName: `${workspace.name} (Copy)` },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaces([response.data.workspace, ...workspaces]);
    } catch (err) {
      console.error('Failed to duplicate workspace:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/workspaces/${id}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaces(workspaces.filter((w) => w._id !== id));
    } catch (err) {
      console.error('Failed to archive workspace:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this workspace?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWorkspaces(workspaces.filter((w) => w._id !== id));
    } catch (err) {
      console.error('Failed to delete workspace:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wedding Dashboards</h1>
          <p className="text-gray-600">Manage all your wedding planning workspaces</p>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Dashboard
          </button>
        </div>

        {/* Workspaces Grid */}
        {workspaces.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No dashboards yet</h2>
            <p className="text-gray-600 mb-6">Create your first wedding dashboard to get started!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
                  {renamingId === workspace._id ? (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded text-gray-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleRename(workspace._id);
                        }}
                      />
                      <button
                        onClick={() => handleRename(workspace._id)}
                        className="px-3 py-2 bg-white text-pink-600 rounded font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-xl font-bold truncate">{workspace.name}</h3>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(workspace.status)}`}>
                      {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                    </span>
                  </div>

                  {/* Wedding Date */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    <span>{formatDate(workspace.weddingDate)}</span>
                  </div>

                  {/* Wedding Type */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold">Type:</span>
                    <span className="capitalize">{workspace.weddingType}</span>
                  </div>

                  {/* Role */}
                  {workspace.user_role && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="capitalize">{workspace.user_role}</span>
                    </div>
                  )}

                  {/* Last Activity */}
                  <div className="text-xs text-gray-500">
                    Last activity: {new Date(workspace.lastActivity).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 space-y-2">
                  <button
                    onClick={() => navigate(`/dashboard/workspace/${workspace._id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Open
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setRenamingId(workspace._id);
                        setNewName(workspace.name);
                      }}
                      title="Rename"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(workspace)}
                      title="Duplicate"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4 mx-auto" />
                    </button>

                    <button
                      onClick={() => handleArchive(workspace._id)}
                      title="Archive"
                      className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
                    >
                      <Archive className="w-4 h-4 mx-auto" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(workspace._id)}
                    className="w-full p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Dashboard</h2>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dashboard Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sarah & John - June 2026"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wedding Type (Optional)
                  </label>
                  <select
                    value={formData.weddingType}
                    onChange={(e) => setFormData({ ...formData, weddingType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="secular">Secular</option>
                    <option value="religious">Religious</option>
                    <option value="interfaith">Interfaith</option>
                    <option value="destination">Destination</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
