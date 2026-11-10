import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Terminal, 
  Award, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  Users, 
  Cpu, 
  Compass, 
  FolderGit2,
  Bell,
  Code,
  GraduationCap,
  Mail,
  Phone
} from 'lucide-react';

export default function Home() {
  const { projects, achievements, messages, clubShowcases } = useData();
  const { faculty } = useAuth();

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const latestMessages = messages.slice(0, 2);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Green Valley Educational Institute • Session 2026–2027</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Pioneering <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">AI & Autonomous Systems</span> in the Valley
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Empowering student researchers, edge intelligence engineers, and roboticists through rigorous academic frameworks and hands-on capstone incubation.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/projects"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 group"
            >
              <span>Explore Student Capstones</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/ai-tools"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-lg shadow-black/20"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI Proposal Evaluator</span>
            </Link>

            <Link
              to="/virtual-lab"
              className="px-6 py-3.5 rounded-xl font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 transition-all flex items-center gap-2 shadow-lg"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Virtual Code Lab</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <div>
                <div className="text-3xl font-extrabold text-white">25+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Research Capstones</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-400">$50,000</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">AgroTech Grant</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-purple-400">1st Place</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">NIT AI Hackathon</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-pink-400">100%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Hands-On Curriculum</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOD Vision & Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-800 relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-36 h-36 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/20">
                  <img
                    src="/img/mehraj.png"
                    alt="Er. Mehraj U Din Mir"
                    className="w-full h-full object-cover rounded-[14px]"
                    onError={(e) => { e.target.src = '/img/logo.png'; }}
                  />
                </div>
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
                  HOD AI & ICT
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Er. Mehraj U Din Mir</h3>
              <p className="text-xs text-indigo-300 font-medium">Head of Department (AI & ICT, GVEI)</p>
              <p className="text-xs text-slate-400 mt-1">IP Lecturer & Lead AI/ML Trainer</p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Departmental Strategic Leadership</span>
              </div>
              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">
                "Our mission at Green Valley is to bridge the frontier between theoretical computational intelligence and applied regional problem-solving. From autonomous search-and-rescue UAVs to bilingual Kashmiri speech transformers, our students engineer solutions designed for global benchmarks and local resonance."
              </blockquote>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Computer Vision & Edge AI
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Autonomous Aerial Robotics
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  C.R.E.A.T.E. Academic Framework
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FACULTY & MENTORS DIRECTORY (Managed by Admin -> Displayed on Landing Page) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Department Mentorship & Academic Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Faculty & Supervisors</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Guiding student capstone research, publications, and competitive hackathon initiatives.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Faculty Registry</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((fac) => (
            <div
              key={fac.id}
              className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={fac.avatar_url || '/img/nousheen.png'}
                    alt={fac.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = '/img/logo.png'; }}
                  />
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {fac.designation || 'Faculty Member'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium">{fac.specialization}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {fac.bio || 'Dedicated researcher and academic guide at the AI & ICT Department, Green Valley Educational Institute.'}
                </p>

                {fac.qualification && (
                  <div className="text-[11px] text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 font-medium">Qualification:</span> {fac.qualification}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{fac.department || 'AI & ICT'}</span>
                </span>

                <div className="flex items-center gap-2">
                  {fac.email && (
                    <a
                      href={`mailto:${fac.email}`}
                      className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      title={fac.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {fac.phone && (
                    <a
                      href={`tel:${fac.phone}`}
                      className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      title={fac.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-4 h-4" />
              <span>Exemplar Student Research</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Capstone Projects</h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {project.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Grade {project.grade}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {project.abstract}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-medium text-slate-500 mb-1.5">Tech Stack</div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/60">
                    {project.tech_stack}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  By <span className="text-slate-200 font-medium">{project.student_name}</span>
                </div>
                <Link
                  to={`/project/${project.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Achievements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Competitive Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Department Milestones & Honors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-purple-500/40 transition-all flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={ach.image_url} 
                  alt={ach.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/img/nit.jpg'; }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30">
                  {ach.badge}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1">{ach.date}</div>
                  <h3 className="text-base font-bold text-white">{ach.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{ach.description}</p>
                </div>
                <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Verified Department Achievement</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message Corner Preview & Quick Lab Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Faculty Message Corner */}
          <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <Bell className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Faculty Message Corner</h3>
              </div>
              <Link to="/messages" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {latestMessages.map(msg => (
                <div key={msg.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{msg.faculty_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {msg.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{msg.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tools Callout */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Department Accelerators</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Interactive Research & Learning Engines</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Utilize our proprietary AI Capstone Proposal Reviewer, Project Idea Synthesizer, and in-browser Code Laboratory with live execution.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                to="/ai-tools"
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-pink-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <Sparkles className="w-5 h-5 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">AI Tools</div>
                <div className="text-[11px] text-slate-400">Proposal evaluation & generation</div>
              </Link>

              <Link
                to="/virtual-lab"
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <Terminal className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">Virtual Lab</div>
                <div className="text-[11px] text-slate-400">In-browser code runtime</div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Innovation Club Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>GVEI AI & Innovation Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Join the Next Generation of Innovators</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Work with mentor Er. Mehraj U Din Mir, collaborate on real-world aerial robotics, language models, and represent GVEI in national hackathons.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/innovation-club"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-center"
            >
              Explore Club
            </Link>
            <Link
              to="/club-register"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/25 text-center"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
