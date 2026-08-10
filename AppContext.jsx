import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    targetRole: 'AI/ML Engineer'
  })

  const [resume, setResume] = useState({
    file: null,
    fileName: '',
    uploadedAt: null,
    status: 'pending'
  })

  const [github, setGithub] = useState({
    username: '',
    connectedAt: null,
    status: 'pending'
  })

  const [analysis, setAnalysis] = useState({
    status: 'idle',
    error: null,
    careerDNA: null,
    skillGaps: null,
    nextAction: null
  })

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const updateTargetRole = (role) => {
    setUser(prev => ({ ...prev, targetRole: role }))
  }

  const updateResume = (resumeData) => {
    setResume(prev => ({ ...prev, ...resumeData }))
  }

  const updateGithub = (githubData) => {
    setGithub(prev => ({ ...prev, ...githubData }))
  }

  const updateAnalysis = (analysisData) => {
    setAnalysis(prev => ({ ...prev, ...analysisData }))
  }

  const resetAll = () => {
    setUser({
      id: null,
      name: '',
      email: '',
      targetRole: 'AI/ML Engineer'
    })
    setResume({
      file: null,
      fileName: '',
      uploadedAt: null,
      status: 'pending'
    })
    setGithub({
      username: '',
      connectedAt: null,
      status: 'pending'
    })
    setAnalysis({
      status: 'idle',
      error: null,
      careerDNA: null,
      skillGaps: null,
      nextAction: null
    })
  }

  const value = {
    user,
    updateUser,
    updateTargetRole,
    resume,
    updateResume,
    github,
    updateGithub,
    analysis,
    updateAnalysis,
    resetAll
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
