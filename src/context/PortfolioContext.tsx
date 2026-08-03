import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';
import { hashPassword } from '../utils/security';
import { parseGoogleDriveUrl, getCategoryFallbackImage } from '../utils/mediaUtils';
import { idbStorage } from '../utils/idbStorage';

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

const LEGACY_DUMMY_TITLES = new Set([
  'ignis vanguard',
  'cyber sanctuary',
  'santuario de la espada',
  'precision core',
  'ruinas al atardecer',
  'vanguard unit'
]);

const LEGACY_DUMMY_IDS = new Set([
  'proj-1',
  'proj-2',
  'proj-3',
  'proj-4',
  'proj-5',
  'proj-6'
]);

const sanitizeProjectList = (projList: Project[]): Project[] => {
  if (!Array.isArray(projList)) return [];

  return projList
    .filter((p) => {
      if (!p) return false;
      const titleLower = (p.title || '').trim().toLowerCase();
      if (LEGACY_DUMMY_TITLES.has(titleLower)) return false;
      if (LEGACY_DUMMY_IDS.has(p.id)) return false;
      return true;
    })
    .map((p) => {
      let cleanImg = p.imageUrl ? p.imageUrl.trim() : '';
      let cleanVid = p.videoUrl ? p.videoUrl.trim() : '';

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
  if (!savedProjects || !Array.isArray(savedProjects)) {
    return sanitizeProjectList(initialProjects);
  }

  const sanitized = sanitizeProjectList(savedProjects);
  return sanitized.length > 0 ? sanitized : sanitizeProjectList(initialProjects);
};

const mergePhotosPreservingUserEdits = (savedPhotos?: PhotoItem[]): PhotoItem[] => {
  if (!savedPhotos || !Array.isArray(savedPhotos)) {
    return initialPhotos;
  }
  return savedPhotos.length > 0 ? savedPhotos : initialPhotos;
};

const clearLegacyLocalStorage = () => {
  const legacyKeys = [
    'jovas_portfolio_v4_clean_projects',
    'jovas_portfolio_v3_projects',
    'jovas_portfolio_projects',
    'jovas_portfolio_v4_clean_photos',
    'jovas_portfolio_v3_photos',
    'jovas_portfolio_photos'
  ];
  for (const key of legacyKeys) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

const getSavedProjects = (): Project[] | null => {
  clearLegacyLocalStorage();
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

const getSavedPhotos = (): PhotoItem[] | null => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'photos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
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
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'profile');
      return saved ? sanitizeProfile(JSON.parse(saved)) : initialProfile;
    } catch (e) {
      return initialProfile;
    }
  });

  const [brandAssets, setBrandAssets] = useState<BrandAssets>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'brand_assets');
      return saved ? sanitizeBrandAssets(JSON.parse(saved)) : initialBrandAssets;
    } catch (e) {
      return initialBrandAssets;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch (e) {
      return initialMessages;
    }
  });

  const [stats, setStats] = useState<Stats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'stats');
      return saved ? JSON.parse(saved) : initialStats;
    } catch (e) {
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

  // Synchronize IndexedDB (large storage) & Cloudflare KV on mount
  useEffect(() => {
    let isMounted = true;

    async function loadIndexedDBAndCloud() {
      // 1. Read from IndexedDB (preserves Base64 images and large datasets without quota limit)
      const idbProjects = await idbStorage.getItem<Project[]>('projects');
      const idbPhotos = await idbStorage.getItem<PhotoItem[]>('photos');
      const idbProfile = await idbStorage.getItem<UserProfile>('profile');
      const idbBrandAssets = await idbStorage.getItem<BrandAssets>('brandAssets');
      const idbMessages = await idbStorage.getItem<ContactMessage[]>('messages');
      const idbStats = await idbStorage.getItem<Stats>('stats');

      if (!isMounted) return;

      let activeProjects = projects;
      if (idbProjects && Array.isArray(idbProjects) && idbProjects.length > 0) {
        const cleaned = sanitizeProjectList(idbProjects);
        if (cleaned.length > 0) {
          activeProjects = cleaned;
          setProjects(activeProjects);
        }
      }

      let activePhotos = photos;
      if (idbPhotos && Array.isArray(idbPhotos) && idbPhotos.length > 0) {
        activePhotos = idbPhotos;
        setPhotos(activePhotos);
      }

      if (idbProfile) setProfile(sanitizeProfile(idbProfile));
      if (idbBrandAssets) setBrandAssets(sanitizeBrandAssets(idbBrandAssets));
      if (idbMessages && Array.isArray(idbMessages)) setMessages(idbMessages);
      if (idbStats) setStats(idbStats);

      // 2. Fetch from Cloudflare KV API
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data) return;

        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          const cloudCleaned = sanitizeProjectList(data.projects);
          if (cloudCleaned.length > 0) {
            setProjects(cloudCleaned);
            idbStorage.setItem('projects', cloudCleaned);
          }
        }

        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
          idbStorage.setItem('photos', data.photos);
        }

        if (data.profile) setProfile(prev => sanitizeProfile({ ...data.profile, ...prev }));
        if (data.brandAssets) setBrandAssets(prev => sanitizeBrandAssets({ ...data.brandAssets, ...prev }));
      } catch (e) {
        console.warn('Cloudflare KV fetch notice (using IndexedDB/localStorage):', e);
      }
    }

    loadIndexedDBAndCloud();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save state to Cloudflare KV storage + IndexedDB + localStorage for global persistence
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

    // 1. Save to IndexedDB (Unlimited size for Base64 high-res images)
    await idbStorage.setItem('projects', projectsToSync);
    await idbStorage.setItem('photos', photosToSync);
    await idbStorage.setItem('profile', profileToSync);
    await idbStorage.setItem('brandAssets', brandAssetsToSync);
    await idbStorage.setItem('stats', statsToSync);

    // 2. Save to localStorage locally (catch quota errors gracefully)
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(projectsToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(photosToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'profile', JSON.stringify(profileToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'brand_assets', JSON.stringify(brandAssetsToSync));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'stats', JSON.stringify(statsToSync));
    } catch (e) {
      console.warn('LocalStorage limit notice (data saved safely in IndexedDB):', e);
    }

    // 3. Save live to Cloudflare KV via Functions API
    try {
      const body = JSON.stringify(payload);
      // Cloudflare KV hard limit: 25 MB per value. Abort early with a clear
      // warning instead of failing silently on the server.
      const MAX_KV_PAYLOAD_BYTES = 23 * 1024 * 1024;
      if (body.length > MAX_KV_PAYLOAD_BYTES) {
        console.error(
          `Cloudflare KV sync aborted: payload is ${(body.length / 1024 / 1024).toFixed(1)} MB ` +
          `(limit ~25 MB). Use external image URLs (Drive/YouTube) instead of uploaded ` +
          `base64 files to reduce size. Data remains saved locally in IndexedDB.`
        );
        return false;
      }
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await res.json();
      return Boolean(data && (data.success || data.projects));
    } catch (e) {
      console.warn('Cloudflare KV sync notice (saved locally in IndexedDB):', e);
      return true; // Graceful fallback
    }
  };

  // Sync state to IndexedDB & LocalStorage on changes
  useEffect(() => {
    idbStorage.setItem('projects', projects);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'projects', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  useEffect(() => {
    idbStorage.setItem('photos', photos);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'photos', JSON.stringify(photos));
    } catch (e) {}
  }, [photos]);

  useEffect(() => {
    idbStorage.setItem('profile', profile);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    idbStorage.setItem('brandAssets', brandAssets);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'brand_assets', JSON.stringify(brandAssets));
    } catch (e) {}
  }, [brandAssets]);

  useEffect(() => {
    idbStorage.setItem('messages', messages);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'messages', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    idbStorage.setItem('stats', stats);
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    } catch (e) {}
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

  // CRUD Operations with instant IndexedDB & Cloudflare KV sync
  const addProject = (newProjectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...newProjectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    syncToCloud(updated);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    const updated = projects.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    setProjects(updated);
    syncToCloud(updated);

    if (selectedProjectForModal && selectedProjectForModal.id === id) {
      setSelectedProjectForModal({ ...selectedProjectForModal, ...updatedFields });
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    syncToCloud(updated);
  };

  const toggleFeatured = (id: string) => {
    const updated = projects.map(p => (p.id === id ? { ...p, featured: !p.featured } : p));
    setProjects(updated);
    syncToCloud(updated);
  };

  const addPhotoItem = (photoData: Omit<PhotoItem, 'id' | 'createdAt'>) => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: 'photo-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    syncToCloud(undefined, updated);
  };

  const updatePhotoItem = (id: string, updatedFields: Partial<PhotoItem>) => {
    const updated = photos.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    setPhotos(updated);
    syncToCloud(undefined, updated);
  };

  const deletePhotoItem = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    syncToCloud(undefined, updated);
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...updatedProfile };
    setProfile(updated);
    syncToCloud(undefined, undefined, updated);
  };

  const updateBrandAssets = (updatedAssets: Partial<BrandAssets>) => {
    const updated = { ...brandAssets, ...updatedAssets };
    setBrandAssets(updated);
    syncToCloud(undefined, undefined, undefined, updated);
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
    idbStorage.clear();
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
