import apiClient from './api'
import mockApiClient from './mockApi'

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true'

export const apiService = {
  isMockMode: () => isMock,

  checkBackendHealth: async () => {
    if (isMock) return mockApiClient.checkBackendHealth()
    try {
      return await apiClient.checkBackendHealth()
    } catch (err) {
      console.warn('Real backend unavailable, falling back to mock health check.', err)
      return mockApiClient.checkBackendHealth()
    }
  },

  postEvidence: async (evidenceData) => {
    if (isMock) return mockApiClient.getSkillEvidence(evidenceData.skill)
    try {
      return await apiClient.postEvidence(evidenceData)
    } catch (err) {
      console.warn('Post evidence error:', err)
      throw err
    }
  },

  postAnalyze: async (requestData) => {
    if (isMock) return mockApiClient.getCareerDNA(requestData.user_id, requestData.target_role)
    try {
      return await apiClient.postAnalyze(requestData)
    } catch (err) {
      console.warn('Post analyze error, falling back to mock:', err)
      return mockApiClient.getCareerDNA(requestData.user_id, requestData.target_role)
    }
  },

  getCareerDNA: async (userId, role) => {
    if (isMock) return mockApiClient.getCareerDNA(userId, role)
    try {
      return await apiClient.getCareerDNA(userId)
    } catch (err) {
      console.warn('Career DNA fetch failed, falling back to mock:', err)
      return mockApiClient.getCareerDNA(userId, role)
    }
  },

  getSkillGaps: async (userId, role) => {
    if (isMock) return mockApiClient.getSkillGaps(userId, role)
    try {
      return await apiClient.getSkillGaps(userId)
    } catch (err) {
      console.warn('Skill gaps fetch failed, falling back to mock:', err)
      return mockApiClient.getSkillGaps(userId, role)
    }
  },

  getPriorities: async (userId) => {
    if (isMock) return mockApiClient.getSkillGaps(userId, 'AI/ML Engineer')
    try {
      return await apiClient.getPriorities(userId)
    } catch (err) {
      console.warn('Priorities fetch failed:', err)
      return []
    }
  },

  getNextAction: async (userId, role) => {
    if (isMock) return mockApiClient.getNextAction(userId, role)
    try {
      return await apiClient.getNextAction(userId)
    } catch (err) {
      console.warn('Next action fetch failed, falling back to mock:', err)
      return mockApiClient.getNextAction(userId, role)
    }
  },

  getSkillEvidence: async (skillId) => {
    return mockApiClient.getSkillEvidence(skillId)
  }
}

export default apiService
