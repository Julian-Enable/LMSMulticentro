import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CoursePage from './pages/CoursePage';
import TopicPage from './pages/TopicPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

// Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/course/:categoryId" element={<CoursePage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />

        {/* Admin only routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
