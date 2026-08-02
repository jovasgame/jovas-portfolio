import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';
import { hashPassword } from '../utils/security';

interface PortfolioContextType {
  projects: Project[];
  photos: PhotoItem[];
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
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Real-time CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleFeatured: (id: string) => void;

  addPhotoItem: (photo: Omit<PhotoItem, 'id' | 'createdAt'>) => void;
  updatePhotoItem: (id: string, updatedFields: Partial<PhotoItem>) => void;
  deletePhotoItem: (id: string) => void;
  
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateBrandAssets: (assets: Partial<BrandAssets>) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  resetToDefaults: () => void;
  syncToCloud: () => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'jovas_portfolio_';

// Credentials SHA-256 Hash Security (No plain text password stored)
const ADMIN_USERNAME = 'JovasMotion';
const ADMIN_PASSWORD_HASH = '8e84a7c15b781c94359a4d8456f5d3168e3f7fa3dcfaa7e32041f30921f49bd6';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'projects');
      if (saved) {
        const parsed: Project[] = JSON.parse(saved);
        return parsed.map((p) => {
          const match = initialProjects.find((ip) => ip.id === p.id);
          if (!p.videoUrl || p.videoUrl.includes('w3schools.com')) {
            return {
              ...p,
              videoUrl: match?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
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

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'photos');
      return saved ? JSON.parse(saved) : initialPhotos;
    } catch (e) {
      console.warn('Failed to read photos from localStorage:', e);
      return initialPhotos;
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

  // Sync from Cloudflare KV API on mount, fallback to localStorage / initialData
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          if (data.photos && Array.isArray(data.photos)) setPhotos(data.photos);
          if (data.profile) setProfile(data.profile);
          if (data.brandAssets) setBrandAssets(data.brandAssets);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch(e => {
        console.warn('Cloudflare KV fetch notice (using defaults/localStorage):', e);
      });
  }, []);

  // Save state to Cloudflare KV storage + localStorage for global persistence
  const syncToCloud = async (): Promise<boolean> => {
    const payload = { projects, photos, profile, brandAssets, stats };

    // 1. Save to localStorage locally
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(projects));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(photos));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'profile', JSON.stringify(profile));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'brand_assets', JSON.stringify(brandAssets));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to sync to localStorage:', e);
    }

    // 2. Save live to Cloudflare KV via Functions API
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return Boolean(data && (data.success || data.projects));
    } catch (e) {
      console.warn('Failed to sync to Cloudflare KV:', e);
      return true; // Graceful fallback
    }
  };

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
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('Failed to save photos to localStorage:', e);
    }
  }, [photos]);

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
      console.warn('Failed to save brandAssets to localStorage:', e);
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

  // Secure Auth check using SHA-256 password hash comparison
  const loginAdmin = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    const isUserValid = usernameInput.trim() === ADMIN_USERNAME;
    const inputHash = await hashPassword(passwordInput);
    const isPassValid = inputHash === ADMIN_PASSWORD_HASH;

    if (isUserValid && isPassValid) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'admin_session', 'active');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'admin_session');
    } catch (e) {}
  };

  // CRUD Operations (localStorage only)
  const addProject = (newProjectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...newProjectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    // If updating currently open modal project, sync it as well
    if (selectedProjectForModal && selectedProjectForModal.id === id) {
      setSelectedProjectForModal(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const addPhotoItem = (photoData: Omit<PhotoItem, 'id' | 'createdAt'>) => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: 'photo-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const updatePhotoItem = (id: string, updatedFields: Partial<PhotoItem>) => {
    setPhotos(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deletePhotoItem = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
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
    setPhotos(initialPhotos);
    setProfile(initialProfile);
    setBrandAssets(initialBrandAssets);
    setMessages(initialMessages);
    setStats(initialStats);
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'projects');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'photos');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'profile');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'brand_assets');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'messages');
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'stats');
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        photos,
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
        addPhotoItem,
        updatePhotoItem,
        deletePhotoItem,
        updateProfile,
        updateBrandAssets,
        addContactMessage,
        markMessageAsRead,
        deleteMessage,
        resetToDefaults,
        syncToCloud
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
