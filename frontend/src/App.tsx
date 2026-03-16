import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CoursePage from './pages/CoursePage';
import TopicPage from './pages/TopicPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

import ProfilePage from './pages/ProfilePage';

// Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <LoginPage />
            </motion.div>
          } />

          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <HomePage />
              </motion.div>
            } />
            <Route path="/search" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <SearchPage />
              </motion.div>
            } />
            <Route path="/library" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <LibraryPage />
              </motion.div>
            } />
            <Route path="/profile" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <ProfilePage />
              </motion.div>
            } />
            <Route path="/course/:categoryId" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <CoursePage />
              </motion.div>
            } />
            <Route path="/topic/:topicId" element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <TopicPage />
              </motion.div>
            } />

            {/* Admin only routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={['ADMIN']}>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <AdminPage />
                  </motion.div>
                </PrivateRoute>
              }
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
