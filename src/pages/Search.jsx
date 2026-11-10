import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Search as SearchIcon, 
  FolderGit2, 
  FileText, 
  Compass, 
  Bell, 
  Award, 
  ArrowRight,
  Layers
} from 'lucide-react';

export default function Search() {
  const { projects, documents, messages, achievements, clubShowcases } = useData();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedProjects = !q ? [] : projects.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.abstract.toLowerCase().includes(q) ||
    p.tech_stack.toLowerCase().includes(q)
  );

  const matchedDocs = !q ? [] : documents.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q)
  );

  const matchedClub = !q ? [] : clubShowcases.filter(c => 
    c.title.toLowerCase().includes(q) ||
    c.abstract.toLowerCase().includes(q) ||
    c.tech_stack.toLowerCase().includes(q)
  );

  const matchedMessages = !q ? [] : messages.filter(m => 
    m.title.toLowerCase().includes(q) ||
    m.content.toLowerCase().includes(q)
  );

  const totalResults = matchedProjects.length + matchedDocs.length + matchedClub.length + matchedMessages.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <SearchIcon className="w-3.5 h-3.5" />
          <span>Universal Index</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Global Academic Search
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Instantly search across capstone repositories, official curriculum documents, faculty announcements, and innovation club prototypes.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          placeholder="Type to search (e.g. YOLOv8, autonomous drone, curriculum, syllabus, grant)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-base pl-12 pr-4 py-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-xl"
        />
      </div>

      {q && (
        <div className="text-xs text-slate-400">
          Found <strong className="text-white">{totalResults}</strong> result{totalResults === 1 ? '' : 's'} matching "{query}"
        </div>
      )}

      {/* Results Sections */}
      {q && totalResults === 0 && (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Results Found</h3>
          <p className="text-xs text-slate-400">Try searching with broader terms like 'AI', 'computer vision', or 'framework'.</p>
        </div>
      )}

      <div className="space-y-8">
        
        {/* Projects */}
        {matchedProjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" />
              <span>Capstone Projects ({matchedProjects.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedProjects.map(p => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{p.category}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.abstract}</p>
                  </div>
                  <div className="text-xs text-indigo-400 flex items-center gap-1 font-semibold pt-2">
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {matchedDocs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Departmental Documents ({matchedDocs.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedDocs.map(d => (
                <Link
                  key={d.id}
                  to="/documents"
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2 group"
                >
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{d.category}</span>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">{d.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{d.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Club Showcases */}
        {matchedClub.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>AI Club Showcases ({matchedClub.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedClub.map(c => (
                <Link
                  key={c.id}
                  to="/innovation-club"
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-2 group"
                >
                  <span className="text-[10px] font-bold text-purple-400 uppercase">{c.category}</span>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-0.5">{c.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.abstract}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
