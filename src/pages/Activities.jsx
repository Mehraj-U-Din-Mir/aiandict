import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Award, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

export default function Activities() {
  const { activities, addParticipation } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const openSubmitModal = (act) => {
    setSelectedActivity(act);
    setProofUrl('');
    setNotes('');
    setSuccessMsg('');
    setModalOpen(true);
  };

  const handleParticipationSubmit = (e) => {
    e.preventDefault();
    if (!proofUrl) return;

    addParticipation({
      user_id: currentUser?.id || 6,
      user_name: currentUser?.name || 'Student Participant',
      activity_id: selectedActivity.id,
      activity_title: selectedActivity.title,
      proof: proofUrl,
      notes: notes
    });

    setSuccessMsg('Participation proof submitted successfully for faculty verification!');
    setTimeout(() => {
      setModalOpen(false);
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Events, Workshops & Hackathons</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Department Activities
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore technical workshops, AI bootcamps, and competitive hackathons organized by the Department of AI & ICT at Green Valley Educational Institute.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map(act => (
          <div
            key={act.id}
            className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div>
              <div className="h-52 relative overflow-hidden bg-slate-950">
                <img
                  src={act.image_url}
                  alt={act.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/img/activity.jpg'; }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                  {act.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {act.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      {act.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-1">{act.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{act.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-800/80 mt-4">
              <button
                onClick={() => openSubmitModal(act)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Participation Proof</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Submit Participation</h3>
                <p className="text-xs text-slate-400">{selectedActivity?.title}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleParticipationSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Certificate / Evidence URL (Google Drive, Cloudinary, etc.) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Student Notes / Role (Optional)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="e.g. Lead presenter in Team Fikr, presented AI Orchard pipeline..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Submit for Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

