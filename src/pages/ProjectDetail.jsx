import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Calendar, 
  User, 
  Cpu, 
  FileText,
  Star
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useData();

  const project = projects.find(p => String(p.id) === String(id));

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <p className="text-slate-400 text-sm">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm">
          Back to Projects Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* Main Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            {project.score && (
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Score: {project.score}/100
              </span>
            )}
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Grade: {project.grade || 'Approved'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Author: <strong className="text-white">{project.student_name}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Supervisor: <strong className="text-white">{project.faculty_name}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Submitted: <strong className="text-white">{project.created_at || 'Session 2025-2026'}</strong></span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap gap-3 pt-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 hover:border-slate-500 text-white flex items-center gap-2 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Live Deployment / Prototype</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Abstract & Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Content */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Executive Abstract</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.abstract}
            </p>
          </div>

          {project.methodology && (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Technical Methodology & Architecture</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-mono bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                {project.methodology}
              </p>
            </div>
          )}

          {project.feedback && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supervisor Evaluation Feedback</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{project.feedback}"
              </p>
              <div className="text-right text-[11px] text-slate-500 font-medium">
                — {project.faculty_name}
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Technical Specs & Rubrics */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.split(',').map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-950 text-indigo-300 border border-slate-800"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Assessment Breakdown</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Novelty & Innovation</span>
                  <span className="font-bold text-indigo-400">{project.score_innovation || 9}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(project.score_innovation || 9) * 10}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Technical Execution</span>
                  <span className="font-bold text-purple-400">{project.score_technical || 9}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(project.score_technical || 9) * 10}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Presentation & Rigor</span>
                  <span className="font-bold text-pink-400">{project.score_presentation || 9}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(project.score_presentation || 9) * 10}%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

