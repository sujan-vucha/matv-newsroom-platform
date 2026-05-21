import { API_ENDPOINTS, getApiUrl } from './config';

class UserApi {
  async request(endpoint, options) {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Get user profile
  async getProfile() {
    return this.request(API_ENDPOINTS.USER.PROFILE);
  }

  // Update user profile
  async updateProfile(profile) {
    return this.request(API_ENDPOINTS.USER.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Get user bookmarks
  async getBookmarks() {
    return this.request(API_ENDPOINTS.USER.BOOKMARKS);
  }

  // Add bookmark
  async addBookmark(articleId) {
    return this.request(API_ENDPOINTS.USER.ADD_BOOKMARK, {
      method: 'POST',
      body: JSON.stringify({ articleId }),
    });
  }

  // Remove bookmark
  async removeBookmark(bookmarkId) {
    return this.request(API_ENDPOINTS.USER.REMOVE_BOOKMARK(bookmarkId), {
      method: 'DELETE',
    });
  }

  // Subscribe to newsletter
  async subscribeNewsletter(email) {
    return this.request(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Unsubscribe from newsletter
  async unsubscribeNewsletter(email) {
    return this.request(API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const userApi = new UserApi();