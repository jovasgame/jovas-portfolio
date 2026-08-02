import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory, ProjectSpec, SocialLinkItem, PhotoItem } from '../types';
import { ImageUploader } from './ImageUploader';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Search, 
  X, 
  Check, 
  Save, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  User, 
  BarChart3, 
  Sparkles, 
  Flame, 
  RefreshCw,
  Eye,
  ExternalLink,
  Layers,
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Copy,
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  Sliders,
  Mail,
  CheckCircle2,
  AlertCircle,
  Share2,
  Camera
} from 'lucide-react';
import { parseMediaUrl } from '../utils/mediaUtils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onCloseDashboard: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCloseDashboard }) => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    photos,
    addPhotoItem,
    updatePhotoItem,
    deletePhotoItem,
    messages,
    markMessageAsRead,
    deleteMessage,
    profile,
    updateProfile,
    brandAssets,
    updateBrandAssets,
    stats,
    logoutAdmin,
    resetToDefaults,
    syncToCloud
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'photos' | 'profile' | 'brand' | 'images' | 'messages'>('stats');
  
  // Search & Filter in Dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Edit/Create Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Edit/Create Photo Modal state
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isCreatingPhoto, setIsCreatingPhoto] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Retrato');
  const [photoImageUrl, setPhotoImageUrl] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoCameraSpecs, setPhotoCameraSpecs] = useState('');

  const openCreatePhotoModal = () => {
    setEditingPhoto(null);
    setIsCreatingPhoto(true);
    setPhotoTitle('');
    setPhotoCategory('Retrato');
    setPhotoImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80');
    setPhotoDescription('');
    setPhotoCameraSpecs('Sony A7IV • 85mm f/1.4 • ISO 400');
  };

  const openEditPhotoModal = (p: PhotoItem) => {
    setEditingPhoto(p);
    setIsCreatingPhoto(false);
    setPhotoTitle(p.title);
    setPhotoCategory(p.category);
    setPhotoImageUrl(p.imageUrl);
    setPhotoDescription(p.description || '');
    setPhotoCameraSpecs(p.cameraSpecs || '');
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle || !photoImageUrl) return;

    if (isCreatingPhoto) {
      addPhotoItem({
        title: photoTitle,
        category: photoCategory,
        imageUrl: photoImageUrl,
        description: photoDescription || undefined,
        cameraSpecs: photoCameraSpecs || undefined
      });
      showToast('¡Fotografía agregada con éxito a la galería!');
    } else if (editingPhoto) {
      updatePhotoItem(editingPhoto.id, {
        title: photoTitle,
        category: photoCategory,
        imageUrl: photoImageUrl,
        description: photoDescription || undefined,
        cameraSpecs: photoCameraSpecs || undefined
      });
      showToast('¡Fotografía actualizada exitosamente!');
    }

    setEditingPhoto(null);
    setIsCreatingPhoto(false);
    setTimeout(() => {
      syncToCloud();
    }, 100);
  };

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Animación');
  const [year, setYear] = useState('2024');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [client, setClient] = useState('');
  const [featured, setFeatured] = useState(false);

  // Specifications
  const [specs, setSpecs] = useState<ProjectSpec[]>([]);

  // Profile & Brand Form State
  const [profileName, setProfileName] = useState(profile.name);
  const [profileTitle, setProfileTitle] = useState(profile.title);
  const [profileBio, setProfileBio] = useState(profile.bioParagraphs.join('\n\n'));
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears);
  const [projectsCount, setProjectsCount] = useState(profile.projectsCompletedCount);
  const [heroText, setHeroText] = useState(brandAssets.heroText);
  const [profileAvatar, setProfileAvatar] = useState(profile.avatarUrl || '');
  const [heroBgUrl, setHeroBgUrl] = useState(brandAssets.heroBgUrl || '');
  const [logoUrl, setLogoUrl] = useState(brandAssets.logoUrl || '');
  const [metallicIconUrl, setMetallicIconUrl] = useState(brandAssets.metallicIconUrl || '');
  const [brandText, setBrandText] = useState(brandAssets.brandText || 'JOVAS');
  const [brandSubtext, setBrandSubtext] = useState(brandAssets.brandSubtext || 'Motion Design');

  // Dynamic Social Media Links List State
  const [socialLinksList, setSocialLinksList] = useState<SocialLinkItem[]>(() => {
    if (profile.customSocialLinks && profile.customSocialLinks.length > 0) {
      return profile.customSocialLinks;
    }
    return [
      { id: '1', name: 'Instagram', url: profile.socialLinks?.instagram || 'https://instagram.com', icon: 'instagram' },
      { id: '2', name: 'ArtStation', url: profile.socialLinks?.artstation || 'https://artstation.com', icon: 'artstation' },
      { id: '3', name: 'Vimeo', url: profile.socialLinks?.vimeo || 'https://vimeo.com', icon: 'vimeo' },
      { id: '4', name: 'LinkedIn', url: profile.socialLinks?.linkedin || 'https://linkedin.com', icon: 'linkedin' }
    ];
  });

  const handleAddSocialLink = () => {
    setSocialLinksList(prev => [
      ...prev,
      { id: Date.now().toString(), name: 'Nueva Red', url: 'https://', icon: 'globe' }
    ]);
  };

  const handleUpdateSocialLink = (id: string, field: keyof SocialLinkItem, val: string) => {
    setSocialLinksList(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteSocialLink = (id: string) => {
    setSocialLinksList(prev => prev.filter(item => item.id !== id));
  };

  // Feedback toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleMediaUrlChange = (val: string) => {
    setMediaUrl(val);
    if (!val) {
      setImageUrl('');
      setVideoUrl('');
      return;
    }
    const parsed = parseMediaUrl(val);
    if (parsed.type === 'video' || parsed.type === 'iframe') {
      setVideoUrl(val);
      if (!imageUrl || imageUrl.includes('unsplash')) {
        setImageUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80');
      }
    } else {
      setImageUrl(val);
      setVideoUrl('');
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsCreatingNew(true);
    setTitle('');
    setCategory('Animación');
    setYear('2024');
    setDescription('');
    setFullDescription('');
    setImageUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80');
    setVideoUrl('');
    setMediaUrl('');
    setTagsInput('Motion Graphics, 3D Render');
    setClient('');
    setFeatured(false);
    setSpecs([
      { label: 'Resolución', value: '4K Ultra HD' },
      { label: 'FPS', value: '60 FPS' }
    ]);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setIsCreatingNew(false);
    setTitle(p.title);
    setCategory(p.category);
    setYear(p.year);
    setDescription(p.description);
    setFullDescription(p.fullDescription || p.description);
    setImageUrl(p.imageUrl);
    setVideoUrl(p.videoUrl || '');
    setMediaUrl(p.videoUrl || p.imageUrl || '');
    setTagsInput(p.tags.join(', '));
    setClient(p.client || '');
    setFeatured(p.featured);
    setSpecs(p.specs || []);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (isCreatingNew) {
      addProject({
        title,
        category,
        year,
        description,
        fullDescription,
        imageUrl,
        videoUrl: videoUrl || undefined,
        tags: tagsArray,
        featured,
        client: client || undefined,
        specs
      });
      showToast('¡Proyecto creado con éxito en tiempo real!');
    } else if (editingProject) {
      updateProject(editingProject.id, {
        title,
        category,
        year,
        description,
        fullDescription,
        imageUrl,
        videoUrl: videoUrl || undefined,
        tags: tagsArray,
        featured,
        client: client || undefined,
        specs
      });
      showToast('¡Proyecto actualizado en tiempo real!');
    }

    setEditingProject(null);
    setIsCreatingNew(false);
    setTimeout(() => {
      syncToCloud();
    }, 100);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const paragraphs = profileBio.split('\n\n').filter(Boolean);
    updateProfile({
      name: profileName,
      title: profileTitle,
      bioParagraphs: paragraphs,
      experienceYears,
      projectsCompletedCount: projectsCount,
      avatarUrl: profileAvatar,
      customSocialLinks: socialLinksList
    });
    updateBrandAssets({
      heroText,
      heroBgUrl,
      logoUrl,
      brandText,
      brandSubtext,
      metallicIconUrl
    });
    showToast('¡Información de biografía y redes guardadas exitosamente!');
    setTimeout(() => {
      syncToCloud();
    }, 100);
  };

  const handleSaveBrand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      customSocialLinks: socialLinksList
    });
    updateBrandAssets({
      logoUrl,
      brandText,
      brandSubtext,
      heroText,
      heroBgUrl,
      metallicIconUrl
    });
    showToast('¡Identidad de marca y redes sociales guardadas en la nube!');
    setTimeout(() => {
      syncToCloud();
    }, 100);
  };

  const handleAddSpec = () => {
    setSpecs(prev => [...prev, { label: 'Nuevo Parámetro', value: 'Valor' }]);
  };

  const handleUpdateSpec = (index: number, label: string, value: string) => {
    setSpecs(prev => {
      const copy = [...prev];
      copy[index] = { label, value };
      return copy;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const navigationItems = [
    { id: 'stats', label: 'Vista General & Métricas', icon: BarChart3 },
    { id: 'projects', label: 'Gestión de Proyectos', icon: FolderKanban, count: projects.length },
    { id: 'photos', label: 'Galería de Fotografía', icon: Camera, count: photos.length },
    { id: 'profile', label: 'Perfil & Biografía', icon: User },
    { id: 'brand', label: 'Identidad & Marca', icon: Sparkles },
    { id: 'images', label: 'Galería de Medios', icon: ImageIcon },
    { id: 'messages', label: 'Bandeja de Entrada', icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-[#0b0911] text-[#e2e8f0] font-sans flex flex-col lg:flex-row selection:bg-[#ff5540] selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Glow Orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-[#ff5540]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-0 w-96 h-96 bg-[#feba39]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#1f1b29] text-white px-5 py-3.5 rounded-2xl font-bold shadow-2xl flex items-center gap-3 text-xs border border-[#feba39]/50 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-[#feba39] animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT VERTICAL SIDEBAR NAVIGATION RAIL */}
      <aside className="w-full lg:w-72 bg-[#120f1a]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 z-40 relative shrink-0">
        <div className="space-y-8">
          
          {/* Sidebar Top Header Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px] shadow-lg shadow-[#ff5540]/25">
                <div className="w-full h-full bg-[#181423] rounded-[15px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#feba39]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-syne font-black text-lg text-white tracking-wider uppercase flex items-center gap-1.5">
                  JOVAS ADMIN
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <span className="text-[10px] font-mono text-[#a89f9e] tracking-widest uppercase">
                  Control Center v2.0
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseDashboard}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vertical Menu Nav List */}
          <nav className="space-y-2">
            <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8e859b]">
              Menú Principal
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff5540]/20 to-[#feba39]/20 text-white border border-[#feba39]/40 shadow-lg shadow-[#ff5540]/10'
                      : 'text-[#a89f9e] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#feba39]" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#feba39]' : 'text-[#a89f9e]'}`} />
                    <span className="font-syne tracking-wide">{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white">
                      {item.count}
                    </span>
                  )}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ff5540] text-[10px] font-mono text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Footer Profile & Actions */}
        <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#191524] border border-white/10 flex items-center gap-3">
            <img
              src={profile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA"}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-[#feba39]/30"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-syne font-bold text-xs text-white truncate">
                JovasMotion
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admin Activo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onCloseDashboard}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              title="Volver a la vista pública del sitio"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#feba39]" />
              <span>Ver Sitio</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
              title="Cerrar Sesión de Administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        
        {/* Top Header Workspace Bar */}
        <header className="sticky top-0 z-30 bg-[#120f1a]/85 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-syne font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              Panel de Control Corporativo
              <span className="px-2.5 py-0.5 rounded-full bg-[#feba39]/10 text-[#feba39] text-[10px] font-mono font-bold border border-[#feba39]/30">
                Cloud Sync Enabled
              </span>
            </h1>
            <p className="text-xs font-mono text-[#a89f9e] mt-0.5">
              Administración integral en tiempo real &bull; Motion Design & Arte 3D
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <button
              onClick={async () => {
                showToast('Sincronizando con la nube...');
                const success = await syncToCloud();
                if (success) {
                  showToast('⚡ ¡Sitio actualizado globalmente en Cloudflare KV!');
                } else {
                  showToast('¡Datos guardados localmente!');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-900/30 border border-emerald-400/40"
            >
              <Globe className="w-4 h-4 text-emerald-200 animate-spin-slow" />
              <span>Publicar a Todo el Mundo</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Proyecto</span>
            </button>
          </div>
        </header>

        {/* MAIN TAB CONTENT CONTAINER */}
        <main className="p-6 lg:p-8 space-y-8 flex-1">

          {/* TAB 1: OVERVIEW & STATS (Matching reference design) */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              
              {/* Bento Grid Row 1: Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div className="p-6 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#a89f9e] uppercase tracking-wider">
                      Proyectos Publicados
                    </span>
                    <FolderKanban className="w-5 h-5 text-[#ff5540]" />
                  </div>
                  <div className="font-syne font-black text-4xl text-white mb-2">
                    {projects.length}
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" /> 100% Sincronizado en Nube
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="p-6 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#a89f9e] uppercase tracking-wider">
                      Visitas Estimadas
                    </span>
                    <Eye className="w-5 h-5 text-[#feba39]" />
                  </div>
                  <div className="font-syne font-black text-4xl text-white mb-2">
                    {stats.totalViews}
                  </div>
                  <span className="text-[11px] text-[#feba39] font-mono">
                    +18.4% este mes
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-6 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#a89f9e] uppercase tracking-wider">
                      Mensajes & Leads
                    </span>
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="font-syne font-black text-4xl text-white mb-2">
                    {messages.length}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {unreadCount} sin leer
                  </span>
                </div>

                {/* Metric 4 */}
                <div className="p-6 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#a89f9e] uppercase tracking-wider">
                      Años de Trayectoria
                    </span>
                    <Flame className="w-5 h-5 text-[#ff5540]" />
                  </div>
                  <div className="font-syne font-black text-4xl text-white mb-2">
                    {profile.experienceYears}
                  </div>
                  <span className="text-[11px] font-mono text-[#a89f9e]">
                    Motion & Arte 3D
                  </span>
                </div>

              </div>

              {/* Bento Grid Row 2: Performance Graphs & System Status (Ref Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: System Activity & Cloud State */}
                <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-syne font-bold text-lg text-white">
                        Rendimiento del Portafolio & Actividad
                      </h3>
                      <p className="text-xs text-[#a89f9e] font-mono">
                        Estado operativo de entrega de medios y velocidad GPU
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> 99.9% Optimal
                    </span>
                  </div>

                  {/* Simulated Neon Chart Bar UI */}
                  <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                    {[65, 80, 45, 90, 75, 100, 85, 95, 70, 90, 85, 98].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-white/5 rounded-t-xl h-36 relative overflow-hidden flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="w-full bg-gradient-to-t from-[#ff5540] to-[#feba39] rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#a89f9e]">
                          {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Quick Tools & Status */}
                <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-syne font-bold text-lg text-white mb-1">
                      Herramientas en Uso
                    </h3>
                    <p className="text-xs text-[#a89f9e] font-mono mb-6">
                      Software y motores de render 3D
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {['Cinema 4D', 'Redshift', 'After Effects', 'Substance', 'ZBrush', 'Houdini'].map((tool, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                          <Zap className="w-4 h-4 text-[#feba39]" />
                          <span className="text-xs font-bold text-white">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#a89f9e] font-mono">
                    <span>Base de Datos KV:</span>
                    <span className="text-emerald-400 font-bold">Cloudflare Pages</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#191524]/90 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar proyecto por nombre o tag..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#feba39]"
                    />
                    <Search className="w-4 h-4 text-[#a89f9e] absolute left-3.5 top-3" />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white text-xs cursor-pointer focus:outline-none"
                  >
                    <option value="Todos">Todas las Categorías</option>
                    <option value="Animación">Animación</option>
                    <option value="Ilustración">Ilustración</option>
                    <option value="Modelado 3D">Modelado 3D</option>
                    <option value="Arte Conceptual">Arte Conceptual</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetToDefaults}
                    className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#a89f9e] text-xs font-mono border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restablecer</span>
                  </button>

                  <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-[#191524]/90 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[#a89f9e] font-mono uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Proyecto / Portada</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Año</th>
                        <th className="p-4 text-center">Slider Destacado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                            />
                            <div>
                              <span className="font-bold text-white text-sm block">{proj.title}</span>
                              <span className="text-[11px] text-[#a89f9e] line-clamp-1">{proj.description}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[#feba39] border border-white/10 font-bold text-[11px]">
                              {proj.category}
                            </span>
                          </td>

                          <td className="p-4 font-mono text-[#a89f9e]">
                            {proj.year}
                          </td>

                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                toggleFeatured(proj.id);
                                showToast(`Estado destacado de "${proj.title}" actualizado.`);
                              }}
                              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                                proj.featured
                                  ? 'bg-[#feba39]/20 border-[#feba39] text-[#feba39]'
                                  : 'bg-white/5 border-white/10 text-[#a89f9e] hover:text-white'
                              }`}
                              title={proj.featured ? "Quitar de Destacados" : "Destacar en Slider"}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(proj)}
                                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer"
                                title="Editar Proyecto"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar el proyecto "${proj.title}"?`)) {
                                    deleteProject(proj.id);
                                    showToast('Proyecto eliminado en tiempo real');
                                  }
                                }}
                                className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                                title="Eliminar Proyecto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProjects.length === 0 && (
                  <div className="p-12 text-center text-[#a89f9e]">
                    No se encontraron proyectos con ese criterio.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY GALLERY MANAGER */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#191524]/90 p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <div>
                  <h2 className="font-syne font-bold text-xl text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#feba39]" />
                    Gestión de Galería Fotográfica
                  </h2>
                  <p className="text-xs text-[#a89f9e] font-mono">
                    Agrega, edita o elimina fotografías capturadas para la sección pública del portafolio.
                  </p>
                </div>

                <button
                  onClick={openCreatePhotoModal}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Fotografía</span>
                </button>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-4 rounded-3xl bg-[#191524]/90 border border-white/10 flex flex-col justify-between gap-4 shadow-xl backdrop-blur-xl hover:border-[#feba39]/40 transition-all group"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#feba39] font-bold border border-white/15 uppercase">
                        {photo.category}
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-syne font-bold text-base text-white">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-xs text-[#a89f9e] line-clamp-2">{photo.description}</p>
                      )}
                      {photo.cameraSpecs && (
                        <p className="text-[11px] font-mono text-[#feba39] truncate pt-1">
                          📷 {photo.cameraSpecs}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#a89f9e]">{photo.createdAt}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditPhotoModal(photo)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer"
                          title="Editar Fotografía"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la fotografía "${photo.title}"?`)) {
                              deletePhotoItem(photo.id);
                              showToast('Fotografía eliminada');
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Eliminar Fotografía"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {photos.length === 0 && (
                <div className="p-12 text-center text-[#a89f9e] bg-[#191524]/90 rounded-3xl border border-white/10 font-mono text-xs">
                  No hay fotografías registradas aún en la galería. Clic en "Agregar Fotografía" para añadir una.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDIT PROFILE BIO */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne font-bold text-xl text-white">
                    Editar Biografía & Manifiesto Creativo
                  </h2>
                  <p className="text-xs text-[#a89f9e] font-mono">
                    Los cambios realizados aquí se reflejarán instantáneamente en la sección Biografía.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Nombre Artístico</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Título Profesional</label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Años de Experiencia</label>
                      <input
                        type="text"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Proyectos Completados</label>
                      <input
                        type="text"
                        value={projectsCount}
                        onChange={(e) => setProjectsCount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Foto de Perfil / Avatar</label>
                    <ImageUploader
                      value={profileAvatar}
                      onChange={(newUrl) => setProfileAvatar(newUrl)}
                      allowVideo={false}
                      label="Subir o Vincular Avatar de Perfil"
                      helperText="Sube una foto o ilustración desde tu equipo (PNG, JPG, WEBP, SVG) o pega un enlace."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Párrafos de Biografía (Separados por doble enter)</label>
                    <textarea
                      rows={6}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios de Biografía
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: BRAND & LOGO */}
          {activeTab === 'brand' && (
            <div className="max-w-4xl space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne font-bold text-xl text-white">
                    Configuración de Marca & Logo SVG/PNG
                  </h2>
                  <p className="text-xs text-[#a89f9e] font-mono">
                    Personaliza la imagen corporativa y textos del encabezado principal.
                  </p>
                </div>

                <form onSubmit={handleSaveBrand} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Nombre Principal de la Marca</label>
                      <input
                        type="text"
                        value={brandText}
                        onChange={(e) => setBrandText(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Subtítulo / Especialidad</label>
                      <input
                        type="text"
                        value={brandSubtext}
                        onChange={(e) => setBrandSubtext(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Logo Personalizado (PNG o SVG)</label>
                    <ImageUploader
                      value={logoUrl}
                      onChange={(newUrl) => setLogoUrl(newUrl)}
                      allowVideo={false}
                      label="Subir o Vincular Logo SVG/PNG"
                      helperText="Selecciona un archivo SVG o PNG desde tu computadora, arrástralo aquí o pega un enlace de imagen."
                    />
                  </div>

                  {logoUrl && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-[#a89f9e]">Vista previa de Logo Activo:</span>
                      <div className="p-2.5 rounded-xl bg-[#141316] border border-[#feba39]/30">
                        <img src={logoUrl} alt="Logo Preview" className="h-10 max-w-[180px] object-contain" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2 font-bold text-[#feba39]">Ícono por Defecto para el Efecto Metálico (MetallicPaint Header)</label>
                    <ImageUploader
                      value={metallicIconUrl}
                      onChange={(newUrl) => setMetallicIconUrl(newUrl)}
                      allowVideo={false}
                      label="Subir o Vincular Ícono Metálico SVG/PNG"
                      helperText="Sube o vincula tu logo/icono personalizado (SVG o PNG) para animarlo con el efecto WebGL de metal líquido en el banner principal."
                    />
                  </div>

                  {/* DYNAMIC SOCIAL MEDIA LINKS MANAGER LIST */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-syne font-bold text-base text-white flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-[#feba39]" />
                          Redes Sociales & Enlaces del Pie de Página (Footer)
                        </h3>
                        <p className="text-xs text-[#a89f9e] font-mono">
                          Agrega, edita o elimina redes sociales e íconos dinámicos en el footer.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="px-3.5 py-2 rounded-xl bg-[#feba39]/15 hover:bg-[#feba39]/25 text-[#feba39] border border-[#feba39]/40 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Agregar Red Social
                      </button>
                    </div>

                    <div className="space-y-3">
                      {socialLinksList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                        >
                          <div className="flex items-center gap-2 sm:w-1/3">
                            <select
                              value={item.icon || 'globe'}
                              onChange={(e) => handleUpdateSocialLink(item.id, 'icon', e.target.value)}
                              className="px-2.5 py-2.5 rounded-xl bg-[#1e1c21] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#feba39]"
                            >
                              <option value="instagram">Instagram</option>
                              <option value="artstation">ArtStation</option>
                              <option value="vimeo">Vimeo</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="youtube">YouTube</option>
                              <option value="twitter">Twitter / X</option>
                              <option value="globe">Otro Enlace</option>
                            </select>

                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateSocialLink(item.id, 'name', e.target.value)}
                              placeholder="Nombre (ej. Instagram)"
                              className="w-full px-3 py-2.5 rounded-xl bg-[#1e1c21] border border-white/15 text-white text-xs focus:outline-none focus:border-[#feba39]"
                            />
                          </div>

                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => handleUpdateSocialLink(item.id, 'url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2.5 rounded-xl bg-[#1e1c21] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#feba39]"
                            />

                            <button
                              type="button"
                              onClick={() => handleDeleteSocialLink(item.id)}
                              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer shrink-0"
                              title="Eliminar Red Social"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Marca y Redes Sociales
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA GALLERY MANAGER */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#191524]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                <ImageUploader
                  value={mediaUrl}
                  onChange={handleMediaUrlChange}
                  allowVideo={true}
                  label="Gestor & Carga de Medios Portafolio"
                  helperText="Carga o vincula imágenes y videos (Drive, YouTube, Vimeo, MP4) para utilizarlos en tus obras."
                />
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES & INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="font-syne font-bold text-xl text-white">
                Bandeja de Entrada ({messages.length})
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-3xl border transition-all ${
                      msg.read
                        ? 'bg-[#191524]/90 border-white/10'
                        : 'bg-[#211b30] border-[#feba39]/50 shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="font-syne font-bold text-base text-white block">{msg.name}</span>
                        <span className="font-mono text-xs text-[#feba39]">{msg.email}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a89f9e]">{msg.date}</span>
                    </div>

                    <p className="text-xs text-[#e7e1e5]/90 leading-relaxed mb-4">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Tu consulta en Jovas Motion`}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-mono border border-white/10 flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#feba39]" />
                        Responder por Email
                      </a>

                      {!msg.read && (
                        <button
                          onClick={() => {
                            markMessageAsRead(msg.id);
                            showToast('Mensaje marcado como leído');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Marcar Leído
                        </button>
                      )}

                      <button
                        onClick={() => {
                          deleteMessage(msg.id);
                          showToast('Mensaje eliminado');
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="p-12 text-center text-[#a89f9e] font-mono text-xs">
                    No tienes mensajes nuevos en tu bandeja de entrada.
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE & EDIT PROJECT MODAL SLIDE-OVER */}
      <AnimatePresence>
        {(isCreatingNew || editingProject) && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md">
            
            {/* Backdrop Click */}
            <div
              className="fixed inset-0"
              onClick={() => {
                setEditingProject(null);
                setIsCreatingNew(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl h-full bg-[#14111d] border-l border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-syne font-black text-xl text-white">
                    {isCreatingNew ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
                  </h2>
                  <p className="text-xs font-mono text-[#a89f9e]">
                    Configura los detalles de la obra para el portafolio 3D
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingNew(false);
                  }}
                  className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Título del Proyecto *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Cybernetic Neon Core 3D"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                    >
                      <option value="Animación">Animación</option>
                      <option value="Ilustración">Ilustración</option>
                      <option value="Modelado 3D">Modelado 3D</option>
                      <option value="Arte Conceptual">Arte Conceptual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Año</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">URL del Video / Demostración o Imagen Portada *</label>
                  <input
                    type="text"
                    required
                    value={mediaUrl}
                    onChange={(e) => handleMediaUrlChange(e.target.value)}
                    placeholder="Enlace MP4, Vimeo, YouTube o URL de imagen..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Descripción Corta</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Etiquetas / Tags (Separadas por comas)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Motion Graphics, Cinema 4D, Octane, Redshift"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#feba39] cursor-pointer"
                  />
                  <label htmlFor="featured-check" className="text-xs font-bold text-white cursor-pointer">
                    Destacar en el Slider Principal de la Página de Inicio
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#a89f9e] text-xs font-bold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Proyecto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PHOTO EDIT / CREATE MODAL */}
      <AnimatePresence>
        {(isCreatingPhoto || editingPhoto) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#181522] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#feba39]" />
                  <h3 className="font-syne font-bold text-lg text-white">
                    {isCreatingPhoto ? 'Agregar Nueva Fotografía' : 'Editar Fotografía'}
                  </h3>
                </div>
                <button
                  onClick={() => { setIsCreatingPhoto(false); setEditingPhoto(null); }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Título de Fotografía *</label>
                    <input
                      type="text"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="Ej. Retrato Urbano Nocturno"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Categoría *</label>
                    <input
                      type="text"
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value)}
                      placeholder="Ej. Retrato, Arquitectura, Conceptual"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Imagen Fotográfica *</label>
                  <ImageUploader
                    value={photoImageUrl}
                    onChange={(newUrl) => setPhotoImageUrl(newUrl)}
                    allowVideo={false}
                    label="Subir o Seleccionar Fotografía"
                    helperText="Selecciona un archivo JPG/PNG/WEBP desde tu dispositivo o pega un enlace."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Especificaciones de Cámara / Lente</label>
                  <input
                    type="text"
                    value={photoCameraSpecs}
                    onChange={(e) => setPhotoCameraSpecs(e.target.value)}
                    placeholder="Ej. Sony A7IV • 85mm f/1.4 • ISO 400"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a89f9e] mb-2">Descripción o Historia de la Toma</label>
                  <textarea
                    rows={3}
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    placeholder="Detalles del claroscuro, iluminación o concepto fotográfico..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#feba39]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => { setIsCreatingPhoto(false); setEditingPhoto(null); }}
                    className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#a89f9e] text-xs font-bold font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Fotografía</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
