import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Sparkles, CheckCircle, ChevronLeft, ChevronRight, Image as ImageIcon, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';

export const ProjectModal: React.FC = () => {
  const { selectedProjectForModal, setSelectedProjectForModal } = usePortfolio();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const project = selectedProjectForModal;

  // Build complete media list (videoUrl + galleryUrls or imageUrl)
  const rawGallery = (project?.galleryUrls && project.galleryUrls.length > 0)
    ? Array.from(new Set([project.imageUrl, ...project.galleryUrls].filter(Boolean)))
    : (project?.imageUrl ? [project.imageUrl] : []);

  const videoUrl = project?.videoUrl?.trim();
  const mediaList: { url: string; isVideo: boolean }[] = [];

  if (videoUrl) {
    mediaList.push({ url: videoUrl, isVideo: true });
  }
  rawGallery.forEach((imgUrl) => {
    if (imgUrl !== videoUrl) {
      mediaList.push({ url: imgUrl, isVideo: false });
    }
  });

  // Reset index when project changes
  useEffect(() => {
    setActiveMediaIndex(0);
  }, [project?.id]);

  // Keyboard Navigation (Escape, Left Arrow, Right Arrow)
  useEffect(() => {
    if (!selectedProjectForModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectForModal(null);
      } else if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        setActiveMediaIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && mediaList.length > 1) {
        setActiveMediaIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProjectForModal, mediaList.length, setSelectedProjectForModal]);

  if (!project) return null;

  const currentMedia = mediaList[activeMediaIndex] || { url: project.imageUrl, isVideo: false };
  const hasMultipleMedia = mediaList.length > 1;

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/92 backdrop-blur-2xl overflow-y-auto">
        
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0"
          onClick={() => setSelectedProjectForModal(null)}
        />

        {/* Large Immersive Cinema Lightbox Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-7xl bg-[#121115] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto max-h-[96vh] flex flex-col"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-white/10 bg-[#121115]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5540]/20 text-[#ff7563] border border-[#ff5540]/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-[11px] font-mono text-[#a89f9e]">
                Año: {project.year}
              </span>
              {hasMultipleMedia && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#feba39]/15 text-[#feba39] border border-[#feba39]/30 text-[10px] font-mono font-bold">
                  <ImageIcon className="w-3 h-3" />
                  Galería 3D ({activeMediaIndex + 1}/{mediaList.length})
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedProjectForModal(null)}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-[#ff5540] text-white transition-colors cursor-pointer"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Screen-Filling Cinema Player & Details */}
          <div className="p-3 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(96vh-55px)] flex flex-col justify-between">
            
            {/* Dominant 16:9 Large Video/Image Frame with Navigation Arrows */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black aspect-video w-full max-h-[68vh] shadow-2xl flex items-center justify-center border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMediaIndex}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <MediaViewer
                    src={currentMedia.url}
                    alt={`${project.title} - Recurso ${activeMediaIndex + 1}`}
                    poster={project.imageUrl}
                    forceVideo={currentMedia.isVideo}
                    className="w-full h-full object-contain"
                    controls={true}
                    autoPlay={true}
                    loop={true}
                    muted={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* LEFT & RIGHT NAVIGATION ARROWS */}
              {hasMultipleMedia && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/75 hover:bg-[#ff5540] text-white border border-white/20 hover:border-[#ff5540] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl z-30 group-hover:scale-110"
                    title="Imagen anterior (Flecha Izquierda)"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/75 hover:bg-[#ff5540] text-white border border-white/20 hover:border-[#ff5540] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl z-30 group-hover:scale-110"
                    title="Imagen siguiente (Flecha Derecha)"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Top Slide Counter Badge */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#feba39]/50 text-[11px] font-mono text-[#feba39] font-bold shadow-xl pointer-events-none">
                    {currentMedia.isVideo ? '🎥 VÍDEO' : `🖼️ IMAGEN ${activeMediaIndex + 1} DE ${mediaList.length}`}
                  </div>
                </>
              )}
            </div>

            {/* THUMBNAIL GALLERY BAR FOR FAST NAVIGATION */}
            {hasMultipleMedia && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pt-1">
                {mediaList.map((item, idx) => {
                  const isActive = idx === activeMediaIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#feba39] scale-105 shadow-[0_0_12px_rgba(254,186,57,0.5)]'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      {item.isVideo ? (
                        <div className="w-full h-full bg-black/80 flex items-center justify-center text-[#ff7563]">
                          <Film className="w-5 h-5" />
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`Miniatura ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Subtle YouTube-Style Info Bar below video */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <h2 className="font-syne font-black text-xl sm:text-3xl text-white tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a89f9e] leading-relaxed max-w-4xl">
                    {project.fullDescription || project.description}
                  </p>
                </div>

                {/* Subtle Discreet CTA Button in Corner */}
                <div className="shrink-0 pt-1 sm:pt-0">
                  <button
                    onClick={() => {
                      setSelectedProjectForModal(null);
                      const contactEl = document.getElementById('contacto');
                      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solicitar Cotización</span>
                  </button>
                </div>
              </div>

              {/* Minimal Specs & Tags Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#a89f9e]/80">
                <div className="flex flex-wrap items-center gap-2">
                  {project.client && (
                    <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/90">
                      Cliente: <strong className="text-white font-bold">{project.client}</strong>
                    </span>
                  )}
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[#feba39]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Proyecto verificado del archivo de Jovas Motion</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

