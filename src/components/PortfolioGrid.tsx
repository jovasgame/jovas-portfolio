import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { Sparkles, Eye, Star, Plus, Film, Palette, Box, Image as ImageIcon, Flame } from 'lucide-react';
import { ProjectCategory, Project } from '../types';
import { MediaViewer } from './MediaViewer';
import { getDirectHoverVideoUrl, parseMediaUrl } from '../utils/mediaUtils';

interface ProjectCardProps {
  project: Project;
  index: number;
  getCategoryBadgeColor: (cat: ProjectCategory) => string;
  isAdminLoggedIn: boolean;
  toggleFeatured: (id: string) => void;
  setSelectedProjectForModal: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  getCategoryBadgeColor,
  isAdminLoggedIn,
  toggleFeatured,
  setSelectedProjectForModal,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if project is a video or animation item
  const isVideoOrAnimation = Boolean(
    project.videoUrl ||
    project.category === 'Animación' ||
    project.tags?.some(t => t.toLowerCase().includes('animaci'))
  );

  const hoverVideoSrc = getDirectHoverVideoUrl(project.videoUrl, project.id);

  // Handle play/pause reliably whenever isHovered changes
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;

    if (isHovered) {
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      el.pause();
    }
  }, [isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden glass-card border border-[#b18780]/20 flex flex-col justify-between h-[420px] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      onClick={() => setSelectedProjectForModal(project)}
    >
      {/* Image / Video Hover Preview */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base Poster Image */}
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-105"
        />

        {/* Video Preview on Hover (Muted / Silent) */}
        <div
          className={`absolute inset-0 z-10 overflow-hidden bg-black transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isHovered && project.videoUrl && parseMediaUrl(project.videoUrl).type === 'iframe' ? (
            <MediaViewer
              src={project.videoUrl}
              alt={project.title}
              controls={false}
              autoPlay={true}
              muted={true}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <video
              ref={videoRef}
              src={hoverVideoSrc}
              poster={project.imageUrl}
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 pointer-events-none"
            />
          )}
          {/* Subtle Muted Preview Badge positioned cleanly below top navbar badges */}
          <div className="absolute top-16 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#ff5540]/60 text-[10px] font-mono text-[#ff7563] font-bold tracking-wider shadow-xl pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5540] animate-ping" />
            <span>VISTA PREVIA (SIN SONIDO)</span>
          </div>
        </div>

        {/* Play Badge Icon for Video or Animation Projects when NOT Hovered */}
        {!isHovered && isVideoOrAnimation && (
          <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-[#ff5540]/60 flex items-center justify-center text-[#ff5540] shadow-xl group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#141316] via-[#141316]/50 to-transparent pointer-events-none z-10"></div>
      </div>

      {/* Top Card Badge & Quick Actions */}
      <div className="relative z-30 p-5 flex items-center justify-between pointer-events-none">
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm pointer-events-auto shrink-0 whitespace-nowrap ${getCategoryBadgeColor(project.category)}`}>
          {project.category}
        </span>

        <div className="flex items-center gap-2 pointer-events-auto">
          {isAdminLoggedIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFeatured(project.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                project.featured
                  ? 'bg-[#feba39]/30 border-[#feba39] text-[#feba39]'
                  : 'bg-black/40 border-white/10 text-white/40 hover:text-white'
              }`}
              title={project.featured ? "Destacado en Slider" : "Marcar como Destacado"}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-white/80 border border-white/10">
            {project.year}
          </span>
        </div>
      </div>

      {/* Bottom Card Content */}
      <div className="relative z-30 p-6 space-y-3 bg-gradient-to-t from-[#141316] via-[#141316]/95 to-transparent pt-12">
        <h3 className="font-syne font-bold text-2xl text-white group-hover:text-[#feba39] transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-xs text-[#a89f9e] line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#a89f9e] border border-white/5"
            >
              #{tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#a89f9e]">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Subtle View Project Link & CTA Button */}
        <div className="pt-3 flex items-center justify-between border-t border-white/10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProjectForModal(project);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#a89f9e] hover:text-[#feba39] transition-colors cursor-pointer group/link"
          >
            <span className="group-hover/link:translate-x-1 transition-transform font-bold">
              Ver Proyecto &rarr;
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProjectForModal(project);
            }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-md shadow-[#ff5540]/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Ver Detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const PortfolioGrid: React.FC = () => {
  const { 
    projects, 
    selectedCategory, 
    setSelectedCategory, 
    setSelectedProjectForModal,
    isAdminLoggedIn,
    toggleFeatured
  } = usePortfolio();

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Todos', value: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Animación', value: 'Animación', icon: <Film className="w-3.5 h-3.5" /> },
    { label: 'Ilustración', value: 'Ilustración', icon: <Palette className="w-3.5 h-3.5" /> },
    { label: 'Modelado 3D', value: 'Modelado 3D', icon: <Box className="w-3.5 h-3.5" /> },
    { label: 'Arte Conceptual', value: 'Arte Conceptual', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  const filteredProjects = selectedCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const getCategoryBadgeColor = (cat: ProjectCategory) => {
    switch (cat) {
      case 'Animación':
        return 'bg-[#ff5540]/10 text-[#ff7563] border-[#ff5540]/25';
      case 'Ilustración':
        return 'bg-[#feba39]/10 text-[#feba39] border-[#feba39]/25';
      case 'Modelado 3D':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/25';
      case 'Arte Conceptual':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      default:
        return 'bg-white/5 text-[#a89f9e] border-white/10';
    }
  };

  return (
    <section id="portfolio-grid" className="py-20 relative bg-[#141316]/75 backdrop-blur-sm">
      {/* Background Decor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header with Motion Scroll Loading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#feba39] tracking-widest uppercase mb-2">
              <Flame className="w-4 h-4 text-[#ff5540]" />
              Catálogo de Obras & Proyectos
            </div>
            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight">
              PORTAFOLIO CREADO CON FUEGO
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 max-w-full pb-2 overflow-x-auto no-scrollbar sm:flex-wrap">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] shadow-lg shadow-[#ff5540]/25 scale-105'
                      : 'bg-[#232026] text-[#a89f9e] hover:text-white hover:bg-[#2e2a33] border border-white/5'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              getCategoryBadgeColor={getCategoryBadgeColor}
              isAdminLoggedIn={isAdminLoggedIn}
              toggleFeatured={toggleFeatured}
              setSelectedProjectForModal={setSelectedProjectForModal}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-[#232026]/40 rounded-3xl border border-white/10">
            <p className="text-lg text-[#a89f9e]">No hay proyectos en esta categoría aún.</p>
          </div>
        )}

      </div>
    </section>
  );
};
