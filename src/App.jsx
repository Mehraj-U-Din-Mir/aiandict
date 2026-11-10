import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import InnovationClub from './pages/InnovationClub';
import ClubRegister from './pages/ClubRegister';
import Messages from './pages/Messages';
import Activities from './pages/Activities';
import Documents from './pages/Documents';
import AiTools from './pages/AiTools';
import VirtualLab from './pages/VirtualLab';
import Search from './pages/Search';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Core Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/innovation-club" element={<InnovationClub />} />
                <Route path="/club-register" element={<ClubRegister />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/ai-tools" element={<AiTools />} />
                <Route path="/virtual-lab" element={<VirtualLab />} />
                <Route path="/search" element={<Search />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/student/login" element={<Login />} />
                <Route path="/faculty/login" element={<Login />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/student/register" element={<Register />} />

                {/* Role-Based Dashboards */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/faculty" element={<FacultyDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/ai_skill_club" element={<AdminDashboard />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

