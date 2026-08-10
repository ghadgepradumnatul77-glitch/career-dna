import mockCareerDNA from '../data/mockCareerDNA'
import mockSkillGaps from '../data/mockSkillGaps'
import mockNextAction from '../data/mockNextAction'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApiClient = {
  checkHealth: async () => {
    await delay()
    return { status: 'ok' }
  },

  uploadResume: async (file) => {
    await delay(1000)
    return {
      resume_id: 'resume_' + Math.random().toString(36).substr(2, 9),
      status: 'processing',
      fileName: file.name,
      uploadedAt: new Date().toISOString()
    }
  },

  linkGithub: async (username) => {
    await delay(800)
    return {
      github_profile_id: 'github_' + Math.random().toString(36).substr(2, 9),
      username,
      status: 'processing',
      connectedAt: new Date().toISOString()
    }
  },

  getCareerDNA: async (userId) => {
    await delay(2000)
    return mockCareerDNA
  },

  getSkillGaps: async (userId, role) => {
    await delay(1000)
    return mockSkillGaps.filter(gap => !gap.role || gap.role === role)
  },

  getNextAction: async (userId, role) => {
    await delay(1500)
    return mockNextAction
  }
}

export default mockApiClient
