import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FolderGit2, 
  Users, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Trash2, 
  RotateCcw,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, users } = useAuth();
  const { 
    projects, 
    toggleProjectFeatured, 
    deleteProject, 
    clubRegistrations, 
    updateClubRegistrationStatus,
    resetToDefaults
  } = useData();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'club', 'users'

  const studentCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'faculty').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar_url || '/img/mehraj.png'}
            alt="HOD Admin"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            onError={(e) => { e.target.src = '/img/admin.jpg'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{currentUser?.name}</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Department Head & Administrator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.designation || 'HOD AI & ICT GVEI'}</p>
            <p className="text-xs text-indigo-300 font-medium mt-1">C.R.E.A.T.E. Academic Governance & Accreditations</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all project records and club submissions back to initial seed defaults?")) {
              resetToDefaults();
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          title="Reset back to initial seed data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Defaults</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Projects</div>
          <div className="text-3xl font-extrabold text-white mt-2">{projects.length}</div>
          <div className="text-[11px] text-indigo-400 mt-1">{projects.filter(p => p.is_featured).length} Featured on Home</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Club Registrations</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-2">{clubRegistrations.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">{clubRegistrations.filter(r => r.status === 'Approved').length} Approved Members</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Faculty Mentors</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{facultyCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Supervisors Active</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Registered Students</div>
          <div className="text-3xl font-extrabold text-pink-400 mt-2">{studentCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Undergraduate Cohort</div>
        </div>
      </div>

      {/* Governance Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Manage Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('club')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'club' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Club Enrollments ({clubRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Faculty & Student Directory ({users.length})
          </button>
        </div>

        {/* TAB 1: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {proj.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {proj.status}
                    </span>
                    {proj.is_featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white">{proj.title}</h4>
                  <div className="text-xs text-slate-400">
                    Student: <strong className="text-slate-200">{proj.student_name}</strong> • Supervisor: <strong className="text-slate-200">{proj.faculty_name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleProjectFeatured(proj.id)}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      proj.is_featured 
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Toggle Featured on Landing Page"
                  >
                    <Star className={`w-4 h-4 ${proj.is_featured ? 'fill-amber-400' : ''}`} />
                  </button>

                  <Link
                    to={`/project/${proj.id}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm(`Delete capstone "${proj.title}"?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Club Registrations */}
        {activeTab === 'club' && (
          <div className="space-y-4">
            {clubRegistrations.map(reg => (
              <div
                key={reg.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{reg.user_name}</h4>
                    <span className="text-xs text-slate-400">({reg.user_email})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      reg.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Year: <strong>{reg.year}</strong> • Focus: <span className="text-purple-300">{reg.interests}</span>
                  </div>
                  {reg.note && (
                    <p className="text-xs text-slate-400 italic">"{reg.note}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {reg.status !== 'Approved' && (
                    <button
                      onClick={() => updateClubRegistrationStatus(reg.id, 'Approved')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Approve Member
                    </button>
                  )}
                  {reg.status !== 'Rejected' && (
                    <button
                      onClick={() => updateClubRegistrationStatus(reg.id, 'Rejected')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Users */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(u => (
              <div key={u.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
                <img
                  src={u.avatar_url || '/img/default-avatar.png'}
                  alt={u.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
                  onError={(e) => { e.target.src = '/img/logo.png'; }}
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{u.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 uppercase">
                      {u.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                  <div className="text-[11px] text-slate-500">{u.designation} • {u.specialization}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
