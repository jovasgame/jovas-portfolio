import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';
import { initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialMessages, initialStats } from '../data/initialData';
import { hashPassword } from '../utils/security';
import { parseGoogleDriveUrl, getCategoryFallbackImage } from '../utils/mediaUtils';
import { idbStorage } from '../utils/idbStorage';
import {
  sanitizeMediaListForSync,
  sanitizeProfileForSync,
  sanitizeBrandAssetsForSync
} from '../utils/imageCompression';

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
  syncWarnings: string[];
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
const LAST_LOCAL_CHANGE_KEY = LOCAL_STORAGE_PREFIX + 'last_local_change';
const SYNC_TOKEN_KEY = LOCAL_STORAGE_PREFIX + 'sync_token';

const getSyncToken = (): string | null => {
  try {
    return sessionStorage.getItem(SYNC_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

const getLastLocalChange = (): string => {
  try {
    return localStorage.getItem(LAST_LOCAL_CHANGE_KEY) || '';
  } catch (e) {
    return '';
  }
};

const markLocalChange = (): void => {
  try {
    localStorage.setItem(LAST_LOCAL_CHANGE_KEY, new Date().toISOString());
  } catch (e) {}
};

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

const sanitizePhotoList = (photoList?: PhotoItem[] | null): PhotoItem[] => {
  const sampleTitles = new Set([
    'Retrato Urbano & Luces Neón',
    'Arquitectura Brutalista & Sombras',
    'Texturas Volumétricas & Niebla',
    'Composición Minimalista Ígnea'
  ]);

  const map = new Map<string, PhotoItem>();

  // Always seed with initialPhotos (TRONCO VALLE, URBANO, Tronco Textura, Cuervo, Iguana al Sol, Arquitectura IGLESIA SUSHITOTO, Lampara Suchitoto)
  initialPhotos.forEach(p => map.set(p.id, p));

  // If user or DB provides photoList, overlay user-added items while discarding old sample items
  if (Array.isArray(photoList)) {
    photoList.forEach(p => {
      if (!p || !p.id) return;
      if (sampleTitles.has(p.title?.trim() || '')) return;
      if (p.id === 'photo-1' || p.id === 'photo-2' || p.id === 'photo-3' || p.id === 'photo-4') {
        if (p.imageUrl?.includes('unsplash.com')) return;
      }
      map.set(p.id, p);
    });
  }

  return Array.from(map.values());
};

const mergePhotosPreservingUserEdits = (savedPhotos?: PhotoItem[]): PhotoItem[] => {
  return sanitizePhotoList(savedPhotos);
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
  const [syncWarnings, setSyncWarnings] = useState<string[]>([]);

  // Bloquea escrituras a la nube hasta que termine la carga inicial (GET).
  // Sin esto, un CRUD disparado antes de recibir la nube podría sobrescribir
  // datos reales con estado inicial/viejo (origen de proyectos fantasma y resets).
  const cloudLoadFinishedRef = useRef<boolean>(false);

  // Synchronize IndexedDB & Cloudflare D1 on mount
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
        const cleanedP = sanitizePhotoList(idbPhotos);
        setPhotos(cleanedP);
      }

      if (idbProfile) setProfile(sanitizeProfile(idbProfile));
      if (idbBrandAssets) setBrandAssets(sanitizeBrandAssets(idbBrandAssets));
      if (idbMessages && Array.isArray(idbMessages)) setMessages(idbMessages);
      if (idbStats) setStats(idbStats);

      // 2. Fetch from Cloudflare D1 API (with legacy KV fallback server-side)
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
          setCloudSyncError('Base de datos no vinculada en Cloudflare Pages (PORTFOLIO_D1)');
          return;
        }

        // --- Merge por timestamps: la fuente más reciente gana ---
        const lastLocalChange = getLastLocalChange();
        const cloudUpdatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : '';
        const cloudHasProjects = Array.isArray(data.projects) && data.projects.length > 0;
        const cloudHasPhotos = Array.isArray(data.photos) && data.photos.length > 0;
        const cloudHasData = cloudHasProjects || cloudHasPhotos || !!data.profile;
        const localHasData =
          (idbProjects && idbProjects.length > 0) || !!getSavedProjects();
        const localIsNewer =
          !!lastLocalChange && (!cloudUpdatedAt || lastLocalChange > cloudUpdatedAt);

        if (cloudHasData && !localIsNewer) {
          // La nube es la fuente de verdad (más nueva o igual): adoptarla
          if (cloudHasProjects) {
            const cloudCleaned = sanitizeProjectList(data.projects);
            setProjects(cloudCleaned);
            idbStorage.setItem('projects', cloudCleaned);
          }
          if (Array.isArray(data.photos)) {
            const cloudPhotosCleaned = sanitizePhotoList(data.photos);
            setPhotos(cloudPhotosCleaned);
            idbStorage.setItem('photos', cloudPhotosCleaned);
          }
          if (data.profile) {
            const p = sanitizeProfile(data.profile);
            setProfile(p);
            idbStorage.setItem('profile', p);
          }
          if (data.brandAssets) {
            const b = sanitizeBrandAssets(data.brandAssets);
            setBrandAssets(b);
            idbStorage.setItem('brandAssets', b);
          }
          if (data.stats) {
            setStats(data.stats);
            idbStorage.setItem('stats', data.stats);
          }
          setCloudSyncStatus('synced');
        } else {
          // La nube está vacía o el local es más nuevo (ediciones offline):
          // NO pisar el estado local. Si hay sesión admin, empujar local a la
          // nube (autocuración: también migra datos viejos de IDB/KV a D1).
          setCloudSyncStatus('synced');
          if (isAdminLoggedIn && localHasData) {
            syncToCloud(
              idbProjects || undefined,
              idbPhotos || undefined,
              idbProfile || undefined,
              idbBrandAssets || undefined,
              idbStats || undefined
            );
          }
        }
      } catch (e: any) {
        console.warn('Cloudflare D1 fetch notice (using IndexedDB/localStorage):', e);
        if (isMounted) {
          setCloudSyncStatus('error');
          setCloudSyncError(String(e));
        }
      } finally {
        cloudLoadFinishedRef.current = true;
      }
    }

    loadIndexedDBAndCloud();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save state to Cloudflare D1 storage + IndexedDB + localStorage for global persistence
  const syncToCloud = async (
    customProjects?: Project[],
    customPhotos?: PhotoItem[],
    customProfile?: UserProfile,
    customBrandAssets?: BrandAssets,
    customStats?: Stats
  ): Promise<boolean> => {
    // Nunca escribir en la nube antes de terminar la carga inicial:
    // evita pisar datos reales con estado inicial o desactualizado.
    if (!cloudLoadFinishedRef.current) {
      console.warn('Sync bloqueado: la carga inicial de la nube aún no termina.');
      return false;
    }

    setCloudSyncStatus('syncing');
    setCloudSyncError(undefined);
    markLocalChange();

    // --- Compresión pre-sync: D1 rechaza filas > ~1 MB (SQLITE_TOOBIG).
    // Todo data URL de imagen que exceda el límite se re-comprime aquí; la
    // versión comprimida se persiste en estado + IndexedDB para que la
    // compresión ocurra una sola vez por imagen.
    const warnings: string[] = [];
    const projSan = await sanitizeMediaListForSync(customProjects || projects);
    const photoSan = await sanitizeMediaListForSync(customPhotos || photos);
    const profSan = await sanitizeProfileForSync(customProfile || profile, warnings);
    const brandSan = await sanitizeBrandAssetsForSync(customBrandAssets || brandAssets, warnings);
    warnings.push(...projSan.warnings, ...photoSan.warnings);

    if (projSan.changed) setProjects(projSan.items);
    if (photoSan.changed) setPhotos(photoSan.items);
    if (profSan.changed) setProfile(profSan.value);
    if (brandSan.changed) setBrandAssets(brandSan.value);
    setSyncWarnings(warnings);
    for (const w of warnings) console.warn('Sync aviso:', w);

    const projectsToSync = projSan.items;
    const photosToSync = photoSan.items;
    const profileToSync = profSan.value;
    const brandAssetsToSync = brandSan.value;
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

    // 3. Save live to Cloudflare D1 via Functions API
    try {
      const body = JSON.stringify(payload);
      // D1 no tiene el límite de 25 MB por valor de KV, pero el request body
      // de Pages Functions sí (~100 MB). Guarda de seguridad a 50 MB.
      const MAX_PAYLOAD_BYTES = 50 * 1024 * 1024;
      if (body.length > MAX_PAYLOAD_BYTES) {
        const msg = `Sync abortado: el payload pesa ${(body.length / 1024 / 1024).toFixed(1)} MB (límite de seguridad 50 MB). Usa URLs externas para imágenes pesadas.`;
        console.error(msg);
        setCloudSyncStatus('error');
        setCloudSyncError(msg);
        return false;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = getSyncToken();
      if (token) headers['x-sync-key'] = token;

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers,
        body
      });
      const data = await res.json();

      if (res.status === 401) {
        setCloudSyncStatus('error');
        setCloudSyncError('Token de sincronización inválido: cierra y vuelve a iniciar sesión en el dashboard');
        return false;
      }

      if (data && (data.bound === false || data.status === 'unbound')) {
        setCloudSyncStatus('unbound');
        setCloudSyncError('Base de datos no vinculada en Cloudflare Pages (PORTFOLIO_D1)');
        return false;
      }

      if (data && data.success) {
        if (Array.isArray(data.skippedOversized) && data.skippedOversized.length > 0) {
          const msg = `El servidor omitió ${data.skippedOversized.length} fila(s) que exceden 1 MB: ${data.skippedOversized.join(', ')}. Reduce el peso de sus imágenes o usa URLs externas.`;
          console.warn('Sync aviso:', msg);
          setSyncWarnings(prev => [...prev, msg]);
        }
        setCloudSyncStatus('synced');
        return true;
      }

      setCloudSyncStatus('error');
      setCloudSyncError(data?.message || data?.error || 'No se pudo guardar en Cloudflare D1');
      return false;
    } catch (e: any) {
      console.warn('Cloudflare D1 sync notice (saved locally in IndexedDB):', e);
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

  // Secure Auth check using SHA-256 password hash comparison + server token
  const loginAdmin = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    const isUserValid = usernameInput.trim() === ADMIN_USERNAME;
    const inputHash = await hashPassword(passwordInput);
    const isPassValid = inputHash === ADMIN_PASSWORD_HASH;

    if (isUserValid && isPassValid) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'admin_session', 'active');
      } catch (e) {}

      // Obtener token de escritura del servidor (/api/auth). Si el servidor
      // no tiene auth configurada, responde configured:false y se opera en
      // modo abierto (compatibilidad con despliegues sin SYNC_SECRET).
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput.trim(), password: passwordInput })
        });
        const data = await res.json();
        if (data?.success && data?.token) {
          sessionStorage.setItem(SYNC_TOKEN_KEY, data.token);
        } else {
          sessionStorage.removeItem(SYNC_TOKEN_KEY);
        }
      } catch (e) {
        // Sin conexión con la API: modo local, el sync avisará si falla
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'admin_session');
      sessionStorage.removeItem(SYNC_TOKEN_KEY);
    } catch (e) {}
  };

  // CRUD Operations with instant IndexedDB & Cloudflare D1 sync
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
    // Enviar TODO el set inicial (no solo proyectos) para que la nube
    // quede consistente con el reset.
    syncToCloud(initialProjects, initialPhotos, initialProfile, initialBrandAssets, initialStats);
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
        syncWarnings,
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

