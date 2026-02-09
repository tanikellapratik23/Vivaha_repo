import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import PlannerWorkspaceHome from './PlannerWorkspaceHome';
import CreateWeddingModal from './CreateWeddingModal';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import Dashboard from './Dashboard';
import { LogOut, Settings } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PlannerDashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function PlannerDashboard({ setIsAuthenticated }: PlannerDashboardProps) {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get user role from token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('onboardingCompleted');
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const handleCreateWorkspace = () => {
    setIsCreateModalOpen(true);
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    // Navigate to wedding dashboard with workspace context
    navigate(`/dashboard/planner/workspace/${workspaceId}`);
  };

  const handleBackToHome = () => {
    setCurrentWorkspaceId(null);
    navigate('/dashboard/planner');
  };

  const handleWorkspaceCreated = (workspace: any) => {
    // Optionally auto-select the new workspace
    setCurrentWorkspaceId(workspace._id);
    navigate(`/dashboard/planner/workspace/${workspace._id}`);
  };

  // Only show workspace dashboard if planner is viewing a workspace
  if (currentWorkspaceId) {
    return (
      <Dashboard
        workspaceId={currentWorkspaceId}
        isPlanner={true}
        setIsAuthenticated={setIsAuthenticated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">VP</span>
            </div>
            <span className="font-bold text-lg text-gray-900">VivahaPlan</span>
          </div>

          <div className="flex items-center gap-4">
            {currentWorkspaceId && (
              <WorkspaceSwitcher
                currentWorkspaceId={currentWorkspaceId}
                onSelectWorkspace={handleSelectWorkspace}
                onBackToHome={handleBackToHome}
              />
            )}
            <button
              onClick={() => navigate('/dashboard/planner/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <PlannerWorkspaceHome
        onCreateWorkspace={handleCreateWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
      />

      {/* Create Wedding Modal */}
      <CreateWeddingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleWorkspaceCreated}
      />
    </div>
  );
}
