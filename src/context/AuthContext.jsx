import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { initialUsers } from '../data/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(true);

  // Fetch all users (from Supabase, fallback to initialUsers)
  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (data && data.length > 0 && !error) {
        setUsers(data);
        return data;
      }
    } catch (err) {
      console.warn('[Auth] Supabase fetch users notice:', err.message);
    }
    // Fallback: check localStorage for any locally registered users
    const localUsers = localStorage.getItem('ai_ict_custom_users');
    if (localUsers) {
      try {
        const parsed = JSON.parse(localUsers);
        setUsers([...initialUsers, ...parsed]);
        return;
      } catch (e) {}
    }
    setUsers(initialUsers);
  }, []);

  // On mount — check existing session & users
  useEffect(() => {
    const init = async () => {
      try {
        await fetchUsers();
        // Restore session from localStorage
        const saved = localStorage.getItem('ai_ict_auth_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          // Try validating with Supabase in background
          try {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('email', parsed.email)
              .single();
            if (data) setCurrentUser(data);
          } catch (e) {}
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchUsers]);

  // Persist session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ai_ict_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ai_ict_auth_user');
    }
  }, [currentUser]);

  // Login — match email + role
  const login = async (email, password, requiredRole = null) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase
    let matchedUser = null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();
      if (data && !error) {
        matchedUser = data;
      }
    } catch (e) {}

    // 2. Fallback to in-memory / initial users
    if (!matchedUser) {
      matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (!matchedUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // Role check (admin can access faculty)
    if (requiredRole && matchedUser.role !== requiredRole && !(requiredRole === 'faculty' && matchedUser.role === 'admin')) {
      return { success: false, error: `This account has '${matchedUser.role}' credentials, but '${requiredRole}' was expected.` };
    }

    if (matchedUser.status === 'Suspended' || matchedUser.status === 'Rejected') {
      return { success: false, error: 'Your account is currently suspended. Please contact the administrator.' };
    }

    setCurrentUser(matchedUser);
    return { success: true, user: matchedUser };
  };

  // Register student
  const registerStudent = async (studentData) => {
    const cleanEmail = studentData.email.trim().toLowerCase();

    // Check duplicate
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Date.now(),
      name: studentData.name,
      email: cleanEmail,
      password_hash: 'student_hash',
      role: 'student',
      status: 'Approved',
      designation: 'Student Researcher',
      department: 'AI & ICT Department, GVEI',
      specialization: studentData.specialization || 'Artificial Intelligence',
      class_name: studentData.class_name || 'B.Tech AI',
      roll_no: studentData.roll_no || 'AI-2025-001',
      phone: studentData.phone || '',
      avatar_url: '/img/students.jpg',
      bio: studentData.bio || 'Student researcher in the AI & ICT Department.',
      created_at: new Date().toISOString()
    };

    // Try Supabase insert
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: newUser.name,
          email: newUser.email,
          password_hash: newUser.password_hash,
          role: newUser.role,
          status: newUser.status,
          designation: newUser.designation,
          department: newUser.department,
          specialization: newUser.specialization,
          class_name: newUser.class_name,
          roll_no: newUser.roll_no,
          phone: newUser.phone,
          avatar_url: newUser.avatar_url,
          bio: newUser.bio
        }])
        .select()
        .single();

      if (data && !error) {
        newUser.id = data.id;
      }
    } catch (err) {
      console.warn('[Auth] Supabase registration notice (using local state):', err.message);
    }

    // Update local state and custom users storage
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    try {
      const localCustom = JSON.parse(localStorage.getItem('ai_ict_custom_users') || '[]');
      localCustom.push(newUser);
      localStorage.setItem('ai_ict_custom_users', JSON.stringify(localCustom));
    } catch (e) {}

    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Add faculty (admin action)
  const addFaculty = async (facultyData) => {
    const cleanEmail = facultyData.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newFaculty = {
      id: Date.now(),
      name: facultyData.name,
      email: cleanEmail,
      password_hash: 'faculty_hash',
      role: 'faculty',
      status: 'Approved',
      designation: facultyData.designation || 'Lecturer',
      department: facultyData.department || 'AI & ICT Department, GVEI',
      specialization: facultyData.specialization || 'Artificial Intelligence',
      phone: facultyData.phone || '',
      avatar_url: facultyData.avatar_url || '/img/nousheen.png',
      bio: facultyData.bio || 'Faculty mentor in the Department of AI & ICT.',
      qualification: facultyData.qualification || 'M.Tech / Ph.D in Computer Science',
      experience: facultyData.experience || '5+ Years',
      linkedin_url: facultyData.linkedin_url || '',
      github_url: facultyData.github_url || '',
      created_at: new Date().toISOString()
    };

    // Try Supabase insert
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: newFaculty.name,
          email: newFaculty.email,
          password_hash: newFaculty.password_hash,
          role: newFaculty.role,
          status: newFaculty.status,
          designation: newFaculty.designation,
          department: newFaculty.department,
          specialization: newFaculty.specialization,
          phone: newFaculty.phone,
          avatar_url: newFaculty.avatar_url,
          bio: newFaculty.bio,
          qualification: newFaculty.qualification,
          experience: newFaculty.experience,
          linkedin_url: newFaculty.linkedin_url,
          github_url: newFaculty.github_url
        }])
        .select()
        .single();

      if (data && !error) {
        newFaculty.id = data.id;
      }
    } catch (err) {
      console.warn('[Auth] Supabase add faculty notice (using local state):', err.message);
    }

    const updatedUsers = [...users, newFaculty];
    setUsers(updatedUsers);
    try {
      const localCustom = JSON.parse(localStorage.getItem('ai_ict_custom_users') || '[]');
      localCustom.push(newFaculty);
      localStorage.setItem('ai_ict_custom_users', JSON.stringify(localCustom));
    } catch (e) {}

    return { success: true, user: newFaculty };
  };

  // Delete user (admin action)
  const deleteUser = async (userId) => {
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (err) {}

    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ai_ict_auth_user');
  };

  const quickLoginAs = async (role) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Faculty list: all faculty members, plus HOD admin
  const faculty = users.filter(u => u.role === 'faculty' || (u.role === 'admin' && (u.designation?.toLowerCase().includes('hod') || u.name?.toLowerCase().includes('mehraj'))));

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      faculty,
      isAuthenticated: !!currentUser,
      role: currentUser?.role || null,
      loading,
      login,
      registerStudent,
      addFaculty,
      deleteUser,
      logout,
      quickLoginAs,
      fetchUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
