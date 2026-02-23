import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import DashboardLinks from './pages/DashboardLinks'
import DashboardSettings from './pages/DashboardSettings'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/links" element={<DashboardLinks />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
          </Route>
        </Route>

        {/* Dynamic route needs to be last to avoid catching hardcoded routes first */}
        <Route path="/:username" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
