import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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

// Layout
import AppLayout from './components/layout/AppLayout'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/processing" element={<Processing />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evidence/:skill" element={<Evidence />} />
            <Route path="/gaps" element={<SkillGaps />} />
            <Route path="/next-action" element={<NextAction />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
