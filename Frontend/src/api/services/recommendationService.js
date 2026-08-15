import api from '../axios';

export const recommendationService = {
  getRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  generateRecommendations: async (target_role) => {
    const query = target_role ? `?target_role=${encodeURIComponent(target_role)}` : '';
    const response = await api.post(`/recommendations/generate${query}`);
    return response.data;
  },

  toggleRecommendation: async (id) => {
    const response = await api.patch(`/recommendations/${id}/toggle`);
    return response.data;
  },
};
