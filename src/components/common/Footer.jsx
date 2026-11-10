import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Department Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold tracking-tight text-base">Department of AI & ICT</h4>
                <p className="text-xs text-slate-400">Green Valley Educational Institute</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Pioneering artificial intelligence education, autonomous aerial robotics, computer vision, and high-impact student innovation in Kashmir.
            </p>
            <div className="pt-2 text-xs flex items-center gap-2 text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>C.R.E.A.T.E. Competency Framework 2026–2027</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Portal Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/projects" className="hover:text-indigo-400 transition-colors">Student Capstone Projects</Link>
              </li>
              <li>
                <Link to="/innovation-club" className="hover:text-purple-400 transition-colors">AI & Innovation Club</Link>
              </li>
              <li>
                <Link to="/ai-tools" className="hover:text-pink-400 transition-colors">AI Proposal Evaluator & Idea Generator</Link>
              </li>
              <li>
                <Link to="/virtual-lab" className="hover:text-emerald-400 transition-colors">Interactive Virtual Code Lab</Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-indigo-400 transition-colors">Curriculum & Action Frameworks</Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-indigo-400 transition-colors">Faculty Advisory Board</Link>
              </li>
            </ul>
          </div>

          {/* Academic Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Role Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/login?role=student" className="hover:text-indigo-400 transition-colors">Student Login & Project Submission</Link>
              </li>
              <li>
                <Link to="/login?role=faculty" className="hover:text-indigo-400 transition-colors">Faculty Proposal Evaluation Corner</Link>
              </li>
              <li>
                <Link to="/login?role=admin" className="hover:text-indigo-400 transition-colors">HOD & Administrative Governance</Link>
              </li>
              <li>
                <Link to="/club-register" className="hover:text-purple-400 transition-colors">AI Skill Club Enrollment Form</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-indigo-400 transition-colors">Global Academic Search Index</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Governance */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Department Office</h4>
            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>AI Compute Wing, Green Valley Educational Institute (GVEI), Ellahi Bagh, Buchpora, Srinagar, J&K — 190020</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>adminaiict@gvei.com / mehraj@dept.ai</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>+91-94190-00000</span>
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Department Head: <span className="text-slate-200 font-medium">Er. Mehraj U Din Mir</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Department of AI & ICT, Green Valley Educational Institute (GVEI). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">React Architecture v2.0</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Academic Cloud
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

