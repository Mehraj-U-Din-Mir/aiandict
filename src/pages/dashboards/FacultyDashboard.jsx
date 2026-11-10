import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  User, 
  FolderGit2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Plus, 
  Bell, 
  X,
  FileText
} from 'lucide-react';

export default function FacultyDashboard() {
  const { currentUser } = useAuth();
  const { projects, updateProjectStatus, addMessage } = useData();

  // Review modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewScore, setReviewScore] = useState(90);
  const [reviewGrade, setReviewGrade] = useState('A+');

  // Announcement modal state
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'Normal'
  });

  const openReviewModal = (proj) => {
    setSelectedProject(proj);
    setReviewStatus(proj.status || 'Approved');
    setReviewFeedback(proj.feedback || '');
    setReviewScore(proj.score || 90);
    setReviewGrade(proj.grade || 'A+');
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    updateProjectStatus(
      selectedProject.id,
      reviewStatus,
      reviewFeedback,
      Number(reviewScore),
      reviewGrade
    );
    setSelectedProject(null);
  };

  const handlePostMessage = (e) => {
    e.preventDefault();
    addMessage({
      ...newMsg,
      faculty_id: currentUser?.id || 3,
      faculty_name: currentUser?.name || 'Er. Mehraj U Din Mir'
    });
    setMsgModalOpen(false);
    setNewMsg({
      title: '',
      content: '',
      category: 'Announcement',
      priority: 'Normal'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Faculty Profile Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar_url || '/img/mehraj.png'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            onError={(e) => { e.target.src = '/img/logo.png'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{currentUser?.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                Faculty Advisor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.designation || 'Faculty Lecturer'}</p>
            <p className="text-xs text-indigo-300 font-medium mt-1">{currentUser?.specialization || 'AI & Machine Learning'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMsgModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Faculty Advisory Notice</span>
          </button>
        </div>
      </div>

      {/* Student Capstone Proposals Evaluation Table */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <span>Student Capstone Proposals Awaiting / Under Supervision</span>
          </h2>
          <p className="text-xs text-slate-400">Review abstracts, assign scores, and provide constructive feedback</p>
        </div>

        <div className="space-y-4">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
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
                  {proj.score && (
                    <span className="text-xs font-bold text-indigo-400 ml-2">
                      Score: {proj.score}/100 ({proj.grade})
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{proj.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{proj.abstract}</p>

                <div className="text-xs text-slate-500 pt-1">
                  Submitted by: <strong className="text-slate-300">{proj.student_name}</strong>
                  {proj.feedback && <span className="ml-3 italic text-indigo-300">Feedback: "{proj.feedback}"</span>}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => openReviewModal(proj)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Evaluate / Grade</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review & Grading Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Evaluate Student Capstone</h3>
                <p className="text-xs text-slate-400">{selectedProject.title}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Approval Status</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Needs Revision">Needs Revision</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Grade</label>
                  <select
                    value={reviewGrade}
                    onChange={(e) => setReviewGrade(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="O (Outstanding)">O (Outstanding - 95+)</option>
                    <option value="A+">A+ (Exemplary - 90-94)</option>
                    <option value="A">A (Very Good - 80-89)</option>
                    <option value="B+">B+ (Good - 70-79)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Overall Composite Score (0–100): <span className="text-indigo-400 font-bold">{reviewScore}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Supervisor Written Feedback & Rubric Notes *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide constructive feedback on methodology, dataset benchmark, or edge optimization..."
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Submit Official Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Advisory Notice Modal */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Post Faculty Advisory Notice</h3>
              <button
                onClick={() => setMsgModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostMessage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Capstone Phase 1 Evaluation Date"
                  value={newMsg.title}
                  onChange={(e) => setNewMsg({ ...newMsg, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newMsg.category}
                    onChange={(e) => setNewMsg({ ...newMsg, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Project Opportunity">Project Opportunity</option>
                    <option value="Research">Research Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newMsg.priority}
                    onChange={(e) => setNewMsg({ ...newMsg, priority: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Content *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detailed announcement for students..."
                  value={newMsg.content}
                  onChange={(e) => setNewMsg({ ...newMsg, content: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMsgModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
