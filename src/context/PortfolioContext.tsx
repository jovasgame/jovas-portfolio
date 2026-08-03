import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';
import { hashPassword } from '../utils/security';
import { parseGoogleDriveUrl, getCategoryFallbackImage } from '../utils/mediaUtils';

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
  isAdminLoggedIn: boolean;
  loginAdmin: (u: string, p: string) => Promise<boolean>;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleFeatured: (id: string) => void;
  addPhotoItem: (photo: Omit<PhotoItem, 'id' | 'createdAt'>) => void;
  updatePhotoItem: (id: string, photo: Partial<PhotoItem>) => void;
  deletePhotoItem: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateBrandAssets: (assets: Partial<BrandAssets>) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  resetToDefaults: () => void;
  syncToCloud: (
    customProjects?: Project[],
    customPhotos?: PhotoItem[],
    customProfile?: UserProfile,
    customBrandAssets?: BrandAssets,
    customStats?: Stats
  ) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'jovas_portfolio_v5_final_';

// Credentials SHA-256 Hash Security (No plain text password stored)
const ADMIN_USERNAME = 'JovasMotion';
const ADMIN_PASSWORD_HASH = '8e84a7c15b781c94359a4d8456f5d3168e3f7fa3dcfaa7e32041f30921f49bd6';

const sanitizeProfile = (prof?: Partial<UserProfile> | null): UserProfile => {
  if (!prof) return initialProfile;
  let avatar = prof.avatarUrl ? prof.avatarUrl.trim() : '';
  if (!avatar || avatar.includes('lh3.googleusercontent.com/aida-public')) {
    avatar = initialProfile.avatarUrl || '';
  }
  return {
    ...initialProfile,
    ...prof,
    avatarUrl: avatar
  };
};

const sanitizeBrandAssets = (assets?: Partial<BrandAssets> | null): BrandAssets => {
  if (!assets) return initialBrandAssets;
  let logo = assets.logoUrl ? assets.logoUrl.trim() : '';
  let metallic = assets.metallicIconUrl ? assets.metallicIconUrl.trim() : '';

  if (!logo) {
    logo = metallic || initialBrandAssets.logoUrl || initialBrandAssets.metallicIconUrl || '';
  }
  if (!metallic) {
    metallic = logo || initialBrandAssets.metallicIconUrl || initialBrandAssets.logoUrl || '';
  }

  if (metallic.includes('lh3.googleusercontent.com/aida-public')) {
    metallic = initialBrandAssets.metallicIconUrl || '';
  }
  if (logo.includes('lh3.googleusercontent.com/aida-public')) {
    logo = initialBrandAssets.logoUrl || metallic;
  }

  return {
    ...initialBrandAssets,
    ...assets,
    logoUrl: logo,
    metallicIconUrl: metallic
  };
};

const sanitizeProjectList = (projList: Project[]): Project[] => {
  return projList.map((p) => {
    let cleanImg = p.imageUrl ? p.imageUrl.trim() : '';
    let cleanVid = p.videoUrl ? p.videoUrl.trim() : '';

    // If imageUrl is completely empty, fallback to initial match or category fallback
    if (!cleanImg) {
      const match = initialProjects.find((ip) => ip.id === p.id);
      cleanImg = match?.imageUrl || getCategoryFallbackImage(p.category);
    }

    return {
      ...p,
      imageUrl: cleanImg,
      videoUrl: cleanVid || undefined
    };
  });
};

const mergeProjectsPreservingUserEdits = (savedProjects?: Project[]): Project[] => {
  if (!savedProjects || !Array.isArray(savedProjects) || savedProjects.length === 0) {
    return initialProjects;
  }

  // Keep user's custom edited projects intact
  const savedMap = new Map(savedProjects.map(p => [p.id, p]));
  const result: Project[] = [...savedProjects];

  // Append any missing initial projects
  initialProjects.forEach(ip => {
    if (!savedMap.has(ip.id)) {
      result.push(ip);
    }
  });

  return sanitizeProjectList(result);
};

const mergePhotosPreservingUserEdits = (savedPhotos?: PhotoItem[]): PhotoItem[] => {
  if (!savedPhotos || !Array.isArray(savedPhotos) || savedPhotos.length === 0) {
    return initialPhotos;
  }

  const savedMap = new Map(savedPhotos.map(p => [p.id, p]));
  const result: PhotoItem[] = [...savedPhotos];

  initialPhotos.forEach(ip => {
    if (!savedMap.has(ip.id)) {
      result.push(ip);
    }
  });

  return result;
};

const getSavedProjects = (): Project[] | null => {
  const keys = [
    LOCAL_STORAGE_PREFIX + 'projects',
    'jovas_portfolio_v4_clean_projects',
    'jovas_portfolio_v3_projects',
    'jovas_portfolio_projects'
  ];
  for (const key of keys) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return null;
};

