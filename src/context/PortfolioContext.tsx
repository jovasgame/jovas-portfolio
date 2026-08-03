import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';
import { hashPassword } from '../utils/security';
import { parseGoogleDriveUrl, getCategoryFallbackImage } from '../utils/mediaUtils';
import { idbStorage } from '../utils/idbStorage';

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'unbound';

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
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncError?: string;
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

// Deduplicate and clean project list without deleting valid user items
const sanitizeProjectList = (projList: Project[]): Project[] => {
  if (!Array.isArray(projList)) return [];

  const seenIds = new Set<string>();
  const result: Project[] = [];

  for (const p of projList) {
    if (!p || !p.id || seenIds.has(p.id)) continue;
    seenIds.add(p.id);

    let cleanImg = p.imageUrl ? p.imageUrl.trim() : '';
    let cleanVid = p.videoUrl ? p.videoUrl.trim() : '';

    if (!cleanImg) {
      const match = initialProjects.find((ip) => ip.id === p.id);
      cleanImg = match?.imageUrl || getCategoryFallbackImage(p.category);
    }

    result.push({
      ...p,
      imageUrl: cleanImg,
      videoUrl: cleanVid || undefined
    });
  }

  return result;
};

const mergeProjectsPreservingUserEdits = (savedProjects?: Project[]): Project[] => {
  if (!savedProjects || !Array.isArray(savedProjects)) {
    return sanitizeProjectList(initialProjects);
  }
  const sanitized = sanitizeProjectList(savedProjects);
  return sanitized;
};

const mergePhotosPreservingUserEdits = (savedPhotos?: PhotoItem[]): PhotoItem[] => {
  if (!savedPhotos || !Array.isArray(savedPhotos)) {
    return initialPhotos;
  }
  return savedPhotos;
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
      if (Array.isArray(parsed)) {
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
      if (Array.isArray(parsed)) {
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
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('idle');
  const [cloudSyncError, setCloudSyncError] = useState<string | undefined>(undefined);

  // Synchronize IndexedDB & Cloudflare KV on mount
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

      if (idbProjects && Array.isArray(idbProjects)) {
        const cleaned = sanitizeProjectList(idbProjects);
        setProjects(cleaned);
      }

      if (idbPhotos && Array.isArray(idbPhotos)) {
        setPhotos(idbPhotos);
      }

      if (idbProfile) setProfile(sanitizeProfile(idbProfile));
      if (idbBrandAssets) setBrandAssets(sanitizeBrandAssets(idbBrandAssets));
      if (idbMessages && Array.isArray(idbMessages)) setMessages(idbMessages);
      if (idbStats) setStats(idbStats);

      // 2. Fetch from Cloudflare KV API
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) {
          if (isMounted) setCloudSyncStatus('error');
          return;
        }
        const data = await res.json();
        if (!isMounted || !data) return;

        if (data.bound === false || data.status === 'unbound') {
          setCloudSyncStatus('unbound');
          setCloudSyncError('PORTFOLIO_KV no está vinculado en Cloudflare Pages settings');
          return;
        }

        if (data.projects && Array.isArray(data.projects)) {
          const cloudCleaned = sanitizeProjectList(data.projects);
          setProjects(cloudCleaned);
          idbStorage.setItem('projects', cloudCleaned);
          setCloudSyncStatus('synced');
        }

        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos);
          idbStorage.setItem('photos', data.photos);
          setCloudSyncStatus('synced');
        }

        if (data.profile) setProfile(prev => sanitizeProfile({ ...prev, ...data.profile }));
        if (data.brandAssets) setBrandAssets(prev => sanitizeBrandAssets({ ...prev, ...data.brandAssets }));
      } catch (e: any) {
        console.warn('Cloudflare KV fetch notice (using IndexedDB/localStorage):', e);
        if (isMounted) {
          setCloudSyncStatus('error');
          setCloudSyncError(String(e));
        }
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
    setCloudSyncStatus('syncing');
    setCloudSyncError(undefined);

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
      const MAX_KV_PAYLOAD_BYTES = 23 * 1024 * 1024;
      if (body.length > MAX_KV_PAYLOAD_BYTES) {
        const msg = `Cloudflare KV sync aborted: payload is ${(body.length / 1024 / 1024).toFixed(1)} MB (limit ~25 MB).`;
        console.error(msg);
        setCloudSyncStatus('error');
        setCloudSyncError(msg);
        return false;
      }

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await res.json();

      if (data && (data.bound === false || data.status === 'unbound')) {
        setCloudSyncStatus('unbound');
        setCloudSyncError('PORTFOLIO_KV no configurado en Cloudflare Pages settings');
        return false;
      }

      if (data && data.success) {
        setCloudSyncStatus('synced');
        return true;
      }

      setCloudSyncStatus('error');
      setCloudSyncError(data?.error || 'No se pudo guardar en Cloudflare KV');
      return false;
    } catch (e: any) {
      console.warn('Cloudflare KV sync notice (saved locally in IndexedDB):', e);
      setCloudSyncStatus('error');
      setCloudSyncError(String(e));
      return false;
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
        cloudSyncStatus,
        cloudSyncError,
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

