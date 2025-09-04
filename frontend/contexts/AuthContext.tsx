'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  skills: Skill[];
  verifiedSkills: string[];
  teams: Team[];
  availability: boolean;
  github?: string;
  linkedin?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  verified: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
  leaderId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      // Mock user data for demo
      setUser({
        id: '1',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        role: 'Full Stack Developer',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Passionate full-stack developer with 5 years of experience in React, Node.js, and cloud technologies.',
        skills: [
          { id: '1', name: 'React', level: 5, verified: true },
          { id: '2', name: 'Node.js', level: 4, verified: true },
          { id: '3', name: 'Python', level: 3, verified: false },
        ],
        verifiedSkills: ['React', 'Node.js'],
        teams: [],
        availability: true,
        github: 'https://github.com/alexchen',
        linkedin: 'https://linkedin.com/in/alexchen',
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('token', 'mock-token');
    setUser({
      id: '1',
      name: 'Alex Chen',
      email,
      role: 'Full Stack Developer',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Passionate full-stack developer with 5 years of experience in React, Node.js, and cloud technologies.',
      skills: [
        { id: '1', name: 'React', level: 5, verified: true },
        { id: '2', name: 'Node.js', level: 4, verified: true },
        { id: '3', name: 'Python', level: 3, verified: false },
      ],
      verifiedSkills: ['React', 'Node.js'],
      teams: [],
      availability: true,
      github: 'https://github.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
    });
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('token', 'mock-token');
    setUser({
      id: '1',
      name: data.name,
      email: data.email,
      role: data.role,
      skills: [],
      verifiedSkills: [],
      teams: [],
      availability: true,
    });
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}