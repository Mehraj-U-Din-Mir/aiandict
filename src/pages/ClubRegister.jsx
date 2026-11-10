import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Cpu,
  Loader2
} from 'lucide-react';

export default function ClubRegister() {
  const { currentUser, isAuthenticated } = useAuth();
  const { addClubRegistration } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    year: '3rd Year',
    interests: '',
    note: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        user_name: currentUser.name || '',
        user_email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.user_name || !formData.user_email || !formData.interests) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await addClubRegistration({
        user_id: currentUser?.id || Date.now(),
        user_name: formData.user_name,
        user_email: formData.user_email,
        year: formData.year,
        interests: formData.interests,
        note: formData.note
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to record club registration. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI & Innovation Club Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Session 2026–2027 • Supervised by Er. Mehraj U Din Mir (HOD AI & ICT GVEI)
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Application Received!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your registration for the AI & Innovation Club has been recorded in the database. The faculty advisor committee will review your submission and contact you via your institutional email.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/innovation-club"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                Back to Club
              </Link>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
              >
                Home Portal
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zubair Ahmad"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Institutional Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. student@dept.ai"
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Current Academic Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior Capstone)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Core Technical Interests *</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous Drones, YOLOv8, PyTorch, LoRA, ROS2"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Statement of Purpose / Past Projects</label>
              <textarea
                rows="3"
                placeholder="Briefly describe what you aim to build or research in the club..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20 text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <span>Submit Club Application</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
