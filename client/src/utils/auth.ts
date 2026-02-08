// Authentication storage utility
// Uses sessionStorage for automatic logout on tab close
// Uses localStorage when "keep me signed in" is checked

export const authStorage = {
  getToken: (): string | null => {
    // Try sessionStorage first (session login)
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) return sessionToken;
    
    // Try localStorage for "keep me signed in" feature
    const persistedToken = localStorage.getItem('token');
    if (persistedToken) {
      // Restore to sessionStorage so it works normally
      sessionStorage.setItem('token', persistedToken);
    }
    return persistedToken;
  },
  
  setToken: (token: string, persistent: boolean = false): void => {
    sessionStorage.setItem('token', token);
    if (persistent) {
      localStorage.setItem('token', token);
      localStorage.setItem('keepSignedIn', 'true');
    }
  },
  
  removeToken: (): void => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('keepSignedIn');
  },
  
  getUser: (): any => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: any): void => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  
  isKeepSignedIn: (): boolean => {
    return localStorage.getItem('keepSignedIn') === 'true';
  },
  
  clearAll: (): void => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('keepSignedIn');
  }
};
