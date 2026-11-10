import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_ict_users');
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  useEffect(() => {
    localStorage.setItem('ai_ict_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ai_ict_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ai_ict_auth_user');
    }
  }, [currentUser]);

  const login = (email, password, requiredRole = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: "No account found with this email address." };
    }

    if (requiredRole && user.role !== requiredRole && !(requiredRole === 'faculty' && user.role === 'admin')) {
      return { success: false, error: `This account does not have ${requiredRole} credentials.` };
    }

    if (user.status === 'Suspended' || user.status === 'Rejected') {
      return { success: false, error: "Your account is not active. Please contact the administrator." };
    }

    // Passwords accepted in demo or match default pattern
    setCurrentUser(user);
    return { success: true, user };
  };

  const registerStudent = (studentData) => {
    const cleanEmail = studentData.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: Date.now(),
      name: studentData.name,
      email: cleanEmail,
      role: 'student',
      status: 'Approved',
      designation: 'Student',
      department: 'AI & ICT Department, GVEI',
      specialization: studentData.specialization || 'Artificial Intelligence',
      class_name: studentData.class_name || 'B.Tech AI',
      roll_no: studentData.roll_no || '',
      phone: studentData.phone || '',
      avatar_url: '/img/students.jpg',
      bio: studentData.bio || 'Student researcher at AI & ICT Department.',
      created_at: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLoginAs = (role) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      return target;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAuthenticated: !!currentUser,
      role: currentUser?.role || null,
      login,
      registerStudent,
      logout,
      quickLoginAs
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
