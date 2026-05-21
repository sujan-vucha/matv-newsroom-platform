const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Petition endpoints
  async getPetition(id = null) {
    return this.request(id ? `/petitions/${id}` : '/petitions');
  }

  async getPetitionStats(petitionId) {
    return this.request(`/petitions/${petitionId}/stats`);
  }

  // Signature endpoints
  async signPetition(signatureData) {
    return this.request('/signatures', {
      method: 'POST',
      body: JSON.stringify(signatureData),
    });
  }

  async getSignatures(petitionId, page = 1, limit = 20) {
    return this.request(`/signatures/petition/${petitionId}?page=${page}&limit=${limit}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();