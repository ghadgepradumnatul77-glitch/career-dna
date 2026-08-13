import { mockCareerDNAMap } from '../data/mockCareerDNA'
import { mockSkillGapsMap } from '../data/mockSkillGaps'
import { mockNextActionMap } from '../data/mockNextAction'
import { getSkillEvidence } from '../data/mockEvidence'

const getDelay = () => parseInt(import.meta.env.VITE_PROCESSING_DELAY || '800', 10)
const delay = (ms = getDelay()) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApiClient = {
  checkBackendHealth: async () => {
    await delay(300)
    return { status: 'ok', mode: 'mock' }
  },

  uploadResume: async (file) => {
    await delay(1200)
    return {
      resume_id: 'res_' + Math.random().toString(36).substring(2, 9),
      status: 'processing',
      fileName: file.name,
      uploadedAt: new Date().toISOString()
    }
  },

  linkGithub: async (username) => {
    await delay(1000)
    const cleanUsername = username.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
    return {
      github_profile_id: 'gh_' + Math.random().toString(36).substring(2, 9),
      username: cleanUsername,
      status: 'processing',
      connectedAt: new Date().toISOString()
    }
  },

  getCareerDNA: async (userId, role = 'AI/ML Engineer') => {
    await delay(600)
    const data = mockCareerDNAMap[role] || mockCareerDNAMap['AI/ML Engineer']
    return { ...data, user_id: userId || data.user_id }
  },

  getSkillGaps: async (userId, role = 'AI/ML Engineer') => {
    await delay(500)
    return mockSkillGapsMap[role] || mockSkillGapsMap['AI/ML Engineer']
  },

  getNextAction: async (userId, role = 'AI/ML Engineer') => {
    await delay(500)
    return mockNextActionMap[role] || mockNextActionMap['AI/ML Engineer']
  },

  getSkillEvidence: async (skillId) => {
    await delay(400)
    return getSkillEvidence(skillId)
  }
}

export default mockApiClient
