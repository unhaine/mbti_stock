import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useMBTI } from './hooks'

// 페이지 임포트
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import LoadingPage from './pages/LoadingPage'
import MainPage from './pages/MainPage'
import CommunityPage from './pages/CommunityPage'
import PortfolioPage from './pages/PortfolioPage'
import SettingsPage from './pages/SettingsPage'

// Protected Route 컴포넌트
function ProtectedRoute({ children }) {
    const [mbti] = useMBTI()

    if (!mbti) {
        return <Navigate to="/onboarding" replace />
    }

    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/loading" element={<LoadingPage />} />

                {/* Protected Routes */}
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <ProtectedRoute>
                            <CommunityPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        <ProtectedRoute>
                            <PortfolioPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
