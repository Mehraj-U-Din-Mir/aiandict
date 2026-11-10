import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProjects,
  initialAchievements,
  initialMessages,
  initialActivities,
  initialClubShowcases,
  initialDocuments,
  initialClubRegistrations,
  initialParticipations
} from '../data/initialData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_activities');
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_achievements');
      return saved ? JSON.parse(saved) : initialAchievements;
    } catch {
      return initialAchievements;
    }
  });

  const [clubShowcases, setClubShowcases] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_club_showcases');
      return saved ? JSON.parse(saved) : initialClubShowcases;
    } catch {
      return initialClubShowcases;
    }
  });

  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_documents');
      return saved ? JSON.parse(saved) : initialDocuments;
    } catch {
      return initialDocuments;
    }
  });

  const [clubRegistrations, setClubRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_club_registrations');
      return saved ? JSON.parse(saved) : initialClubRegistrations;
    } catch {
      return initialClubRegistrations;
    }
  });

  const [participations, setParticipations] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_participations');
      return saved ? JSON.parse(saved) : initialParticipations;
    } catch {
      return initialParticipations;
    }
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('ai_ict_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('ai_ict_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('ai_ict_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('ai_ict_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('ai_ict_club_showcases', JSON.stringify(clubShowcases)); }, [clubShowcases]);
  useEffect(() => { localStorage.setItem('ai_ict_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('ai_ict_club_registrations', JSON.stringify(clubRegistrations)); }, [clubRegistrations]);
  useEffect(() => { localStorage.setItem('ai_ict_participations', JSON.stringify(participations)); }, [participations]);

  // Project Actions
  const addProject = (projectData) => {
    const newProj = {
      id: Date.now(),
      title: projectData.title,
      category: projectData.category || "Artificial Intelligence",
      abstract: projectData.abstract,
      methodology: projectData.methodology || "",
      tech_stack: projectData.tech_stack || "Python, PyTorch",
      github_url: projectData.github_url || "",
      demo_url: projectData.demo_url || "",
      student_id: projectData.student_id,
      student_name: projectData.student_name,
      faculty_id: projectData.faculty_id || 3,
      faculty_name: projectData.faculty_name || "Er. Mehraj U Din Mir",
      status: "Pending",
      score: null,
      grade: "Pending",
      feedback: "",
      is_featured: false,
      created_at: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProjectStatus = (id, status, feedback = "", score = null, grade = null) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
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

  const toggleProjectFeatured = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Messages Actions
  const addMessage = (messageData) => {
    const newMsg = {
      id: Date.now(),
      faculty_id: messageData.faculty_id || 3,
      faculty_name: messageData.faculty_name || "Er. Mehraj U Din Mir",
      title: messageData.title,
      content: messageData.content,
      category: messageData.category || "Announcement",
      priority: messageData.priority || "Normal",
      created_at: new Date().toISOString().split('T')[0]
    };
    setMessages(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // Club Registration Actions
  const addClubRegistration = (regData) => {
    const newReg = {
      id: Date.now(),
      user_name: regData.user_name,
      user_email: regData.user_email,
      year: regData.year,
      interests: regData.interests,
      note: regData.note || "",
      status: "Pending",
      created_at: new Date().toISOString().split('T')[0]
    };
    setClubRegistrations(prev => [newReg, ...prev]);
    return newReg;
  };

  const updateClubRegistrationStatus = (id, status) => {
    setClubRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  // Activity Participations
  const addParticipation = (partData) => {
    const newPart = {
      id: Date.now(),
      user_id: partData.user_id,
      user_name: partData.user_name,
      activity_id: partData.activity_id,
      activity_title: partData.activity_title,
      proof: partData.proof,
      notes: partData.notes || "",
      status: "Pending",
      created_at: new Date().toISOString().split('T')[0]
    };
    setParticipations(prev => [newPart, ...prev]);
    return newPart;
  };

  const updateParticipationStatus = (id, status) => {
    setParticipations(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // Documents
  const incrementDocumentDownload = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, downloads_count: (d.downloads_count || 0) + 1 } : d));
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
      resetToDefaults
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
