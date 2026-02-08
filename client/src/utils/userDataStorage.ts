// User-specific data storage utility
// All user data is prefixed with userId to ensure complete data isolation

import { authStorage } from './auth';

export const userDataStorage = {
  /**
   * Get userId from current session
   */
  getUserId: (): string | null => {
    try {
      const user = authStorage.getUser();
      return user?._id || user?.id || null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Create user-specific localStorage key
   */
  createKey: (dataType: string): string | null => {
    const userId = userDataStorage.getUserId();
    if (!userId) return null;
    return `${userId}_${dataType}`;
  },

  /**
   * Set user-specific data
   */
  setData: (dataType: string, data: any): void => {
    const key = userDataStorage.createKey(dataType);
    if (key) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },

  /**
   * Get user-specific data
   */
  getData: (dataType: string): any => {
    const key = userDataStorage.createKey(dataType);
    if (!key) return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Remove user-specific data
   */
  removeData: (dataType: string): void => {
    const key = userDataStorage.createKey(dataType);
    if (key) {
      localStorage.removeItem(key);
    }
  },

  /**
   * Clear ALL user-specific data
   */
  clearUserData: (): void => {
    const userId = userDataStorage.getUserId();
    if (!userId) return;

    // List of all data types to clear
    const dataTypes = [
      'guests',
      'todos',
      'budget',
      'favoriteVendors',
      'ceremonies',
      'playlists',
      'seatingCharts',
      'wantsBachelorParty',
      'onboarding',
      'ceremony',
      'myVendors',
      'weddingPlaylists',
      'aiChatHistory',
      'navigationPreferences',
      'dataCache',
    ];

    // Clear all prefixed keys
    dataTypes.forEach(dataType => {
      const key = `${userId}_${dataType}`;
      localStorage.removeItem(key);
    });

    // Also clear old non-prefixed keys for migration
    dataTypes.forEach(dataType => {
      localStorage.removeItem(dataType);
    });

    console.log(`✅ Cleared all data for user: ${userId}`);
  },

  /**
   * Migrate old non-prefixed data to new user-specific format
   */
  migrateOldData: (): void => {
    const userId = userDataStorage.getUserId();
    if (!userId) return;

    const dataTypes = [
      'guests',
      'todos',
      'budget',
      'favoriteVendors',
      'ceremonies',
      'playlists',
      'seatingCharts',
      'onboarding',
      'ceremony',
      'myVendors',
      'weddingPlaylists',
    ];

    dataTypes.forEach(dataType => {
      const oldData = localStorage.getItem(dataType);
      if (oldData) {
        // Save to user-specific key
        localStorage.setItem(`${userId}_${dataType}`, oldData);
        // Remove old key
        localStorage.removeItem(dataType);
        console.log(`✅ Migrated ${dataType} to user-specific storage`);
      }
    });
  },
};
