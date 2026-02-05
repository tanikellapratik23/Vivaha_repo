// Authentication storage utility
// Uses sessionStorage for automatic logout on tab close

export const authStorage = {
  getToken: (): string | null => {
    return sessionStorage.getItem('token');
  },
  
  setToken: (token: string): void => {
    sessionStorage.setItem('token', token);
  },
  
  removeToken: (): void => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token'); // Clean up old localStorage too
  },
  
  getUser: (): any => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: any): void => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  
  clearAll: (): void => {
    sessionStorage.clear();
    // Clear old localStorage items too
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
  }
};
