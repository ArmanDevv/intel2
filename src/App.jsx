// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StudentDashboard from './pages/Student/StudentDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import SyllabusParser from './pages/Student/SyllabusParser';
import PlaylistManager from './pages/Student/PlaylistManager';
import ContentUpload from './pages/Teacher/ContentUpload';
import ResourceManager from './pages/Teacher/ResourceManager';

function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

function AppRoutes() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/syllabus" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout><SyllabusParser /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/playlists" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout><PlaylistManager /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/upload" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <Layout><ContentUpload /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/resources" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <Layout><ResourceManager /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
