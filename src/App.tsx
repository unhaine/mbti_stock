import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { PortfolioProvider } from './contexts/PortfolioContext'
import { StockProvider } from './contexts/StockContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

// 페이지 임포트
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import OnboardingPage from './pages/OnboardingPage'
import LoadingPage from './pages/LoadingPage'
import MainPage from './pages/MainPage'
import CommunityPage from './pages/CommunityPage'
import PortfolioPage from './pages/PortfolioPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StockProvider>
          <PortfolioProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/loading" element={<LoadingPage />} />
                  <Route path="/main" element={<MainPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* 토스트 알림 시스템 */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: '12px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </BrowserRouter>
          </PortfolioProvider>
        </StockProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
