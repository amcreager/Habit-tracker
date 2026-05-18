import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GoogleAuthProvider } from '@/hooks/useGoogleAuth'
import BottomNav from '@/components/BottomNav'
import ReconnectBanner from '@/components/ReconnectBanner'
import TodayPage from '@/pages/TodayPage'
import HistoryPage from '@/pages/HistoryPage'
import ProgressPage from '@/pages/ProgressPage'
import SettingsPage from '@/pages/SettingsPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

export default function App() {
  return (
    <GoogleAuthProvider>
      <BrowserRouter>
        <ReconnectBanner />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </GoogleAuthProvider>
  )
}
