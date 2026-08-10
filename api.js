import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Error handler
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'An error occurred',
        data: error.response.data
      })
    } else if (error.request) {
      return Promise.reject({
        message: 'Career analysis service is temporarily unavailable. Please try again.',
        originalError: error
      })
    } else {
      return Promise.reject({
        message: 'An error occurred. Please try again.',
        originalError: error
      })
    }
  }
)

// API Methods
export const apiClient = {
  checkHealth: async () => {
    const response = await axiosInstance.get('/health')
    return response.data
  },

  uploadResume: async (file) => {
    const formData = new FormData()
    formData.append('resume', file)

    return axiosInstance.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data)
  },

  linkGithub: async (username) => {
    const response = await axiosInstance.post('/link-github', {
      username
    })
    return response.data
  },

  getCareerDNA: async (userId) => {
    const response = await axiosInstance.get(`/career-dna/${userId}`)
    return response.data
  },

  getSkillGaps: async (userId, role) => {
    const response = await axiosInstance.get(`/skill-gaps/${userId}/${role}`)
    return response.data
  },

  getNextAction: async (userId, role) => {
    const response = await axiosInstance.get(`/next-action/${userId}/${role}`)
    return response.data
  }
}

export default axiosInstance
