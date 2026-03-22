import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppShell from '../components/layout/AppShell'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import UploadVideoPage from '../pages/UploadVideoPage'
import VideoPlayerPage from '../pages/VideoPlayerPage'
import PlaylistPage from '../pages/PlaylistPage'
import DashboardPage from '../pages/DashboardPage'
import TweetsPage from '../pages/TweetsPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadVideoPage />} />
          <Route path="/video/:videoId" element={<VideoPlayerPage />} />
          <Route path="/playlists" element={<PlaylistPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tweets" element={<TweetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
