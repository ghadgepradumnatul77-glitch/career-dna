import api from '../axios';

export const skillGapService = {
  analyzeSkillGap: async (target_role, required_skills = null) => {
    const response = await api.post('/skill-gap/analyze', { target_role, required_skills });
    return response.data;
  },

  getSkillGapHistory: async () => {
    const response = await api.get('/skill-gap/history');
    return response.data;
  },
};
