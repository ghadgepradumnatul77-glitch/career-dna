import api from '../axios';

export const ingestionService = {
  ingestResume: async (raw_text, file_name = 'resume.pdf') => {
    const response = await api.post('/ingest/resume', { raw_text, file_name });
    return response.data;
  },

  syncGithub: async (github_username) => {
    const response = await api.post('/ingest/github', { github_username });
    return response.data;
  },

  getSources: async () => {
    const response = await api.get('/ingest/sources');
    return response.data;
  },
};
