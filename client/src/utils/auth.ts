// Authentication storage utility
// The API token is the single source of truth for signed-in users.
// Keep the legacy `token` key in sync while older dashboard components migrate.

export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
  },
  
  getUser: (): any => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) return JSON.parse(user);
    return null;
  },
  
  setUser: (user: any): void => {
    const serialized = JSON.stringify(user);
    localStorage.setItem('user', serialized);
    sessionStorage.setItem('user', serialized);
  },
  

  clearAll: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
};
