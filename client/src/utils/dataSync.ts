import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Syncs all user data from the server (guests, budget, todos, onboarding data, etc.)
 * and updates localStorage with the fetched data
 */
export const syncUserData = async (token: string) => {
  try {
    console.log('🔄 Starting user data sync...');
    
    const response = await axios.get(`${API_URL}/api/user/sync`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });

    if (response.data.success) {
      const { data } = response.data;
      
      // Update localStorage with all fetched data
      if (data.guests && Array.isArray(data.guests)) {
        localStorage.setItem('guests', JSON.stringify(data.guests));
        console.log('✅ Synced guests:', data.guests.length);
      }

      if (data.budgetCategories && Array.isArray(data.budgetCategories)) {
        localStorage.setItem('budget', JSON.stringify(data.budgetCategories));
        console.log('✅ Synced budget:', data.budgetCategories.length);
      }

      if (data.todos && Array.isArray(data.todos)) {
        localStorage.setItem('todos', JSON.stringify(data.todos));
        console.log('✅ Synced todos:', data.todos.length);
      }

      if (data.onboardingData) {
        localStorage.setItem('onboarding', JSON.stringify(data.onboardingData));
        console.log('✅ Synced onboarding data');
      }

      if (data.weddingPageData) {
        localStorage.setItem('weddingPageData', JSON.stringify(data.weddingPageData));
        console.log('✅ Synced wedding page data');
      }

      if (data.navigationPreferences) {
        localStorage.setItem('navigationPreferences', JSON.stringify(data.navigationPreferences));
        console.log('✅ Synced navigation preferences');
      }

      console.log('✅ All user data synced successfully');
      return data;
    }
  } catch (error) {
    console.error('❌ Error syncing user data:', error);
    // Don't throw - allow app to continue with local data
    return null;
  }
};

/**
 * Saves individual data to the server
 */
export const saveDashboardData = async (token: string, type: 'guests' | 'budget' | 'todos', data: any[]) => {
  try {
    const endpoints: Record<string, string> = {
      guests: '/api/guests',
      budget: '/api/budget',
      todos: '/api/todos',
    };

    const endpoint = endpoints[type];
    if (!endpoint) throw new Error(`Unknown data type: ${type}`);

    // For each item, either update if it has _id or create if it's new
    for (const item of data) {
      if (item._id) {
        // Update existing
        await axios.put(`${API_URL}${endpoint}/${item._id}`, item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (!item.id?.startsWith('local-')) {
        // Create new
        await axios.post(`${API_URL}${endpoint}`, item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    console.log(`✅ Saved ${type}: ${data.length} items`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${type}:`, error);
    return false;
  }
};
