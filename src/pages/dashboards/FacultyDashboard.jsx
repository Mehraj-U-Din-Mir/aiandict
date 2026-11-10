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
  FileText, 
  Upload, 
  BookOpen, 
  Trash2, 
  Download,
  Terminal,
  Code2,
  Send,
  Eye,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function FacultyDashboard() {
  const { currentUser } = useAuth();
  const { 
    projects, 
    updateProjectStatus, 
    addMessage, 
    studyMaterials, 
    addStudyMaterial, 
    deleteStudyMaterial,
    labSubmissions,
    reviewLabSubmission
  } = useData();

  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals', 'submissions', 'study'

  // Capstone Review modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewScore, setReviewScore] = useState(90);
  const [reviewGrade, setReviewGrade] = useState('A+');

  // Lab Code Submission Review Modal State
  const [selectedLabSub, setSelectedLabSub] = useState(null);
  const [labFeedback, setLabFeedback] = useState('');
  const [labGrade, setLabGrade] = useState('A+');
  const [labStatus, setLabStatus] = useState('Reviewed');
  const [labSuccessMsg, setLabSuccessMsg] = useState('');

  // Announcement modal state
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'Normal'
  });

  // Study Material modal state
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    subject: 'Artificial Intelligence',
    target_class: 'B.Tech AI 3rd Year',
    description: '',
    file_url: '/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
    file_type: 'pdf'
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

  const openLabReviewModal = (sub) => {
    setSelectedLabSub(sub);
    setLabFeedback(sub.faculty_feedback || '');
    setLabGrade(sub.faculty_grade && sub.faculty_grade !== 'Pending' ? sub.faculty_grade : 'A+');
    setLabStatus(sub.share_status || 'Reviewed');
    setLabSuccessMsg('');
  };

  const handleSaveLabReview = async (e) => {
    e.preventDefault();
    if (!selectedLabSub) return;

    await reviewLabSubmission(selectedLabSub.id, labFeedback, labGrade, labStatus);
    setLabSuccessMsg('Evaluation and feedback successfully saved for the student!');
    setTimeout(() => {
      setSelectedLabSub(null);
      setLabSuccessMsg('');
    }, 1500);
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

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialForm.title || !materialForm.file_url) return;

    await addStudyMaterial({
      ...materialForm,
      uploaded_by: currentUser?.id || 3,
      uploader_name: currentUser?.name || 'Faculty Mentor'
    });
    setMaterialModalOpen(false);
    setMaterialForm({
      title: '',
      subject: 'Artificial Intelligence',
      target_class: 'B.Tech AI 3rd Year',
      description: '',
      file_url: '/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
      file_type: 'pdf'
    });
  };

  // Filter lab submissions sent to this faculty (or show all if admin)
  const myLabSubmissions = labSubmissions.filter(s => 
    s.shared_faculty_id === currentUser?.id || 
    currentUser?.role === 'admin' || 
    (currentUser?.name && s.faculty_name?.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

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
            onClick={() => setMaterialModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Study Material</span>
          </button>
          <button
            onClick={() => setMsgModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Faculty Advisory Notice</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'proposals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Capstone Proposals ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'submissions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Student Lab Code Submissions ({myLabSubmissions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'study' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Study Materials Management ({studyMaterials.length})
        </button>
      </div>

      {/* TAB 1: Proposals Evaluation Table */}
      {activeTab === 'proposals' && (
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
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">
                        Score: {proj.score}/100 ({proj.grade})
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{proj.abstract}</p>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
                    <span>Student: <strong className="text-slate-300">{proj.student_name}</strong></span>
                    <span>Stack: <strong className="text-slate-300">{proj.tech_stack}</strong></span>
                  </div>

                  {proj.feedback && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mt-2">
                      <span className="text-indigo-400 font-semibold block mb-0.5">Your Feedback:</span>
                      {proj.feedback}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => openReviewModal(proj)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
                  >
                    Evaluate & Grade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT LAB CODE SUBMISSIONS (Sent via Virtual Code Studio) */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Student Lab Code Submissions for Your Supervision</span>
            </h2>
            <p className="text-xs text-slate-400">
              Review code files transmitted by students from the Virtual Code Lab, analyze implementation logic, and record academic evaluations.
            </p>
          </div>

          {myLabSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Code Programs Received Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When students write and transmit their Python, Web App, or Algorithm programs to you from the Virtual Lab, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myLabSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {sub.language || 'python'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        sub.share_status === 'Reviewed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {sub.share_status}
                      </span>
                      {sub.faculty_grade && sub.faculty_grade !== 'Pending' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200">
                          Grade: {sub.faculty_grade}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{sub.title}</h3>

                    <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-0.5">
                      <span>Submitted By: <strong className="text-slate-200">{sub.student_name}</strong> ({sub.student_email})</span>
                      <span>Assigned Faculty: <strong className="text-slate-200">{sub.faculty_name}</strong></span>
                      <span>Date: <strong className="text-slate-300">{sub.submitted_at}</strong></span>
                    </div>

                    {sub.submission_notes && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                        <span className="text-slate-500 font-semibold block mb-0.5">Student Note:</span>
                        "{sub.submission_notes}"
                      </div>
                    )}

                    {sub.faculty_feedback && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200">
                        <span className="text-emerald-400 font-semibold block mb-0.5">Your Recorded Evaluation:</span>
                        {sub.faculty_feedback}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => openLabReviewModal(sub)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Code & Grade</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Study Materials Management */}
      {activeTab === 'study' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Department Study Materials & Handouts</span>
              </h2>
              <p className="text-xs text-slate-400">Manage lecture notes and laboratory guides distributed to students</p>
            </div>
            <button
              onClick={() => setMaterialModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Handout</span>
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
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{m.description}</p>
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

      {/* ========================================================================= */}
      {/* MODAL: INSPECT STUDENT CODE & RECORD EVALUATION */}
      {/* ========================================================================= */}
      {selectedLabSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {selectedLabSub.language}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedLabSub.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Student: <strong className="text-slate-200">{selectedLabSub.student_name}</strong> • Submitted: {selectedLabSub.submitted_at}
                </p>
              </div>
              <button onClick={() => setSelectedLabSub(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              
              {selectedLabSub.submission_notes && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-1">Student Notes & Context:</span>
                  <p className="text-slate-200 italic">"{selectedLabSub.submission_notes}"</p>
                </div>
              )}

              {/* Code Viewer */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Program Code Body:</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(selectedLabSub.code_content)}
                    className="hover:text-white flex items-center gap-1"
                  >
                    <span>Copy Code</span>
                  </button>
                </div>
                <div className="bg-black/80 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 max-h-[280px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {selectedLabSub.code_content || '// No code content available'}
                </div>
              </div>

              {/* Evaluation Form */}
              <form onSubmit={handleSaveLabReview} className="space-y-4 pt-2 border-t border-slate-800 text-xs">
                {labSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{labSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Evaluation Status</label>
                    <select
                      value={labStatus}
                      onChange={(e) => setLabStatus(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Reviewed">Reviewed & Approved</option>
                      <option value="Needs Revision">Needs Revision</option>
                      <option value="Submitted">Pending Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Grade Assigned</label>
                    <select
                      value={labGrade}
                      onChange={(e) => setLabGrade(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="O (Outstanding)">O (Outstanding)</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supervisor Technical Remarks / Feedback</label>
                  <textarea
                    rows="3"
                    value={labFeedback}
                    onChange={(e) => setLabFeedback(e.target.value)}
                    placeholder="Provide constructive feedback, algorithm analysis, optimization suggestions, or next steps..."
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLabSub(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                  >
                    Save & Return to Student
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Capstone Review Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Evaluate Student Capstone</h3>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-200">{selectedProject.title}</div>
              <div className="text-slate-400">By: {selectedProject.student_name}</div>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Verdict</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Needs Revision">Needs Revision</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Grade</label>
                  <select
                    value={reviewGrade}
                    onChange={(e) => setReviewGrade(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="O (Outstanding)">O (Outstanding)</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Supervisor Written Feedback</label>
                <textarea
                  rows="3"
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Provide technical feedback, requested architectural revisions, or defense guidance..."
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advisory Notice Modal */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <span>Post Department Advisory Notice</span>
              </h3>
              <button onClick={() => setMsgModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostMessage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Capstone Synopsis Defense"
                  value={newMsg.title}
                  onChange={(e) => setNewMsg({ ...newMsg, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newMsg.category}
                    onChange={(e) => setNewMsg({ ...newMsg, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Project Opportunity">Project Opportunity</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Deadline Alert">Deadline Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newMsg.priority}
                    onChange={(e) => setNewMsg({ ...newMsg, priority: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Content</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detailed instructions for students..."
                  value={newMsg.content}
                  onChange={(e) => setNewMsg({ ...newMsg, content: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMsgModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Material Modal */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                <span>Upload Study Handout for Students</span>
              </h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Handout Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Manual: Jetson Edge Deployment"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={materialForm.subject}
                    onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Class</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Document Link / Path *</label>
                <input
                  type="text"
                  required
                  value={materialForm.file_url}
                  onChange={(e) => setMaterialForm({ ...materialForm, file_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brief Description</label>
                <textarea
                  rows="2"
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
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
