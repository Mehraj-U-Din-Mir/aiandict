import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  ArrowRight, 
  FolderGit2, 
  Award,
  Sparkles,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  "All",
  "Computer Vision",
  "Robotics & Autonomous Systems",
  "Generative AI & LLMs",
  "Cyber & Quantum Systems",
  "IoT & Embedded AI"
];

export default function Projects() {
  const { projects } = useData();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCat = selectedCategory === "All" || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        project.title.toLowerCase().includes(q) ||
        project.abstract.toLowerCase().includes(q) ||
        project.tech_stack.toLowerCase().includes(q) ||
        (project.student_name && project.student_name.toLowerCase().includes(q));
      
      return matchesCat && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Department Project Archive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Student Capstone Projects
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore pioneering capstones, engineering prototypes, and research implementations developed by undergraduate researchers in the Department of AI & ICT.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by keyword, technology, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 text-slate-200 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Pills on Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/30 border border-slate-800/80 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Projects Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting the category filter.
          </p>
          <button
            onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {project.score && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {project.score}/100
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {project.grade || 'Approved'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {project.abstract}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-medium text-slate-500 mb-1.5">Technologies</div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/60 line-clamp-1">
                    {project.tech_stack}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Author</div>
                  <div className="text-xs text-slate-200 font-semibold">{project.student_name}</div>
                </div>

                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    to={`/project/${project.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center gap-1 transition-all"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

