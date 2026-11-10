import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  X
} from 'lucide-react';

export default function Documents() {
  const { documents, incrementDocumentDownload } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);

  const categories = [
    'All',
    'Department Governance',
    'Curriculum & Syllabus',
    'Academic Guidelines',
    'Pedagogy & Teaching',
    'Lesson Plans & Practice',
    'Assessment & Evaluation',
    'Student Mentorship',
    'Innovation & Activities',
    'Lab Infrastructure',
    'Student Portfolios',
    'Faculty Development'
  ];

  const getDocUrl = (url) => {
    if (!url) return '#';
    // Normalize /static/docs/... to /docs/...
    if (url.startsWith('/static/docs/')) {
      return url.replace('/static/docs/', '/docs/');
    }
    return url;
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      doc.title.toLowerCase().includes(q) ||
      (doc.description && doc.description.toLowerCase().includes(q)) ||
      doc.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleDownload = (doc) => {
    incrementDocumentDownload(doc.id);
    const link = document.createElement('a');
    link.href = getDocUrl(doc.file_url);
    link.download = doc.file_name || `${doc.title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDoc = (doc) => {
    incrementDocumentDownload(doc.id);
    window.open(getDocUrl(doc.file_url), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Institutional Academic Repository</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Departmental Documents & Syllabi
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Official academic governance archives for the Department of AI & ICT, Green Valley Educational Institute (GVEI). Session 2026–2027.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {doc.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {doc.file_size}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1">{doc.version}</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {doc.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                {doc.downloads_count || 0} views / downloads
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors font-medium text-xs"
                  title="View Document in Modal"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="px-3.5 py-1.5 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Document Viewer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {previewDoc.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{previewDoc.version} • {previewDoc.file_size} • Uploaded by: {previewDoc.uploaded_by}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Embedded Viewer */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Institutional Overview:</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{previewDoc.description}</p>
              </div>

              {/* Embedded Document Frame */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <iframe
                  src={getDocUrl(previewDoc.file_url)}
                  title={previewDoc.title}
                  className="w-full h-[450px]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Official Department Archive • Verified GVEI Document
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDoc(previewDoc)}
                  className="px-4 py-2 rounded-xl font-semibold bg-slate-950 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open in New Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="px-4 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
