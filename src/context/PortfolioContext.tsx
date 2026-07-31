import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';

interface PortfolioContextType {
  projects: Project[];
  profile: UserProfile;
  brandAssets: BrandAssets;
  messages: ContactMessage[];
  stats: Stats;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProjectForModal: Project | null;
  setSelectedProjectForModal: (project: Project | null) => void;
  
  // Admin & Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Real-time CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleFeatured: (id: string) => void;
  
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateBrandAssets: (assets: Partial<BrandAssets>) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'jovas_portfolio_';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'projects');
      if (saved) {
        const parsed: Project[] = JSON.parse(saved);
        // Clean up legacy w3schools demo links
        return parsed.map((p) => {
          if (p.videoUrl && p.videoUrl.includes('w3schools.com')) {
            const initialMatch = initialProjects.find((ip) => ip.id === p.id);
            return {
              ...p,
              videoUrl: initialMatch?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            };
          }
          return p;
        });
      }
      return initialProjects;
    } catch (e) {
      console.warn('Failed to read projects from localStorage:', e);
      return initialProjects;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch (e) {
      console.warn('Failed to read profile from localStorage:', e);
      return initialProfile;
    }
  });

  const [brandAssets, setBrandAssets] = useState<BrandAssets>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'brand_assets');
      return saved ? JSON.parse(saved) : initialBrandAssets;
    } catch (e) {
      console.warn('Failed to read brand_assets from localStorage:', e);
      return initialBrandAssets;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch (e) {
      console.warn('Failed to read messages from localStorage:', e);
      return initialMessages;
    }
  });

  const [stats, setStats] = useState<Stats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'stats');
      return saved ? JSON.parse(saved) : initialStats;
    } catch (e) {
      console.warn('Failed to read stats from localStorage:', e);
      return initialStats;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'admin_session') === 'active';
    } catch (e) {
      return false;
    }
  });
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync state to local storage safely
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'brand_assets', JSON.stringify(brandAssets));
    } catch (e) {
      console.warn('Failed to save brand_assets to localStorage:', e);
    }
  }, [brandAssets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to localStorage:', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats to localStorage:', e);
    }
  }, [stats]);

  // Auth check using explicit credentials requested by user
  const loginAdmin = (user: string, pass: string): boolean => {
    if (user === 'JovasMotion' && pass === '25720104') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'admin_session', 'active');
      } catch (e) {
        console.warn('Failed to save admin session:', e);
      }
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'admin_session');
    } catch (e) {
      console.warn('Failed to remove admin session:', e);
    }
  };

  // CRUD Operations
  const addProject = (newProjData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...newProjData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    // If updating currently open modal project, sync it as well
    if (selectedProjectForModal && selectedProjectForModal.id === id) {
      setSelectedProjectForModal(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectForModal && selectedProjectForModal.id === id) {
      setSelectedProjectForModal(null);
    }
  };

  const toggleFeatured = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const updateBrandAssets = (updatedAssets: Partial<BrandAssets>) => {
    setBrandAssets(prev => ({ ...prev, ...updatedAssets }));
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: 'Ahora mismo',
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
    setStats(prev => ({
      ...prev,
      newLeadsCount: prev.newLeadsCount + 1
    }));
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setProfile(initialProfile);
    setBrandAssets(initialBrandAssets);
    setMessages(initialMessages);
    setStats(initialStats);
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'projects');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'profile');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'brand_assets');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'messages');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'stats');
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        profile,
        brandAssets,
        messages,
        stats,
        selectedCategory,
        setSelectedCategory,
        selectedProjectForModal,
        setSelectedProjectForModal,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        addProject,
        updateProject,
        deleteProject,
        toggleFeatured,
        updateProfile,
        updateBrandAssets,
        addContactMessage,
        markMessageAsRead,
        deleteMessage,
        resetToDefaults
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
