import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Layers, 
  Terminal, 
  FileText, 
  Users, 
  Search, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Department Branding */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMobile}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AI & ICT Portal
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                GVEI Srinagar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              end
            >
              Home
            </NavLink>

            <NavLink 
              to="/projects" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              Projects
            </NavLink>

            <NavLink 
              to="/innovation-club" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              Club
            </NavLink>

            <NavLink 
              to="/ai-tools" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${isActive ? 'text-pink-400 bg-pink-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              AI Tools
            </NavLink>

            <NavLink 
              to="/virtual-lab" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              Virtual Lab
            </NavLink>

            <NavLink 
              to="/documents" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Docs
            </NavLink>

            <NavLink 
              to="/messages" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              Messages
            </NavLink>

            <NavLink 
              to="/activities" 
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              Activities
            </NavLink>

            <NavLink 
              to="/search" 
              className={({ isActive }) => `p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : ''}`}
              title="Search Portal"
            >
              <Search className="w-4 h-4" />
            </NavLink>
          </nav>

          {/* Desktop Right Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student'}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition-all group"
                >
                  <img 
                    src={currentUser.avatar_url || '/img/default-avatar.png'} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/50"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-indigo-400 capitalize font-medium -mt-0.5">
                      {role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/club-register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/20"
                >
                  Join Club
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/search"
              className="p-2 rounded-lg text-slate-400 hover:text-white"
              onClick={closeMobile}
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link to="/" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900">
            Home
          </Link>
          <Link to="/projects" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900">
            Projects
          </Link>
          <Link to="/innovation-club" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-purple-400 hover:bg-slate-900">
            AI Innovation Club
          </Link>
          <Link to="/ai-tools" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-pink-400 hover:bg-slate-900">
            AI Capstone Tools
          </Link>
          <Link to="/virtual-lab" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-900">
            Virtual Code Lab
          </Link>
          <Link to="/documents" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900">
            Department Documents & Syllabi
          </Link>
          <Link to="/messages" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900">
            Faculty Message Corner
          </Link>
          <Link to="/activities" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900">
            Activities & Hackathons
          </Link>

          <div className="pt-4 mt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student'}
                  onClick={closeMobile}
                  className="block w-full text-center py-2.5 px-4 rounded-xl font-semibold bg-indigo-600 text-white"
                >
                  My Dashboard ({role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center py-2 px-4 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="text-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-slate-200 border border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/club-register"
                  onClick={closeMobile}
                  className="text-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 text-white"
                >
                  Join Club
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