const getSavedPhotos = (): PhotoItem[] | null => {
  const keys = [
    LOCAL_STORAGE_PREFIX + 'photos',
    'jovas_portfolio_v4_clean_photos',
    'jovas_portfolio_v3_photos',
    'jovas_portfolio_photos'
  ];
  for (const key of keys) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return null;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = getSavedProjects();
    return mergeProjectsPreservingUserEdits(saved || undefined);
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = getSavedPhotos();
    return mergePhotosPreservingUserEdits(saved || undefined);
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'profile') || localStorage.getItem('jovas_portfolio_profile');
      return saved ? sanitizeProfile(JSON.parse(saved)) : initialProfile;
    } catch (e) {
      return initialProfile;
    }
  });

  const [brandAssets, setBrandAssets] = useState<BrandAssets>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'brand_assets') || localStorage.getItem('jovas_portfolio_brand_assets');
      return saved ? sanitizeBrandAssets(JSON.parse(saved)) : initialBrandAssets;
    } catch (e) {
      return initialBrandAssets;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'messages') || localStorage.getItem('jovas_portfolio_messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch (e) {
      return initialMessages;
    }
  });

  const [stats, setStats] = useState<Stats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'stats') || localStorage.getItem('jovas_portfolio_stats');
      return saved ? JSON.parse(saved) : initialStats;
    } catch (e) {
      return initialStats;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'admin_session') === 'active' || localStorage.getItem('jovas_portfolio_admin_session') === 'active';
    } catch (e) {
      return false;
    }
  });
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync from Cloudflare KV API on mount, fallback to localStorage / initialData safely
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          const mergedProjects = mergeProjectsPreservingUserEdits(data.projects);
          setProjects(mergedProjects);
          try {
            localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(mergedProjects));
          } catch (e) {}
        }

        if (data && data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          const mergedPhotos = mergePhotosPreservingUserEdits(data.photos);
          setPhotos(mergedPhotos);
          try {
            localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(mergedPhotos));
          } catch (e) {}
        }
        if (data.profile) setProfile(prev => sanitizeProfile({ ...prev, ...data.profile }));
        if (data.brandAssets) setBrandAssets(prev => sanitizeBrandAssets({ ...prev, ...data.brandAssets }));
        if (data.stats && !localStorage.getItem(LOCAL_STORAGE_PREFIX + 'stats')) setStats(data.stats);
      })
      .catch(e => {
        console.warn('Cloudflare KV fetch notice (using defaults/localStorage):', e);
      });
  }, []);

  // Save state to Cloudflare KV storage + localStorage for global persistence
  const syncToCloud = async (
    customProjects?: Project[],
    customPhotos?: PhotoItem[],
    customProfile?: UserProfile,
    customBrandAssets?: BrandAssets,
    customStats?: Stats
  ): Promise<boolean> => {
    const projectsToSync = customProjects || projects;
    const photosToSync = customPhotos || photos;
    const profileToSync = customProfile || profile;
    const brandAssetsToSync = customBrandAssets || brandAssets;
    const statsToSync = customStats || stats;

    const payload = {
      projects: projectsToSync,
      photos: photosToSync,
      profile: profileToSync,
      brandAssets: brandAssetsToSync,
      stats: statsToSync
    };

    // 1. Save to localStorage locally
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(projectsToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(photosToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'profile', JSON.stringify(profileToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'brand_assets', JSON.stringify(brandAssetsToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'stats', JSON.stringify(statsToSync));
    } catch (e) {
      console.warn('Failed to sync to localStorage (may be storage limit exceeded):', e);
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

  // CRUD Operations with instant Cloudflare KV sync
  const addProject = (newProjectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...newProjectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => {
      const updated = [newProj, ...prev];
      syncToCloud(updated);
      return updated;
    });
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
      syncToCloud(updated);
      return updated;
    });
    // If updating currently open modal project, sync it as well
    if (selectedProjectForModal && selectedProjectForModal.id === id) {
      setSelectedProjectForModal(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      syncToCloud(updated);
      return updated;
    });
  };

  const toggleFeatured = (id: string) => {
    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p));
      syncToCloud(updated);
      return updated;
    });
  };

  const addPhotoItem = (photoData: Omit<PhotoItem, 'id' | 'createdAt'>) => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: 'photo-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPhotos(prev => {
      const updated = [newPhoto, ...prev];
      syncToCloud(undefined, updated);
      return updated;
    });
  };

  const updatePhotoItem = (id: string, updatedFields: Partial<PhotoItem>) => {
    setPhotos(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
      syncToCloud(undefined, updated);
      return updated;
    });
  };

  const deletePhotoItem = (id: string) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      syncToCloud(undefined, updated);
      return updated;
    });
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updatedProfile };
      syncToCloud(undefined, undefined, updated);
      return updated;
    });
  };

  const updateBrandAssets = (updatedAssets: Partial<BrandAssets>) => {
    setBrandAssets(prev => {
      const updated = { ...prev, ...updatedAssets };
      syncToCloud(undefined, undefined, undefined, updated);
      return updated;
    });
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
    syncToCloud(initialProjects);
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
