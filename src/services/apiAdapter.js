import apiClient from './api'
import mockApiClient from './mockApi'

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK_API === true

export const apiService = {
  isMockMode: () => isMock,

  checkBackendHealth: async () => {
    if (isMock) return mockApiClient.checkBackendHealth()
    try {
      return await apiClient.checkBackendHealth()
    } catch (err) {
      console.warn('Real backend unavailable, falling back to mock mode for health check.', err)
      return mockApiClient.checkBackendHealth()
    }
  },

  uploadResume: async (file) => {
    if (isMock) return mockApiClient.uploadResume(file)
    try {
      return await apiClient.uploadResume(file)
    } catch (err) {
      console.warn('Upload error, using mock response:', err)
      return mockApiClient.uploadResume(file)
    }
  },

  linkGithub: async (username) => {
    if (isMock) return mockApiClient.linkGithub(username)
    try {
      return await apiClient.linkGithub(username)
    } catch (err) {
      console.warn('GitHub link error, using mock response:', err)
      return mockApiClient.linkGithub(username)
    }
  },

  getCareerDNA: async (userId, role) => {
    if (isMock) return mockApiClient.getCareerDNA(userId, role)
    try {
      return await apiClient.getCareerDNA(userId, role)
    } catch (err) {
      console.warn('Career DNA fetch failed, using mock data:', err)
      return mockApiClient.getCareerDNA(userId, role)
    }
  },

  getSkillGaps: async (userId, role) => {
    if (isMock) return mockApiClient.getSkillGaps(userId, role)
    try {
      return await apiClient.getSkillGaps(userId, role)
    } catch (err) {
      console.warn('Skill gaps fetch failed, using mock data:', err)
      return mockApiClient.getSkillGaps(userId, role)
    }
  },

  getNextAction: async (userId, role) => {
    if (isMock) return mockApiClient.getNextAction(userId, role)
    try {
      return await apiClient.getNextAction(userId, role)
    } catch (err) {
      console.warn('Next action fetch failed, using mock data:', err)
      return mockApiClient.getNextAction(userId, role)
    }
  },

  getSkillEvidence: async (skillId) => {
    return mockApiClient.getSkillEvidence(skillId)
  }
}

export default apiService
