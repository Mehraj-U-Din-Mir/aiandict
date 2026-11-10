import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogIn, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Loader2
} from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, quickLoginAs, isAuthenticated, role } = useAuth();

  const initialRole = searchParams.get('role') || 'student';
  const [activeTab, setActiveTab] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'faculty') navigate('/faculty');
      else navigate('/student');
    }
  }, [isAuthenticated, role, navigate]);

  // Set default demo email when tab changes
  useEffect(() => {
    if (activeTab === 'admin') {
      setEmail('adminaiict@gvei.com');
      setPassword('Admin@gveiAIICT@Mehraj123');
    } else if (activeTab === 'faculty') {
      setEmail('mehraj@dept.ai');
      setPassword('faculty123');
    } else {
      setEmail('student@dept.ai');
      setPassword('student123');
    }
    setError('');
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password, activeTab);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'faculty') navigate('/faculty');
        else navigate('/student');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (roleTarget) => {
    setSubmitting(true);
    setError('');
    try {
      const user = await quickLoginAs(roleTarget);
      if (user) {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'faculty') navigate('/faculty');
        else navigate('/student');
      } else {
        setError(`Unable to quick-switch to ${roleTarget}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Department Access Portal</h1>
          <p className="text-xs text-slate-400">Select your role to sign into your academic dashboard</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'faculty' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In as {activeTab.toUpperCase()}</span>
            )}
          </button>
        </form>

        {/* 1-Click Quick Fill Demo Button */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-500 text-center">Fast Demo Testing:</div>
          <button
            type="button"
            onClick={() => handleQuickLogin(activeTab)}
            disabled={submitting}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/40 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Demo Sign-In as {activeTab}</span>
          </button>
        </div>

        {activeTab === 'student' && (
          <div className="text-center text-xs text-slate-400 pt-1">
            New student researcher?{' '}
            <Link to="/student/register" className="text-indigo-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
