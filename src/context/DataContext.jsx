import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialProjects,
  initialMessages,
  initialActivities,
  initialAchievements,
  initialClubShowcases,
  initialDocuments,
  initialClubRegistrations,
  initialParticipations,
  initialStudyMaterials
} from '../data/initialData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [messages, setMessages] = useState(initialMessages);
  const [activities, setActivities] = useState(initialActivities);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [clubShowcases, setClubShowcases] = useState(initialClubShowcases);
  const [documents, setDocuments] = useState(initialDocuments);
  const [clubRegistrations, setClubRegistrations] = useState(initialClubRegistrations);
  const [participations, setParticipations] = useState(initialParticipations);
  const [studyMaterials, setStudyMaterials] = useState(initialStudyMaterials);
  const [loading, setLoading] = useState(true);

  // ─── Fetch All Data from Supabase with Graceful Fallback ───────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: proj, error: projErr },
        { data: msg, error: msgErr },
        { data: act, error: actErr },
        { data: ach, error: achErr },
        { data: club, error: clubErr },
        { data: docs, error: docsErr },
        { data: reg, error: regErr },
        { data: part, error: partErr },
        { data: mats, error: matsErr }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('activities').select('*').order('date', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('achievements').select('*').order('date', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('innovation_club_showcases').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('departmental_documents').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('club_registrations').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('participations').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null })),
        supabase.from('study_materials').select('*').order('created_at', { ascending: false }).catch(() => ({ data: null }))
      ]);

      if (proj && proj.length > 0) {
        setProjects(proj.map(p => ({
          ...p,
          student_name: p.student_name || 'Student Researcher',
          faculty_name: p.faculty_name || 'Er. Mehraj U Din Mir'
        })));
      }
      if (msg && msg.length > 0) {
        setMessages(msg.map(m => ({
          ...m,
          faculty_name: m.faculty_name || 'Faculty Member'
        })));
      }
      if (act && act.length > 0) setActivities(act);
      if (ach && ach.length > 0) setAchievements(ach);
      if (club && club.length > 0) setClubShowcases(club);
      if (docs && docs.length > 0) setDocuments(docs);
      if (reg && reg.length > 0) {
        setClubRegistrations(reg.map(r => ({
          ...r,
          user_name: r.user_name || 'Registered Student',
          user_email: r.user_email || ''
        })));
      }
      if (part && part.length > 0) setParticipations(part);
      if (mats && mats.length > 0) {
        setStudyMaterials(mats.map(m => ({
          ...m,
          uploader_name: m.uploader_name || 'Department Faculty'
        })));
      }
    } catch (err) {
      console.warn('[DataContext] Notice: Using master default dataset:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Projects ───────────────────────────────────────────────────────
  const addProject = async (projectData) => {
    const newProj = {
      id: Date.now(),
      title: projectData.title,
      category: projectData.category || 'Artificial Intelligence',
      abstract: projectData.abstract,
      methodology: projectData.methodology || '',
      tech_stack: projectData.tech_stack || 'Python, PyTorch',
      github_url: projectData.github_url || '',
      demo_url: projectData.demo_url || '',
      student_id: projectData.student_id,
      student_name: projectData.student_name || 'Student Researcher',
      faculty_id: projectData.faculty_id || 3,
      faculty_name: projectData.faculty_name || 'Er. Mehraj U Din Mir',
      status: 'Pending',
      score: null,
      grade: 'Pending',
      feedback: '',
      is_featured: false,
      created_at: new Date().toISOString().split('T')[0]
    };

    // Try Supabase insert
    try {
      const { data } = await supabase.from('projects').insert([{
        title: newProj.title,
        category: newProj.category,
        abstract: newProj.abstract,
        methodology: newProj.methodology,
        tech_stack: newProj.tech_stack,
        github_url: newProj.github_url,
        demo_url: newProj.demo_url,
        student_id: newProj.student_id,
        faculty_id: newProj.faculty_id,
        status: 'Pending',
        is_featured: false
      }]).select().single();
      if (data) newProj.id = data.id;
    } catch (e) {}

    setProjects(prev => [newProj, ...prev]);
    return { success: true, project: newProj };
  };

  const updateProjectStatus = async (id, status, feedback = '', score = null, grade = null) => {
    try {
      await supabase.from('projects').update({
        status,
        feedback,
        score,
        grade
      }).eq('id', id);
    } catch (e) {}

    setProjects(prev => prev.map(p => {
      if (String(p.id) === String(id)) {
        return {
          ...p,
          status,
          feedback: feedback || p.feedback,
          score: score !== null ? score : p.score,
          grade: grade || p.grade
        };
      }
      return p;
    }));
  };

  const toggleProjectFeatured = async (id) => {
    const target = projects.find(p => String(p.id) === String(id));
    if (!target) return;
    const nextVal = !target.is_featured;

    try {
      await supabase.from('projects').update({ is_featured: nextVal }).eq('id', id);
    } catch (e) {}

    setProjects(prev => prev.map(p => String(p.id) === String(id) ? { ...p, is_featured: nextVal } : p));
  };

  const deleteProject = async (id) => {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {}

    setProjects(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  // ─── Messages ───────────────────────────────────────────────────────
  const addMessage = async (msgData) => {
    const newMsg = {
      id: Date.now(),
      faculty_id: msgData.faculty_id,
      faculty_name: msgData.faculty_name || 'Faculty Member',
      title: msgData.title,
      content: msgData.content,
      category: msgData.category || 'Announcement',
      priority: msgData.priority || 'Normal',
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      const { data } = await supabase.from('messages').insert([{
        faculty_id: newMsg.faculty_id,
        title: newMsg.title,
        content: newMsg.content,
        category: newMsg.category,
        priority: newMsg.priority,
        is_active: true
      }]).select().single();
      if (data) newMsg.id = data.id;
    } catch (e) {}

    setMessages(prev => [newMsg, ...prev]);
    return { success: true };
  };

  const deleteMessage = async (id) => {
    try {
      await supabase.from('messages').delete().eq('id', id);
    } catch (e) {}

    setMessages(prev => prev.filter(m => String(m.id) !== String(id)));
  };

  // ─── Club Registrations ─────────────────────────────────────────────
  const addClubRegistration = async (regData) => {
    const newReg = {
      id: Date.now(),
      user_id: regData.user_id || Date.now(),
      user_name: regData.user_name || 'Student Member',
      user_email: regData.user_email || '',
      year: regData.year || '3rd Year',
      interests: regData.interests || 'Artificial Intelligence',
      note: regData.note || '',
      status: 'Pending',
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      const { data } = await supabase.from('club_registrations').insert([{
        user_id: newReg.user_id,
        year: newReg.year,
        interests: newReg.interests,
        note: newReg.note,
        status: 'Pending'
      }]).select().single();
      if (data) newReg.id = data.id;
    } catch (e) {}

    setClubRegistrations(prev => [newReg, ...prev]);
    return { success: true, registration: newReg };
  };

  const updateClubRegistrationStatus = async (id, status) => {
    try {
      await supabase.from('club_registrations').update({ status }).eq('id', id);
    } catch (e) {}

    setClubRegistrations(prev => prev.map(r => String(r.id) === String(id) ? { ...r, status } : r));
  };

  // ─── Participations ─────────────────────────────────────────────────
  const addParticipation = async (partData) => {
    const newPart = {
      id: Date.now(),
      user_id: partData.user_id,
      user_name: partData.user_name || 'Participant',
      activity_id: partData.activity_id,
      activity_title: partData.activity_title || 'Department Activity',
      proof: partData.proof,
      notes: partData.notes || '',
      status: 'Pending',
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      await supabase.from('participations').insert([{
        user_id: newPart.user_id,
        activity_id: newPart.activity_id,
        proof: newPart.proof,
        notes: newPart.notes,
        status: 'Pending'
      }]);
    } catch (e) {}

    setParticipations(prev => [newPart, ...prev]);
    return { success: true };
  };

  const updateParticipationStatus = async (id, status) => {
    try {
      await supabase.from('participations').update({ status }).eq('id', id);
    } catch (e) {}

    setParticipations(prev => prev.map(p => String(p.id) === String(id) ? { ...p, status } : p));
  };

  // ─── Documents ──────────────────────────────────────────────────────
  const incrementDocumentDownload = async (id) => {
    setDocuments(prev => prev.map(d => {
      if (String(d.id) === String(id)) {
        const next = (d.downloads_count || 0) + 1;
        try {
          supabase.from('departmental_documents').update({ downloads_count: next }).eq('id', id);
        } catch (e) {}
        return { ...d, downloads_count: next };
      }
      return d;
    }));
  };

  // ─── Study Materials (Uploaded by Admin/Faculty -> Student Dashboard) ──
  const addStudyMaterial = async (matData) => {
    const newMat = {
      id: Date.now(),
      title: matData.title,
      subject: matData.subject || 'General AI',
      description: matData.description || '',
      file_url: matData.file_url,
      file_type: matData.file_type || 'pdf',
      target_class: matData.target_class || 'All',
      uploaded_by: matData.uploaded_by || 1,
      uploader_name: matData.uploader_name || 'Department Faculty',
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      const { data } = await supabase.from('study_materials').insert([{
        title: newMat.title,
        subject: newMat.subject,
        description: newMat.description,
        file_url: newMat.file_url,
        file_type: newMat.file_type,
        target_class: newMat.target_class,
        uploaded_by: newMat.uploaded_by
      }]).select().single();
      if (data) newMat.id = data.id;
    } catch (e) {}

    setStudyMaterials(prev => [newMat, ...prev]);
    return { success: true, material: newMat };
  };

  const deleteStudyMaterial = async (id) => {
    try {
      await supabase.from('study_materials').delete().eq('id', id);
    } catch (e) {}

    setStudyMaterials(prev => prev.filter(m => String(m.id) !== String(id)));
    return { success: true };
  };

  // Reset to initial seed
  const resetToDefaults = () => {
    setProjects(initialProjects);
    setMessages(initialMessages);
    setActivities(initialActivities);
    setAchievements(initialAchievements);
    setClubShowcases(initialClubShowcases);
    setDocuments(initialDocuments);
    setClubRegistrations(initialClubRegistrations);
    setParticipations(initialParticipations);
    setStudyMaterials(initialStudyMaterials);
    localStorage.removeItem('ai_ict_custom_users');
  };

  return (
    <DataContext.Provider value={{
      projects,
      messages,
      activities,
      achievements,
      clubShowcases,
      documents,
      clubRegistrations,
      participations,
      studyMaterials,
      loading,
      addProject,
      updateProjectStatus,
      toggleProjectFeatured,
      deleteProject,
      addMessage,
      deleteMessage,
      addClubRegistration,
      updateClubRegistrationStatus,
      addParticipation,
      updateParticipationStatus,
      incrementDocumentDownload,
      addStudyMaterial,
      deleteStudyMaterial,
      resetToDefaults,
      fetchAll
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
