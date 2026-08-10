import api from '../axios';

export const careerService = {
  getCareerDNA: async () => {
    const response = await api.get('/career-dna');
    return response.data;
  },

  recalculateCareerDNA: async () => {
    const response = await api.post('/career-dna/recalculate');
    return response.data;
  },
};
