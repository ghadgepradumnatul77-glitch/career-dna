import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor for professional error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      let msg = error.response.data?.detail || error.response.data?.message
      if (Array.isArray(msg)) {
        msg = msg.map(e => `${e.loc?.join('.') || ''}: ${e.msg}`).join(', ')
      }
      return Promise.reject({
        status: error.response.status,
        message: msg || 'Server error occurred during request processing.',
        data: error.response.data
      })
    } else if (error.request) {
      return Promise.reject({
        status: 503,
        message: 'Career analysis service is temporarily unavailable. Please check backend status.',
        originalError: error
      })
    } else {
      return Promise.reject({
        status: 500,
        message: 'An unexpected application error occurred. Please try again.',
        originalError: error
      })
    }
  }
)

export const apiClient = {
  checkBackendHealth: async () => {
    const response = await axiosInstance.get('/health')
    return response.data
  },

  postEvidence: async (evidenceData) => {
    const response = await axiosInstance.post('/evidence', evidenceData)
    return response.data
  },

  postAnalyze: async (requestData) => {
    const response = await axiosInstance.post('/analyze', requestData)
    return response.data
  },

  getCareerDNA: async (userId) => {
    const response = await axiosInstance.get(`/career-dna/${userId}`)
    return response.data
  },

  getSkillGaps: async (userId) => {
    const response = await axiosInstance.get(`/gaps/${userId}`)
    const data = response.data
    return data?.gaps || data || []
  },

  getPriorities: async (userId) => {
    const response = await axiosInstance.get(`/priorities/${userId}`)
    const data = response.data
    return data?.priorities || data || []
  },

  getNextAction: async (userId) => {
    const response = await axiosInstance.get(`/actions/${userId}`)
    const data = response.data
    return data?.actions || data || []
  }
}

export default apiClient
