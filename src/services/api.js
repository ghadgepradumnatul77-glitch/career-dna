import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.detail || error.response.data?.message || 'Server error occurred during request processing.',
        data: error.response.data
      })
    } else if (error.request) {
      return Promise.reject({
        status: 503,
        message: 'Career analysis service is temporarily unavailable. Please check backend status or retry in mock mode.',
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

  uploadResume: async (file) => {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await axiosInstance.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  linkGithub: async (username) => {
    const response = await axiosInstance.post('/link-github', {
      username: username.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
    })
    return response.data
  },

  getCareerDNA: async (userId, role = 'AI/ML Engineer') => {
    const response = await axiosInstance.get(`/career-dna/${userId}`, {
      params: { role }
    })
    return response.data
  },

  getSkillGaps: async (userId, role) => {
    const response = await axiosInstance.get(`/skill-gaps/${userId}/${encodeURIComponent(role)}`)
    return response.data
  },

  getNextAction: async (userId, role) => {
    const response = await axiosInstance.get(`/next-action/${userId}/${encodeURIComponent(role)}`)
    return response.data
  }
}

export default apiClient
