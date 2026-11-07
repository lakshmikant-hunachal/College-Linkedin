import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { NetworkPage } from './pages/NetworkPage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { PlacementsPage } from './pages/PlacementsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ExNotePage } from './pages/ExNotePage';
import { MessagesPage } from './pages/MessagesPage';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/exnote" element={<ExNotePage />} />
                <Route path="/roadmaps" element={<RoadmapsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/placements" element={<PlacementsPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
