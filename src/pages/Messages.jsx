import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Bell, 
  MessageSquare, 
  User, 
  Calendar, 
  AlertTriangle, 
  Sparkles,
  Info
} from 'lucide-react';

export default function Messages() {
  const { messages } = useData();
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Announcement", "Advisory", "Project Opportunity"];

  const filtered = filter === "All" 
    ? messages 
    : messages.filter(m => m.category === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          <span>Department Communications</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Faculty Message Corner
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Official advisories, capstone submission deadlines, research opportunities, and academic notices published directly by departmental faculty.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === cat
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-6">
        {filtered.map(msg => (
          <div
            key={msg.id}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {msg.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  msg.priority === 'Urgent'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : msg.priority === 'Important'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {msg.priority} Priority
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{msg.created_at || 'Autumn Session'}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white">{msg.title}</h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {msg.content}
            </p>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Published by: <strong className="text-slate-200">{msg.faculty_name}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

