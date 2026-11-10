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
  BookOpen,
  Plus,
  X,
  FileText,
  Download,
  GraduationCap,
  Mail,
  Phone,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, users, faculty, addFaculty, deleteUser } = useAuth();
  const { 
    projects, 
    toggleProjectFeatured, 
    deleteProject, 
    clubRegistrations, 
    updateClubRegistrationStatus,
    studyMaterials,
    addStudyMaterial,
    deleteStudyMaterial,
    resetToDefaults 
  } = useData();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'faculty', 'study', 'club', 'users'

  // Add Faculty Modal
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    designation: 'Assistant Professor',
    department: 'AI & ICT Department, GVEI',
    specialization: 'Artificial Intelligence & Machine Learning',
    qualification: 'M.Tech in Computer Science',
    experience: '5+ Years',
    phone: '+91-94190-00000',
    avatar_url: '/img/nousheen.png',
    bio: '',
    linkedin_url: '',
    github_url: ''
  });
  const [facultyError, setFacultyError] = useState('');

  // Add Study Material Modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    subject: 'Deep Learning',
    target_class: 'B.Tech AI 3rd Year',
    description: '',
    file_url: '/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
    file_type: 'pdf'
  });
  const [materialError, setMaterialError] = useState('');

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setFacultyError('');
    if (!facultyForm.name || !facultyForm.email) {
      setFacultyError('Faculty Name and Email are required.');
      return;
    }
    const res = await addFaculty(facultyForm);
    if (!res.success) {
      setFacultyError(res.error || 'Failed to add faculty.');
    } else {
      setFacultyModalOpen(false);
      setFacultyForm({
        name: '',
        email: '',
        designation: 'Assistant Professor',
        department: 'AI & ICT Department, GVEI',
        specialization: 'Artificial Intelligence & Machine Learning',
        qualification: 'M.Tech in Computer Science',
        experience: '5+ Years',
        phone: '+91-94190-00000',
        avatar_url: '/img/nousheen.png',
        bio: '',
        linkedin_url: '',
        github_url: ''
      });
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setMaterialError('');
    if (!materialForm.title || !materialForm.file_url) {
      setMaterialError('Title and Document URL are required.');
      return;
    }
    await addStudyMaterial({
      ...materialForm,
      uploaded_by: currentUser?.id || 1,
      uploader_name: currentUser?.name || 'Admin Administrator'
    });
    setMaterialModalOpen(false);
    setMaterialForm({
      title: '',
      subject: 'Deep Learning',
      target_class: 'B.Tech AI 3rd Year',
      description: '',
      file_url: '/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
      file_type: 'pdf'
    });
  };

  const studentCount = users.filter(u => u.role === 'student').length;
  const facultyCount = faculty.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar_url || '/img/mehraj.png'}
            alt="HOD Admin"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            onError={(e) => { e.target.src = '/img/logo.png'; }}
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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFacultyModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Faculty</span>
          </button>
          <button
            onClick={() => setMaterialModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Study Material</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Reset records back to initial master seed defaults?")) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Reset master defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Defaults</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Projects</div>
          <div className="text-3xl font-extrabold text-white mt-2">{projects.length}</div>
          <div className="text-[11px] text-indigo-400 mt-1">{projects.filter(p => p.is_featured).length} Featured on Home</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Faculty Mentors</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{facultyCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active Supervisors</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Study Materials</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-2">{studyMaterials.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Available for Students</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Club Registrations</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">{clubRegistrations.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">{clubRegistrations.filter(r => r.status === 'Approved').length} Approved</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Registered Students</div>
          <div className="text-3xl font-extrabold text-pink-400 mt-2">{studentCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Undergraduate Cohort</div>
        </div>
      </div>

      {/* Governance Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Manage Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'faculty' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Faculty Directory ({faculty.length})
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'study' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Study Materials ({studyMaterials.length})
          </button>
          <button
            onClick={() => setActiveTab('club')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'club' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Club Enrollments ({clubRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            All Users Directory ({users.length})
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
                        Featured on Home
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

        {/* TAB 2: Faculty Directory & Management */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Faculty Members & Supervisors</h3>
                <p className="text-xs text-slate-400">Add or manage faculty displayed on the main landing page and portal directory</p>
              </div>
              <button
                onClick={() => setFacultyModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map(f => (
                <div key={f.id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={f.avatar_url || '/img/nousheen.png'}
                      alt={f.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                      onError={(e) => { e.target.src = '/img/logo.png'; }}
                    />
                    <div className="flex-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {f.designation}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{f.name}</h4>
                      <p className="text-xs text-indigo-400">{f.specialization}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {f.bio || 'Department faculty supervisor.'}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-800 pt-3">
                    <div>Email: <strong className="text-slate-300">{f.email}</strong></div>
                    <div>Qualification: <strong className="text-slate-300">{f.qualification || 'M.Tech / Ph.D'}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Live on Landing Page
                    </span>
                    {f.role !== 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove faculty member ${f.name}?`)) {
                            deleteUser(f.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Study Materials (Uploaded by Admin/Faculty -> Student Dashboard) */}
        {activeTab === 'study' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Study Materials & Lecture Repositories</h3>
                <p className="text-xs text-slate-400">Uploaded by faculty and administrator for undergraduate students</p>
              </div>
              <button
                onClick={() => setMaterialModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New Material</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map(m => (
                <div key={m.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {m.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {m.target_class}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{m.description}</p>
                    <div className="text-[11px] text-slate-500">
                      Uploaded by: <span className="text-slate-300">{m.uploader_name}</span> • {m.created_at}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 text-indigo-400 hover:text-white border border-slate-800"
                      title="Open Document"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm(`Delete study material "${m.title}"?`)) {
                          deleteStudyMaterial(m.id);
                        }
                      }}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Club Registrations */}
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

        {/* TAB 5: Users */}
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

      {/* ========================================================================= */}
      {/* MODAL 1: ADD FACULTY (SQL Persisted -> Live on Landing Page) */}
      {/* ========================================================================= */}
      {facultyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span>Add Department Faculty Member</span>
              </h3>
              <button
                onClick={() => setFacultyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {facultyError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{facultyError}</span>
              </div>
            )}

            <form onSubmit={handleAddFaculty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Aabid Hussain"
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aabid@dept.ai"
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={facultyForm.designation}
                    onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    value={facultyForm.specialization}
                    onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    value={facultyForm.qualification}
                    onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={facultyForm.phone}
                    onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Biography & Research Mentorship Focus</label>
                <textarea
                  rows="2"
                  placeholder="Summary of research areas, projects mentored, and teaching philosophy..."
                  value={facultyForm.bio}
                  onChange={(e) => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFacultyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Save & Publish to Landing Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPLOAD STUDY MATERIAL */}
      {/* ========================================================================= */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                <span>Upload Study Material for Students</span>
              </h3>
              <button
                onClick={() => setMaterialModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {materialError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{materialError}</span>
              </div>
            )}

            <form onSubmit={handleAddMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4: Computer Vision Backbones & Quantization"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Area</label>
                  <input
                    type="text"
                    required
                    value={materialForm.subject}
                    onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Class / Cohort</label>
                  <select
                    value={materialForm.target_class}
                    onChange={(e) => setMaterialForm({ ...materialForm, target_class: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All Students</option>
                    <option value="B.Tech AI 1st Year">B.Tech AI 1st Year</option>
                    <option value="B.Tech AI 2nd Year">B.Tech AI 2nd Year</option>
                    <option value="B.Tech AI 3rd Year">B.Tech AI 3rd Year</option>
                    <option value="B.Tech AI 4th Year">B.Tech AI 4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">File URL / Download Path *</label>
                <input
                  type="text"
                  required
                  value={materialForm.file_url}
                  onChange={(e) => setMaterialForm({ ...materialForm, file_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Syllabus Scope</label>
                <textarea
                  rows="2"
                  placeholder="Outline key topics covered in this material..."
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20"
                >
                  Upload for Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
