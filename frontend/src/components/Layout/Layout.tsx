import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const { initAllProgress } = useProgressStore();

  useEffect(() => {
    if (isAuthenticated) {
      initAllProgress();
    }
  }, [isAuthenticated, initAllProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden h-14 bg-primary-700 dark:bg-slate-800 flex items-center px-4 z-20 sticky top-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-white hover:bg-primary-600 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-bold text-lg ml-3">Multicentro</span>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

