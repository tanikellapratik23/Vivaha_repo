import { auth } from '../services/firebase';

/**
 * Get Firebase ID token for API authentication
 * Falls back to localStorage token if Firebase is not available
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    // Try Firebase first
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return token;
    }
  } catch (error) {
    console.error('Failed to get Firebase token:', error);
  }

  // Fallback to localStorage for legacy auth
  return localStorage.getItem('token');
};

/**
 * Get auth token synchronously (may return null if not available)
 */
export const getAuthTokenSync = (): string | null => {
  try {
    // Try Firebase first
    if (auth && auth.currentUser) {
      // Note: This returns null synchronously - use getAuthToken for actual token
      return 'firebase-user';
    }
  } catch (error) {
    console.error('Error checking Firebase auth:', error);
  }

  // Fallback to localStorage
  return localStorage.getItem('token');
};
