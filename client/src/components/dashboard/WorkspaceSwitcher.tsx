import React, { useState, useEffect } from 'react';
import { ChevronDown, Grid, Home, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Workspace {
  _id: string;
  name: string;
  status: string;
  weddingDate: string;
}

interface WorkspaceSwitcherProps {
  currentWorkspaceId?: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onBackToHome: () => void;
}

export default function WorkspaceSwitcher({
  currentWorkspaceId,
  onSelectWorkspace,
  onBackToHome,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaces();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentWorkspaceId && workspaces.length > 0) {
      const current = workspaces.find(w => w._id === currentWorkspaceId);
      if (current) {
        setCurrentWorkspaceName(current.name);
      }
    }
  }, [currentWorkspaceId, workspaces]);

  const fetchWorkspaces = async () => {
    setLoading(true);
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

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectWorkspace = (workspaceId: string) => {
    onSelectWorkspace(workspaceId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left"
      >
        <Grid className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
          {currentWorkspaceName || 'Select Wedding'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search weddings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Workspace List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-600 text-sm">Loading...</div>
            ) : filteredWorkspaces.length === 0 ? (
              <div className="p-4 text-center text-gray-600 text-sm">No weddings found</div>
            ) : (
              filteredWorkspaces.map(workspace => (
                <button
                  key={workspace._id}
                  onClick={() => handleSelectWorkspace(workspace._id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-pink-50 transition flex justify-between items-start ${
                    currentWorkspaceId === workspace._id ? 'bg-pink-50 border-l-4 border-l-pink-500' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{workspace.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(workspace.weddingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    workspace.status === 'planning'
                      ? 'bg-blue-100 text-blue-700'
                      : workspace.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {workspace.status}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-3 space-y-2">
            <button
              onClick={() => {
                onBackToHome();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium text-sm"
            >
              <Home className="w-4 h-4" />
              Back to All Weddings
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
