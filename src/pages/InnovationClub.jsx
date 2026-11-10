import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Compass, 
  Sparkles, 
  Github, 
  ExternalLink, 
  ArrowRight, 
  Award, 
  Users, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';

export default function InnovationClub() {
  const { clubShowcases } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Club Hero */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>GVEI AI & Innovation Skill Club</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Incubating <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Pioneering Prototypes</span> & Deep Tech
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The official incubation hub for high-impact artificial intelligence, autonomous robotics, edge telemetry, and regional language models.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/club-register"
            className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/25 transition-all flex items-center gap-2"
          >
            <span>Register for AI Club</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#showcases"
            className="px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all"
          >
            Explore Showcases
          </a>
        </div>
      </div>

      {/* Leadership & Mentorship Spotlight */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Club Mentorship</span>
            <h3 className="text-xl font-bold text-white">Er. Mehraj U Din Mir</h3>
            <p className="text-xs text-indigo-300 font-medium">Head of Department AI & ICT</p>
            <p className="text-xs text-slate-400">Green Valley Educational Institute</p>
          </div>

          <div className="md:col-span-2 space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>
              "The AI Innovation Club is structured like an applied engineering skunkworks. We push students to transcend classroom theory by building production-grade autonomous drones, regional LLM tokenizers, and edge devices deployed directly into Kashmiri agriculture and disaster response."
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                Hardware-in-the-Loop Labs
              </span>
              <span className="px-3 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                Hackathon Incubation
              </span>
              <span className="px-3 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                Regional Impact Grants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Showcases */}
      <div id="showcases" className="space-y-8">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Live Deployments</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Club Prototype Showcases</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {clubShowcases.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="h-56 relative overflow-hidden bg-slate-950">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/img/club.jpg'; }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.abstract}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Lead Student:</span>
                    <strong className="text-slate-200">{item.lead_student}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mentor:</span>
                    <strong className="text-indigo-300">{item.mentor_name}</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 block mb-1">Architecture:</span>
                    <div className="font-mono text-xs text-slate-300 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                      {item.tech_stack}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
                    >
                      <Github className="w-4 h-4" />
                      <span>Codebase</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
