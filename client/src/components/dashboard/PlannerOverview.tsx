import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, CheckSquare, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface WorkspaceStats {
  totalWeddings: number;
  activeWeddings: number;
  upcomingWeddings: number;
  completedWeddings: number;
  totalTasks: number;
  completedTasks: number;
  vendorsBooked: number;
  totalBudget: number;
}

export default function PlannerOverview() {
  const [stats, setStats] = useState<WorkspaceStats>({
    totalWeddings: 0,
    activeWeddings: 0,
    upcomingWeddings: 0,
    completedWeddings: 0,
    totalTasks: 0,
    completedTasks: 0,
    vendorsBooked: 0,
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/workspaces`, {
        withCredentials: true,
      });

      const workspaces = response.data.workspaces || [];

      const calculatedStats: WorkspaceStats = {
        totalWeddings: workspaces.length,
        activeWeddings: workspaces.filter((w: any) => w.status === 'active').length,
        upcomingWeddings: workspaces.filter((w: any) => w.status === 'planning').length,
        completedWeddings: workspaces.filter((w: any) => w.status === 'completed').length,
        totalTasks: workspaces.reduce((sum: number, w: any) => sum + (w.progressMetrics?.tasksTotal || 0), 0),
        completedTasks: workspaces.reduce((sum: number, w: any) => sum + (w.progressMetrics?.tasksCompleted || 0), 0),
        vendorsBooked: workspaces.reduce((sum: number, w: any) => sum + (w.progressMetrics?.vendorsBooked || 0), 0),
        totalBudget: workspaces.reduce((sum: number, w: any) => sum + (w.progressMetrics?.budgetAllocated || 0), 0),
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtext, gradient }: any) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-md hover:shadow-lg transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-3 bg-white rounded-lg">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600"></div>
        <p className="text-gray-600 mt-4">Loading your statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Planning Overview</h1>
        <p className="text-gray-600">Manage and track all your wedding projects in one place</p>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Briefcase}
            title="Total Weddings"
            value={stats.totalWeddings}
            subtext="Projects managed"
            gradient="from-blue-50 to-indigo-50"
          />
          <StatCard
            icon={TrendingUp}
            title="Active Now"
            value={stats.activeWeddings}
            subtext="Currently planning"
            gradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming"
            value={stats.upcomingWeddings}
            subtext="In planning phase"
            gradient="from-purple-50 to-violet-50"
          />
          <StatCard
            icon={CheckSquare}
            title="Completed"
            value={stats.completedWeddings}
            subtext="Successfully delivered"
            gradient="from-pink-50 to-rose-50"
          />
        </div>
      </div>

      {/* Progress Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tasks</h3>
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {stats.completedTasks} of {stats.totalTasks} tasks
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Vendors</h3>
              <Briefcase className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats.vendorsBooked}</p>
              <p className="text-sm text-gray-600">vendors booked across all weddings</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Budget</h3>
              <DollarSign className="w-5 h-5 text-pink-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">
                ${(stats.totalBudget / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-gray-600">total budget allocated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-pink-300 transition text-left group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">View All Weddings</h3>
                <p className="text-sm text-gray-600 mt-1">Browse your complete wedding portfolio</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition" />
            </div>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-pink-300 transition text-left group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Create New Wedding</h3>
                <p className="text-sm text-gray-600 mt-1">Start planning a new wedding project</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
