import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SemesterCalculator from './pages/SemesterCalculator';
import CGPACalculator from './pages/CGPACalculator';
import AcademicProgress from './pages/AcademicProgress';
import Prediction from './pages/Prediction';
import Statistics from './pages/Statistics';
import About from './pages/About';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import SearchModal from './components/SearchModal';

function AppContent() {
  const { theme, toggleTheme, undo, canUndo } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search modal (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      
      // Undo last change (Ctrl+Z) - only if no input/textarea has focus, or let it work globally if matching canUndo
      if (e.ctrlKey && e.key === 'z') {
        // Prevent default if we can actually undo
        if (canUndo) {
          e.preventDefault();
          undo();
        }
      }

      // Close modal on Esc
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }

      // Toggle Theme (Alt+T)
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, undo, toggleTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/semester" element={<SemesterCalculator />} />
            <Route path="/cgpa" element={<CGPACalculator />} />
            <Route path="/progress" element={<AcademicProgress />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />

      {/* Global Course Search Overlay */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
