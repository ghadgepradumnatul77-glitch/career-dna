import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/apiAdapter'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr_' + Math.random().toString(36).substring(2, 8),
    name: '',
    email: '',
    targetRole: 'AI/ML Engineer'
  })

  const [resume, setResume] = useState({
    file: null,
    fileName: '',
    fileSize: 0,
    uploadedAt: null,
    status: 'idle'
  })

  const [github, setGithub] = useState({
    username: '',
    connectedAt: null,
    status: 'idle'
  })

  const [analysis, setAnalysis] = useState({
    status: 'idle', // 'idle' | 'processing' | 'completed' | 'error'
    currentStage: 0,
    error: null,
    careerDNA: null,
    skillGaps: null,
    nextAction: null
  })

  const [isMockMode, setIsMockMode] = useState(apiService.isMockMode())

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  const updateTargetRole = async (newRole) => {
    setUser((prev) => ({ ...prev, targetRole: newRole }))
    
    // If analysis was already completed, refresh Career DNA, Skill Gaps, and Next Action for new role
    if (analysis.status === 'completed') {
      try {
        const [dna, gaps, next] = await Promise.all([
          apiService.getCareerDNA(user.id, newRole),
          apiService.getSkillGaps(user.id, newRole),
          apiService.getNextAction(user.id, newRole)
        ])
        setAnalysis((prev) => ({
          ...prev,
          careerDNA: dna,
          skillGaps: gaps,
          nextAction: next
        }))
      } catch (err) {
        console.error('Failed to update role data:', err)
      }
    }
  }

  const updateResume = (resumeData) => {
    setResume((prev) => ({ ...prev, ...resumeData }))
  }

  const updateGithub = (githubData) => {
    setGithub((prev) => ({ ...prev, ...githubData }))
  }

  const runAnalysisForRole = async (targetRole) => {
    const candidateSkills = user.skills || []

    const result = await apiService.postAnalyze({
      user_id: user.id,
      target_role: targetRole,
      skills: candidateSkills
    })

    const [dnaData, gapsData, nextActionData] = await Promise.all([
      apiService.getCareerDNA(user.id, targetRole),
      apiService.getSkillGaps(user.id, targetRole),
      apiService.getNextAction(user.id, targetRole)
    ])

    setAnalysis((prev) => ({
      ...prev,
      status: 'completed',
      currentStage: 6,
      error: null,
      careerDNA: dnaData || result,
      skillGaps: gapsData || (result && result.skill_gaps),
      nextAction: nextActionData || (result && result.next_best_actions)
    }))
  }

  const runAnalysis = async () => {
    setAnalysis((prev) => ({
      ...prev,
      status: 'processing',
      currentStage: 1,
      error: null
    }))

    try {
      // Stage 1: Resume Upload & Parsing
      if (resume.file && !isMockMode) {
        await apiService.uploadResume(user.id, resume.file)
      }
      setAnalysis((prev) => ({ ...prev, currentStage: 2 }))

      // Stage 2: GitHub Ingestion
      if (github.username && !isMockMode) {
        await apiService.linkGithub(user.id, github.username)
      }
      setAnalysis((prev) => ({ ...prev, currentStage: 3 }))

      // Stage 3: Skills Mapping & Normalization
      setAnalysis((prev) => ({ ...prev, currentStage: 4 }))

      // Stage 4: Run backend Career DNA analysis
      await runAnalysisForRole(user.targetRole)

      setAnalysis((prev) => ({ ...prev, currentStage: 5 }))
      setAnalysis((prev) => ({ ...prev, currentStage: 6 }))

      return { success: true }
    } catch (err) {
      console.error('Analysis error:', err)
      setAnalysis((prev) => ({
        ...prev,
        status: 'error',
        error: err?.message || 'Career analysis failed. Please try again.'
      }))
      return { success: false, error: err?.message }
    }
  }

  const resetAll = () => {
    setUser({
      id: 'usr_' + Math.random().toString(36).substring(2, 8),
      name: '',
      email: '',
      targetRole: 'AI/ML Engineer'
    })
    setResume({
      file: null,
      fileName: '',
      fileSize: 0,
      uploadedAt: null,
      status: 'idle'
    })
    setGithub({
      username: '',
      connectedAt: null,
      status: 'idle'
    })
    setAnalysis({
      status: 'idle',
      currentStage: 0,
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
    setAnalysis,
    runAnalysis,
    resetAll,
    isMockMode,
    setIsMockMode
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
