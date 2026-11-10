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
  FileText
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { projects, addProject, clubRegistrations } = useData();

  const [modalOpen, setModalOpen] = useState(false);
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

  const myProjects = projects.filter(p => p.student_id === currentUser?.id || p.student_name === currentUser?.name);
  const myClubStatus = clubRegistrations.find(r => r.user_email === currentUser?.email);

  const handleCreateProject = (e) => {
    e.preventDefault();
    addProject({
      ...newProject,
      student_id: currentUser?.id || 6,
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
                Student
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
            to="/club-register"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>{myClubStatus ? `Club Status: ${myClubStatus.status}` : "Enroll in AI Club"}</span>
          </Link>
        </div>
      </div>

      {/* Capstone Proposals Table / Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <span>My Capstone Submissions ({myProjects.length})</span>
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

                  <div className="flex items-center gap-3">
                    {proj.score && (
                      <span className="text-xs font-bold text-indigo-400">
                        Score: {proj.score}/100
                      </span>
                    )}
                    {proj.grade && proj.grade !== 'Pending' && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-300">
                        Grade {proj.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{proj.abstract}</p>
                </div>

                {proj.feedback && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <span className="text-indigo-400 font-bold block mb-1">Supervisor Feedback:</span>
                    <p className="text-slate-300 italic">"{proj.feedback}"</p>
                    <span className="text-slate-500 text-[11px] block text-right mt-1">— {proj.faculty_name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Stack: {proj.tech_stack}
                  </span>
                  <Link
                    to={`/project/${proj.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Submit New Capstone Proposal</h3>
                <p className="text-xs text-slate-400">Department of AI & ICT • Session 2026–2027</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Capstone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Deep Learning Micro-UAV for Forest Fire Telemetry"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Research Domain *</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Faculty Supervisor *</label>
                  <select
                    value={newProject.faculty_name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const fid = name.includes('Mehraj') ? 3 : name.includes('Salman') ? 4 : 5;
                      setNewProject({ ...newProject, faculty_name: name, faculty_id: fid });
                    }}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Er. Mehraj U Din Mir">Er. Mehraj U Din Mir (HOD AI & ICT GVEI)</option>
                    <option value="Prof. Salman Ahmed">Prof. Salman Ahmed (Associate Professor)</option>
                    <option value="Engr. Zara Malik">Engr. Zara Malik (Assistant Professor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Executive Abstract *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Summarize the core technical problem, dataset, and target solution..."
                  value={newProject.abstract}
                  onChange={(e) => setNewProject({ ...newProject, abstract: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Methodology & Edge Architecture</label>
                <textarea
                  rows="2"
                  placeholder="e.g. TensorRT INT8 Quantization -> Zero-copy memory buffer -> Drone flight controller"
                  value={newProject.methodology}
                  onChange={(e) => setNewProject({ ...newProject, methodology: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tech Stack *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, PyTorch, YOLOv8, ROS2, Jetson Nano"
                  value={newProject.tech_stack}
                  onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Demo / Simulation URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Submit for Faculty Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
