import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authStorage } from './utils/auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import Onboarding from './components/onboarding/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import WorkspaceLibrary from './components/workspace/WorkspaceLibrary';
import Login from './components/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import WelcomeBack from './components/WelcomeBack';
import Landing from './components/Landing';
import WhatIsVivaha from './components/WhatIsVivaha';
import DemoPage from './components/DemoPage';
import SharedDashboard from './components/dashboard/SharedDashboard';
import SharedWeddingInfo from './components/SharedWeddingInfo';
import AIAssistant from './components/AIAssistant';

function AppContent() {
  const navigate = useNavigate();
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for AI navigation commands
  useEffect(() => {
    const handleAINavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.path) {
        // Use a setTimeout to avoid infinite loops from replaceState
        setTimeout(() => {
          navigate(customEvent.detail.path);
        }, 0);
      }
    };

    window.addEventListener('aiNavigate', handleAINavigate);
    return () => window.removeEventListener('aiNavigate', handleAINavigate);
  }, []);

  useEffect(() => {
    // Check authentication status and fetch user role
    const fetchUserData = async () => {
      // Priority 1: Check Firebase auth first
      if (firebaseUser) {
        setIsAuthenticated(true);
        // Check if user is new (hasn't completed onboarding)
        const isNewUser = sessionStorage.getItem('isNewUser') === 'true' || 
                          localStorage.getItem('isNewUser') === 'true';
        const onboardingCompleted = sessionStorage.getItem('onboardingCompleted') === 'true' ||
                                    localStorage.getItem('onboardingCompleted') === 'true';
        
        // Only mark onboarding as completed if user is NOT new
        if (!isNewUser && onboardingCompleted) {
          setHasCompletedOnboarding(true);
        } else if (!isNewUser && !onboardingCompleted) {
          // Existing users who haven't marked onboarding as complete are assumed to have done it
          setHasCompletedOnboarding(true);
        } else {
          // New user - let them go through onboarding
          setHasCompletedOnboarding(false);
        }
        setIsLoading(false);
        return;
      }
      
      // Priority 2: Check legacy token auth
      const token = authStorage.getToken();
      setIsAuthenticated(!!token);
      
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const isAdminUser = decoded.isAdmin || false;
          setIsAdmin(isAdminUser);
          setHasCompletedOnboarding(true); // Authenticated users completed onboarding
          
          // Try to get role from localStorage first (faster)
          const cachedRole = localStorage.getItem('userRole');
          if (cachedRole) {
            setUserRole(cachedRole);
            setIsLoading(false);
            return;
          }
          
          // Fetch user role from onboarding data
          if (!isAdminUser) {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/onboarding`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (response.ok) {
                const data = await response.json();
                const role = data.role || 'couple';
                setUserRole(role);
                localStorage.setItem('userRole', role);
              }
            } catch (e) {
              console.error('Failed to fetch user role:', e);
              setUserRole('couple'); // Default to couple
            }
          }
          setIsLoading(false);
        } catch (e) {
          setIsAdmin(false);
          const onboardingCompleted = 
            localStorage.getItem('onboardingCompleted') === 'true' || 
            sessionStorage.getItem('onboardingCompleted') === 'true';
          setHasCompletedOnboarding(onboardingCompleted || true);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    // Only check when Firebase loading is complete
    if (!firebaseLoading) {
      fetchUserData();
    }
  }, [firebaseUser, firebaseLoading]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = authStorage.getToken();
      setIsAuthenticated(!!token);
      
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(decoded.isAdmin || false);
          setHasCompletedOnboarding(true);
        } catch (e) {
          setIsAdmin(false);
          setHasCompletedOnboarding(true);
        }
      } else {
        setHasCompletedOnboarding(false);
        setIsAdmin(false);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Respect explicit user preference stored in localStorage, otherwise follow OS setting
    const applyPref = () => {
      const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
        return;
      }
      if (stored === 'light') {
        document.documentElement.classList.remove('dark');
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    applyPref();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // only follow system changes when user hasn't set explicit preference
      if (!localStorage.getItem('theme')) applyPref();
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler as any);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* AI Assistant - Always available when authenticated */}
      {isAuthenticated && <AIAssistant />}
      
      {isLoading && isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Shared Wedding Info - No Auth Required */}
          <Route path="/wedding/:token" element={<SharedWeddingInfo />} />
          
          {/* Shared Dashboard - No Auth Required */}
          <Route path="/shared/:token" element={<SharedDashboard />} />
          
          <Route 
            path="/welcome-back" 
            element={
              isAuthenticated ? (
                <WelcomeBack />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/onboarding" 
            element={
              isAuthenticated ? (
                isAdmin || hasCompletedOnboarding ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Onboarding setHasCompletedOnboarding={setHasCompletedOnboarding} />
                )
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <Dashboard isAdmin={isAdmin} setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/workspaces" 
            element={
              isAuthenticated ? (
                <WorkspaceLibrary />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route
            path="/"
            element={
              firebaseLoading || isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : isAuthenticated ? (
                isAdmin || hasCompletedOnboarding ? (
                  userRole === 'planner' ? (
                    <Navigate to="/workspaces" />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                ) : (
                  <Navigate to="/onboarding" />
                )
              ) : (
                <Landing />
              )
            }
          />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/what-is-vivaha" element={<WhatIsVivaha />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  const BASENAME = ((import.meta.env.BASE_URL as string) || '/').replace(/\/$/, '') || '/';

  return (
    <AuthProvider>
      <Router basename={BASENAME}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
