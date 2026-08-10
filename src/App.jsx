import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Pages
import Landing from './pages/Landing'
import Setup from './pages/Setup'
import Processing from './pages/Processing'
import Dashboard from './pages/Dashboard'
import Evidence from './pages/Evidence'
import SkillGaps from './pages/SkillGaps'
import NextAction from './pages/NextAction'
import NotFound from './pages/NotFound'

// Layout & Global Visual Utilities
import AppLayout from './components/layout/AppLayout'
import NeuralBackground from './components/common/NeuralBackground'
import CustomCursor from './components/common/CustomCursor'

// Global Styles
import './styles/globals.css'

function App() {
  return (
    <AppProvider>
      <NeuralBackground />
      <CustomCursor />
      <Router>
        <Routes>
          {/* Public / Onboarding Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/processing" element={<Processing />} />

          {/* Authenticated / Dashboard Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evidence/:skill" element={<Evidence />} />
            <Route path="/gaps" element={<SkillGaps />} />
            <Route path="/next-action" element={<NextAction />} />
          </Route>

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
