import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory, ProjectSpec } from '../types';
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
  Copy
} from 'lucide-react';
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
    messages,
    markMessageAsRead,
    deleteMessage,
    profile,
    updateProfile,
    brandAssets,
    updateBrandAssets,
    stats,
    logoutAdmin,
    resetToDefaults
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'profile' | 'brand' | 'images' | 'stats'>('projects');
  
  // Search & Filter in Dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Edit/Create Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Animación');
  const [year, setYear] = useState('2024');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
  const [brandText, setBrandText] = useState(brandAssets.brandText || 'JOVAS');
  const [brandSubtext, setBrandSubtext] = useState(brandAssets.brandSubtext || 'Motion Design');

  // Feedback toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
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
      avatarUrl: profileAvatar
    });
    updateBrandAssets({
      heroText,
      heroBgUrl,
      logoUrl,
      brandText,
      brandSubtext
    });
    showToast('¡Información de perfil e imágenes guardadas en tiempo real!');
  };

  const handleSaveBrand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateBrandAssets({
      logoUrl,
      brandText,
      brandSubtext,
      heroText,
      heroBgUrl
    });
    showToast('¡Logo y textos de marca guardados con éxito!');
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

  // Filtered projects list in dashboard
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans pb-20 selection:bg-[#38bdf8] selection:text-[#0f172a]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#0284c7] text-white px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 text-xs border border-[#38bdf8]/40"
          >
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Corporate Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#1e293b] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#38bdf8] p-[1px] shadow-lg shadow-[#0284c7]/20">
              <div className="w-full h-full bg-[#0f172a] rounded-[11px] flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-[#38bdf8]" />
              </div>
            </div>

            <div>
              <h1 className="font-syne font-bold text-lg text-white flex items-center gap-2 tracking-wide">
                JOVAS MOTION &bull; CONSOLA DE ADMINISTRACIÓN
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SISTEMA EN LINEA
                </span>
              </h1>
              <p className="text-[11px] font-mono text-[#94a3b8]">
                Panel Corporativo de Gestión en Tiempo Real &bull; Administrador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const exportedJson = JSON.stringify({ projects, profile, brandAssets }, null, 2);
                navigator.clipboard.writeText(exportedJson);
                showToast('¡Datos copiados al portapapeles! Puedes pegarlos o enviármelos para guardarlos en el código global.');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
              title="Copiar configuración actual para actualizar el sitio globalmente en todos los dispositivos"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              Copiar Datos Globales
            </button>

            <button
              onClick={onCloseDashboard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-semibold border border-[#334155] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#38bdf8]" />
              Ver Vista Pública
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Gestión de Proyectos ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer relative ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensajes & Leads
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Editar Biografía
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Logo & Marca (SVG/PNG)
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Gestor de Imágenes
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/20'
                : 'bg-white/5 text-[#a89f9e] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Métricas del Portafolio
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a181d] p-4 rounded-2xl border border-white/10">
              
              <div className="flex items-center gap-3 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título o tag..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#feba39]"
                  />
                  <Search className="w-4 h-4 text-[#a89f9e] absolute left-3.5 top-2.5" />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs cursor-pointer focus:outline-none"
                >
                  <option value="Todos">Todas las Categorías</option>
                  <option value="Animación">Animación</option>
                  <option value="Ilustración">Ilustración</option>
                  <option value="Modelado 3D">Modelado 3D</option>
                  <option value="Arte Conceptual">Arte Conceptual</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefaults}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a89f9e] text-xs font-mono border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  title="Restablecer proyectos iniciales"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restablecer
                </button>

                <button
                  onClick={openCreateModal}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-[#ff5540]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Nuevo Proyecto
                </button>
              </div>

            </div>

            {/* Projects Table / List */}
            <div className="bg-[#1a181d] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#232026] text-[#a89f9e] font-mono uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Obra / Título</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Año</th>
                      <th className="p-4 text-center">Slider Destacado</th>
                      <th className="p-4 text-right">Acciones en Tiempo Real</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProjects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">{proj.title}</span>
                            <span className="text-[11px] text-[#a89f9e] line-clamp-1">{proj.description}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#feba39] border border-white/10 font-bold">
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
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              proj.featured
                                ? 'bg-[#feba39]/20 border-[#feba39] text-[#feba39]'
                                : 'bg-white/5 border-white/10 text-[#a89f9e] hover:text-white'
                            }`}
                            title={proj.featured ? "Quitar de Destacados" : "Destacar en Slider Principal"}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(proj)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer"
                              title="Editar Proyecto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar el proyecto "${proj.title}" de tu portafolio?`)) {
                                  deleteProject(proj.id);
                                  showToast('Proyecto eliminado en tiempo real');
                                }
                              }}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
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
                  No se encontraron proyectos con ese criterio de búsqueda.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MESSAGES & LEADS */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="font-syne font-bold text-2xl text-white">
              Prospectos & Consultas Recibidas ({messages.length})
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    msg.read
                      ? 'bg-[#1a181d] border-white/10'
                      : 'bg-[#231f28] border-[#feba39]/40 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${msg.read ? 'bg-white/20' : 'bg-[#feba39] animate-ping'}`} />
                      <div>
                        <h3 className="font-bold text-white text-base">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-xs font-mono text-[#feba39] hover:underline">
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a89f9e]">
                        Servicio: {msg.projectType}
                      </span>
                      {msg.budget && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                          {msg.budget}
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#a89f9e]">{msg.date}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#e7e1e5] bg-black/40 p-4 rounded-xl border border-white/5 mb-4 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <button
                          onClick={() => markMessageAsRead(msg.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors font-mono cursor-pointer"
                        >
                          Marcar como Leído
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}?subject=Respuesta a tu consulta - Jovas Motion`}
                        className="px-3 py-1 rounded-lg bg-[#ff5540]/20 text-[#ff5540] hover:bg-[#ff5540]/30 transition-colors font-mono"
                      >
                        Responder por Correo
                      </a>
                    </div>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-400 hover:text-red-300 font-mono"
                    >
                      Eliminar Mensaje
                    </button>
                  </div>

                </div>
              ))}

              {messages.length === 0 && (
                <div className="p-12 text-center text-[#a89f9e] bg-[#1a181d] rounded-2xl border border-white/10">
                  No hay mensajes recibidos aún.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE & BRAND EDITING */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl bg-[#1a181d] p-8 rounded-3xl border border-white/10">
            <h2 className="font-syne font-bold text-2xl text-white border-b border-white/10 pb-4">
              Editar Información de José Luis Vasquez
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Nombre Comercial</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Título Profesional</label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Años de Experiencia</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Proyectos Liderados</label>
                  <input
                    type="text"
                    value={projectsCount}
                    onChange={(e) => setProjectsCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase">Título Hero Banner</label>
                <input
                  type="text"
                  value={heroText}
                  onChange={(e) => setHeroText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                />
              </div>

              {/* Profile Picture / Avatar Uploader */}
              <ImageUploader
                value={profileAvatar}
                onChange={setProfileAvatar}
                label="Foto de Perfil / Retrato de José Luis Vasquez"
                helperText="Sube tu propia foto de perfil o retrato personal para la sección 'Sobre Mí'"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase">Biografía (Separar párrafos con una línea vacía)</label>
                <textarea
                  rows={6}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase cursor-pointer"
              >
                Guardar Cambios de Perfil en Tiempo Real
              </button>
            </div>
          </form>
        )}

        {/* TAB 3.5: LOGO & MARCA (SVG / PNG & TEXTO) */}
        {activeTab === 'brand' && (
          <div className="space-y-8">
            <div className="bg-[#1a181d] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div>
                <h2 className="font-syne font-bold text-2xl text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#feba39]" />
                  Configuración de Logo & Identidad de Marca
                </h2>
                <p className="text-xs text-[#a89f9e] mt-1">
                  Sube tu propio archivo de logo (SVG vectorial, PNG transparente, JPG o WEBP) y personaliza el nombre y subtítulo de tu marca que se muestra en el menú principal y pie de página.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                {/* Left Column: Logo Uploader and Text Inputs */}
                <form onSubmit={handleSaveBrand} className="lg:col-span-7 space-y-6">
                  {/* Logo Image Uploader */}
                  <div className="space-y-2">
                    <ImageUploader
                      value={logoUrl}
                      onChange={(newUrl) => {
                        setLogoUrl(newUrl);
                        updateBrandAssets({ logoUrl: newUrl });
                        showToast('¡Logo actualizado!');
                      }}
                      label="Subir Isotipo / Logo de Marca (SVG o PNG)"
                      helperText="Selecciona o arrastra tu archivo de logo (Soporta SVG vectorial o PNG transparente)"
                    />
                  </div>

                  {/* Brand Main Text Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#feba39] uppercase flex items-center gap-1.5">
                      Texto Principal del Logo / Marca
                    </label>
                    <input
                      type="text"
                      required
                      value={brandText}
                      onChange={(e) => {
                        setBrandText(e.target.value);
                        updateBrandAssets({ brandText: e.target.value });
                      }}
                      placeholder="Ej: JOVAS"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-syne font-extrabold text-lg uppercase focus:outline-none focus:border-[#feba39]"
                    />
                    <p className="text-[11px] text-[#a89f9e]">
                      Este texto aparece en mayúsculas destacadas en la parte superior izquierda de la web.
                    </p>
                  </div>

                  {/* Brand Subtitle / Specialty Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#feba39] uppercase flex items-center gap-1.5">
                      Subtítulo / Especialidad de Marca
                    </label>
                    <input
                      type="text"
                      value={brandSubtext}
                      onChange={(e) => {
                        setBrandSubtext(e.target.value);
                        updateBrandAssets({ brandSubtext: e.target.value });
                      }}
                      placeholder="Ej: Motion Design"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs uppercase focus:outline-none focus:border-[#feba39]"
                    />
                    <p className="text-[11px] text-[#a89f9e]">
                      Aparece debajo del texto principal del logo con espaciado tipográfico.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5540]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Cambios de Marca
                    </button>
                  </div>
                </form>

                {/* Right Column: Live Navbar Preview */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-black/80 p-6 rounded-2xl border border-white/15 space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-mono text-[#feba39] font-bold uppercase flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-[#ff5540]" />
                        Vista Previa en Vivo
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                        ● Sincronizado
                      </span>
                    </div>

                    {/* Preview Navbar Header Widget */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-[#a89f9e] uppercase">Logotipo en Barra de Navegación (Header)</span>
                      
                      <div className="bg-[#141316] p-4 rounded-xl border border-white/20 flex items-center gap-3">
                        {logoUrl ? (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5540]/30 to-[#feba39]/30 p-[1px] shadow-lg shadow-[#ff5540]/20">
                            <div className="w-full h-full bg-[#1e1c21] rounded-[11px] p-1.5 flex items-center justify-center overflow-hidden">
                              <img
                                src={logoUrl}
                                alt={brandText || "Logo"}
                                className="w-full h-full object-contain filter drop-shadow"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px] shadow-lg shadow-[#ff5540]/20">
                            <div className="w-full h-full bg-[#1e1c21] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                              <Flame className="w-5 h-5 text-[#feba39]" />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="font-syne font-extrabold text-2xl tracking-wider text-white flex items-center gap-1 uppercase">
                            {brandText || 'JOVAS'}
                            <span className="text-[#ff5540] inline-block w-1.5 h-1.5 rounded-full bg-[#ff5540] animate-pulse"></span>
                          </span>
                          <span className="font-jetbrains text-[10px] tracking-widest text-[#a89f9e] uppercase -mt-1">
                            {brandSubtext || 'Motion Design'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preview Footer Widget */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono text-[#a89f9e] uppercase">Logotipo en Pie de Página (Footer)</span>
                      
                      <div className="bg-[#100f12] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        {logoUrl ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 border border-white/10 p-1 flex items-center justify-center">
                            <img
                              src={logoUrl}
                              alt={brandText || "Logo"}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px]">
                            <div className="w-full h-full bg-[#1e1c21] rounded-[7px] flex items-center justify-center">
                              <Flame className="w-4 h-4 text-[#feba39]" />
                            </div>
                          </div>
                        )}
                        <span className="font-syne font-extrabold text-lg text-white uppercase">
                          {brandText || 'JOVAS'} {brandSubtext ? ` - ${brandSubtext}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#feba39]/10 rounded-xl border border-[#feba39]/20 text-[11px] text-[#feba39]">
                      💡 Tip: Si subes un logo en formato SVG o PNG con fondo transparente, se integrará perfectamente con el diseño oscuro Neón.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GESTOR DE IMÁGENES Y SUBIDA */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="bg-[#1a181d] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h2 className="font-syne font-bold text-2xl text-white flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-[#feba39]" />
                  Gestor de Imágenes & Subida de Archivos Propios
                </h2>
                <p className="text-xs text-[#a89f9e] mt-1">
                  Sube tus propias imágenes directamente desde tu computador o dispositivo para utilizarlas en tus proyectos, perfil o banner de portada.
                </p>
              </div>

              {/* Upload New Custom Image Box */}
              <div className="pt-2">
                <ImageUploader
                  value=""
                  onChange={(newImg) => {
                    if (newImg) {
                      showToast('¡Imagen cargada! Selecciona abajo a qué proyecto o perfil asignarla.');
                    }
                  }}
                  label="Cargar Nueva Imagen a la Galería Local"
                  helperText="Selecciona cualquier archivo PNG, JPG, GIF o WEBP desde tu equipo"
                />
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="bg-[#1a181d] p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#ff5540]" />
                Foto de Perfil & Biografía ("Sobre Mí")
              </h3>

              <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-4 rounded-2xl border border-white/5">
                <img
                  src={profile.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA'}
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#feba39]"
                />
                <div className="flex-1 w-full space-y-2">
                  <span className="text-sm font-bold text-white block">{profile.name} — {profile.title}</span>
                  <p className="text-xs text-[#a89f9e]">Esta es la imagen principal que aparece en tu tarjeta biográfica.</p>
                  
                  <ImageUploader
                    value={profileAvatar}
                    onChange={(val) => {
                      setProfileAvatar(val);
                      updateProfile({ avatarUrl: val });
                      showToast('¡Foto de perfil actualizada!');
                    }}
                    label="Cambiar Foto de Perfil"
                    helperText="Sube tu archivo propio para reemplazar esta foto"
                  />
                </div>
              </div>
            </div>

            {/* Projects Image Gallery */}
            <div className="space-y-4">
              <h3 className="font-syne font-bold text-xl text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#feba39]" />
                Imágenes de los Proyectos ({projects.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-[#1a181d] p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden h-44 border border-white/10">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#feba39] border border-white/10 font-bold">
                          {proj.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-base">{proj.title}</h4>
                        <p className="text-xs text-[#a89f9e] line-clamp-1">{proj.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <ImageUploader
                        value={proj.imageUrl}
                        onChange={(newUrl) => {
                          if (newUrl) {
                            updateProject(proj.id, { imageUrl: newUrl });
                            showToast(`¡Imagen de "${proj.title}" actualizada!`);
                          }
                        }}
                        label="Modificar / Subir Nueva Imagen"
                        helperText="Reemplaza la portada de este proyecto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: METRICS */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#1a181d] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#a89f9e] uppercase block">Visualizaciones Totales</span>
              <span className="font-syne font-black text-3xl text-white block">{stats.totalViews}</span>
              <span className="text-[10px] text-emerald-400 font-mono">+18% este mes</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a181d] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#a89f9e] uppercase block">Oportunidades / Leads</span>
              <span className="font-syne font-black text-3xl text-[#feba39] block">{stats.newLeadsCount}</span>
              <span className="text-[10px] text-[#a89f9e] font-mono">Recibidos vía formulario</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a181d] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#a89f9e] uppercase block">Proyectos Activos</span>
              <span className="font-syne font-black text-3xl text-[#ff5540] block">{projects.length}</span>
              <span className="text-[10px] text-white/60 font-mono">En catálogo live</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a181d] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#a89f9e] uppercase block">Tasa de Retención</span>
              <span className="font-syne font-black text-3xl text-emerald-400 block">{stats.retentionRate}</span>
              <span className="text-[10px] text-[#a89f9e] font-mono">Clientes recurrentes</span>
            </div>
          </div>
        )}

      </main>

      {/* CREATE / EDIT PROJECT MODAL */}
      {(isCreatingNew || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1e1c21] border border-[#feba39]/30 rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-syne font-black text-2xl text-white">
                {isCreatingNew ? 'Añadir Nuevo Proyecto' : `Editar: ${editingProject?.title}`}
              </h3>
              <button
                onClick={() => { setIsCreatingNew(false); setEditingProject(null); }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Título del Proyecto</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Ignis Core 3D"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm cursor-pointer"
                  >
                    <option value="Animación">Animación</option>
                    <option value="Ilustración">Ilustración</option>
                    <option value="Modelado 3D">Modelado 3D</option>
                    <option value="Arte Conceptual">Arte Conceptual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Año</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#a89f9e] uppercase">Cliente / Marca</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Ej: Jovas Original"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Imagen Principal del Proyecto"
                helperText="Sube tu archivo de imagen propia desde tu equipo, conecta Google Drive o selecciona un enlace"
              />

              <ImageUploader
                value={videoUrl}
                onChange={setVideoUrl}
                label="Video / Reel Demo del Proyecto (Opcional)"
                helperText="Sube tu video (MP4/WEBM), selecciona tu video de Google Drive o pega un enlace de streaming"
                allowVideo={true}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase">Resumen Corto (Para Tarjetas)</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase">Descripción Completa (Modal Detalle)</label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase">Tags (Separados por coma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="After Effects, Cinema 4D, Redshift"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                />
              </div>

              {/* Dynamic Specs List */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#feba39] uppercase font-bold">Ficha Técnica & Especificaciones</label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs text-[#ff5540] hover:underline font-mono"
                  >
                    + Añadir Parámetro
                  </button>
                </div>

                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, e.target.value, spec.value)}
                      placeholder="Ej: Polígonos"
                      className="w-1/2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, spec.label, e.target.value)}
                      placeholder="Ej: 2.4M"
                      className="w-1/2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-black border-white/20 text-[#feba39]"
                  />
                  Destacar este proyecto en el Slider Principal
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreatingNew(false); setEditingProject(null); }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase"
                >
                  Guardar en Tiempo Real
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
