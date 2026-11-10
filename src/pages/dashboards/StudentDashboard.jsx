import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  FolderGit2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Award, 
  Compass, 
  ExternalLink, 
  Github,
  X,
  FileText,
  BookOpen,
  Download,
  Eye,
  Search,
  User,
  ShieldCheck,
  Terminal,
  Code2
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { projects, addProject, clubRegistrations, studyMaterials, labSubmissions } = useData();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'materials', 'submissions', 'club'
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [studyFilter, setStudyFilter] = useState('All');
  const [studySearch, setStudySearch] = useState('');

  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Computer Vision',
    abstract: '',
    methodology: '',
    tech_stack: 'Python, PyTorch, YOLOv8',
    github_url: '',
    demo_url: '',
    faculty_id: 3,
    faculty_name: 'Er. Mehraj U Din Mir'
  });

  const myProjects = projects.filter(p => 
    p.student_id === currentUser?.id || 
    (currentUser?.name && p.student_name?.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const myClubStatus = clubRegistrations.find(r => 
    r.user_email === currentUser?.email || 
    (currentUser?.name && r.user_name?.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const myLabSubmissions = labSubmissions.filter(s => 
    s.student_id === currentUser?.id || 
    (currentUser?.name && s.student_name?.toLowerCase().includes(currentUser.name.toLowerCase())) ||
    (currentUser?.email && s.student_email === currentUser.email)
  );

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await addProject({
      ...newProject,
      student_id: currentUser?.id || Date.now(),
      student_name: currentUser?.name || 'Student Researcher'
    });
    setModalOpen(false);
    setNewProject({
      title: '',
      category: 'Computer Vision',
      abstract: '',
      methodology: '',
      tech_stack: 'Python, PyTorch, YOLOv8',
      github_url: '',
      demo_url: '',
      faculty_id: 3,
      faculty_name: 'Er. Mehraj U Din Mir'
    });
  };

  const filteredMaterials = studyMaterials.filter(m => {
    const matchFilter = studyFilter === 'All' || m.subject === studyFilter || m.target_class === studyFilter;
    const q = studySearch.toLowerCase().trim();
    const matchQuery = !q || 
      m.title.toLowerCase().includes(q) || 
      (m.description && m.description.toLowerCase().includes(q)) ||
      m.subject.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  const subjects = ['All', ...Array.from(new Set(studyMaterials.map(m => m.subject)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Student Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar_url || '/img/students.jpg'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            onError={(e) => { e.target.src = '/img/students.jpg'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{currentUser?.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                Student Researcher
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser?.class_name || 'B.Tech AI & Data Science'} • Roll: {currentUser?.roll_no || 'AI-2024-042'}
            </p>
            <p className="text-xs text-indigo-300 font-medium mt-1">
              {currentUser?.specialization || 'Artificial Intelligence & Machine Learning'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Capstone Proposal</span>
          </button>

          <Link
            to="/virtual-lab"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-2 transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>Open Virtual Lab</span>
          </Link>

          <Link
            to="/club-register"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>{myClubStatus ? `Club: ${myClubStatus.status}` : "Enroll in AI Club"}</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          My Capstone Submissions ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'submissions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>My Lab Code Submissions ({myLabSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'materials' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Study Materials & Handouts ({studyMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('club')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'club' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Innovation Club Membership
        </button>
      </div>

      {/* TAB 1: Capstone Submissions */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <span>My Capstone Submissions</span>
              </h2>
              <p className="text-xs text-slate-400">Track faculty reviews, revisions, and grading scores</p>
            </div>
          </div>

          {myProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Proposals Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't submitted any capstone abstracts for the current session. Click below to draft your first submission.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                Submit Capstone Proposal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myProjects.map(proj => (
                <div
                  key={proj.id}
                  className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {proj.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        proj.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : proj.status === 'Needs Revision'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    {proj.score && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-indigo-300">
                        Score: {proj.score}/100 • Grade: {proj.grade}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.abstract}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex flex-wrap gap-4 text-slate-400">
                    <div>Supervisor: <strong className="text-slate-200">{proj.faculty_name}</strong></div>
                    <div>Tech Stack: <strong className="text-slate-200">{proj.tech_stack}</strong></div>
                    <div>Submitted: <strong className="text-slate-200">{proj.created_at}</strong></div>
                  </div>

                  {proj.feedback && (
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                      <span className="text-indigo-300 font-bold block mb-1">Supervisor Assessment Feedback:</span>
                      <p className="text-slate-200">{proj.feedback}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/project/${proj.id}`}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>View Full Project Overview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY LAB CODE SUBMISSIONS (Sent from Virtual Code Studio) */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>My Virtual Lab Code Submissions</span>
              </h2>
              <p className="text-xs text-slate-400">
                Programs you transmitted to faculty mentors directly from the Virtual Code Studio
              </p>
            </div>
            
            <Link
              to="/virtual-lab"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 w-fit"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Open Virtual Lab to Submit Code</span>
            </Link>
          </div>

          {myLabSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <Terminal className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Code Submissions Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't transmitted any code programs to a faculty mentor yet. Open the Virtual Code Studio to write your script and click "Send to Faculty".
              </p>
              <Link
                to="/virtual-lab"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                Go to Virtual Code Studio
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myLabSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {sub.language}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        sub.share_status === 'Reviewed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {sub.share_status}
                      </span>
                    </div>

                    {sub.faculty_grade && sub.faculty_grade !== 'Pending' && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-emerald-400">
                        Grade: {sub.faculty_grade}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{sub.title}</h3>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-wrap gap-4 text-slate-400">
                    <div>Assigned Mentor: <strong className="text-indigo-300">{sub.faculty_name}</strong></div>
                    <div>Submitted: <strong className="text-slate-300">{sub.submitted_at}</strong></div>
                  </div>

                  {sub.submission_notes && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="text-slate-500 block text-[11px] font-semibold mb-0.5">Your Question / Remark:</span>
                      "{sub.submission_notes}"
                    </div>
                  )}

                  {sub.faculty_feedback ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                      <span className="text-emerald-400 font-bold block">Supervisor Evaluation & Feedback:</span>
                      <p className="text-slate-200 leading-relaxed">{sub.faculty_feedback}</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 italic">
                      Awaiting supervisor review and grading remarks.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Study Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Department Study Materials & Lecture Handouts</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official notes, syllabus handbooks, and laboratory guides uploaded by department faculty
              </p>
            </div>
            
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes & topics..."
                value={studySearch}
                onChange={(e) => setStudySearch(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setStudyFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  studyFilter === s
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Study Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {mat.subject}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {mat.target_class}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {mat.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">By {mat.uploader_name}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {mat.created_at}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMaterial(mat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors font-medium text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>View</span>
                    </button>
                    <a
                      href={mat.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Club Membership */}
      {activeTab === 'club' && (
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">AI & Innovation Club Status</h3>
                <p className="text-xs text-slate-400">Department Incubation Cell • Mentored by Er. Mehraj U Din Mir</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
              myClubStatus?.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {myClubStatus?.status || 'Not Enrolled'}
            </span>
          </div>

          {myClubStatus ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div>Member: <strong className="text-white">{myClubStatus.user_name}</strong></div>
              <div>Academic Year: <strong className="text-white">{myClubStatus.year}</strong></div>
              <div>Focus Areas: <strong className="text-purple-300">{myClubStatus.interests}</strong></div>
              {myClubStatus.note && (
                <div>Statement: <span className="text-slate-400 italic">"{myClubStatus.note}"</span></div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <Compass className="w-10 h-10 text-purple-400 mx-auto" />
              <h4 className="text-base font-bold text-white">You have not applied for the AI Club yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Join our regional aerial robotics, LLM research cohorts, and competitive hackathon teams.
              </p>
              <Link
                to="/club-register"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white"
              >
                Register for Club
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Capstone Proposal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>Submit Capstone Proposal</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Capstone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Sign Language Real-Time Hand Landmark Translator"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
                    <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                    <option value="Cyber & Quantum Systems">Cyber & Quantum Systems</option>
                    <option value="IoT & Embedded AI">IoT & Embedded AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Faculty Supervisor</label>
                  <select
                    value={newProject.faculty_name}
                    onChange={(e) => setNewProject({ ...newProject, faculty_name: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Er. Mehraj U Din Mir">Er. Mehraj U Din Mir (HOD AI & ICT)</option>
                    <option value="Prof. Salman Ahmed">Prof. Salman Ahmed (IoT & Robotics)</option>
                    <option value="Engr. Zara Malik">Engr. Zara Malik (AI Ethics & LLMs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Abstract & Problem Statement *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the real-world regional or global challenge your proposal tackles..."
                  value={newProject.abstract}
                  onChange={(e) => setNewProject({ ...newProject, abstract: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposed Methodology & Architecture</label>
                <textarea
                  rows="2"
                  placeholder="Pipeline: Dataset collection -> Model Architecture -> Evaluation metrics..."
                  value={newProject.methodology}
                  onChange={(e) => setNewProject({ ...newProject, methodology: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tech Stack</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch, YOLOv8, MediaPipe, OpenCV, FastAPI"
                  value={newProject.tech_stack}
                  onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub Repo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Live Demo / Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Material Reader Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {previewMaterial.subject}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{previewMaterial.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Target: {previewMaterial.target_class} • Uploaded by: {previewMaterial.uploader_name}</p>
              </div>
              <button onClick={() => setPreviewMaterial(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-purple-400 font-semibold block mb-1">Handout Overview:</span>
                <p className="text-slate-200 leading-relaxed">{previewMaterial.description}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <iframe
                  src={previewMaterial.file_url}
                  title={previewMaterial.title}
                  className="w-full h-[450px]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400">Official Department Study Resource</span>
              <a
                href={previewMaterial.file_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Open / Download File</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
