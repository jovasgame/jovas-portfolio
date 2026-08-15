import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Sparkles, CheckCircle, ChevronLeft, ChevronRight, Image as ImageIcon, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';

import { trackProjectView } from '../utils/analyticsTracker';

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

  // Reset index & track project view when project changes
  useEffect(() => {
    setActiveMediaIndex(0);
    if (project?.id) {
      trackProjectView(project.id);
    }
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl">
        
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0"
          onClick={() => setSelectedProjectForModal(null)}
        />

        {/* 90%+ Viewport Height Immersive Cinema Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[98vw] xl:max-w-7xl h-[94vh] sm:h-[92vh] bg-[#0c0b0e] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden z-10 flex flex-col justify-between"
        >
          {/* Floating Top Bar (Overlaid on Media) */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-[#ff5540]/25 text-[#ff7563] border border-[#ff5540]/40 text-xs font-bold uppercase tracking-wider shadow-lg">
                {project.category}
              </span>
              <span className="text-xs font-mono text-[#a89f9e] bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                Año: {project.year}
              </span>
              {hasMultipleMedia && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#feba39]/20 text-[#feba39] border border-[#feba39]/40 text-xs font-mono font-bold shadow-lg">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Galería ({activeMediaIndex + 1}/{mediaList.length})
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedProjectForModal(null)}
              className="p-2.5 rounded-full bg-black/70 hover:bg-[#ff5540] text-white border border-white/20 hover:border-[#ff5540] backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto shadow-2xl hover:scale-110"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 90% Height Main Visual Canvas */}
          <div className="relative flex-1 w-full h-full min-h-0 bg-black/90 flex items-center justify-center overflow-hidden group">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMediaIndex}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex items-center justify-center p-2 sm:p-4"
              >
                <MediaViewer
                  src={currentMedia.url}
                  alt={`${project.title} - Recurso ${activeMediaIndex + 1}`}
                  poster={project.imageUrl}
                  forceVideo={currentMedia.isVideo}
                  className="w-full h-full max-h-[82vh] object-contain select-none"
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
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/80 hover:bg-[#ff5540] text-white border border-white/25 hover:border-[#ff5540] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl z-30 hover:scale-110 active:scale-95"
                  title="Imagen anterior (Flecha Izquierda)"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/80 hover:bg-[#ff5540] text-white border border-white/25 hover:border-[#ff5540] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl z-30 hover:scale-110 active:scale-95"
                  title="Imagen siguiente (Flecha Derecha)"
                >
                  <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </>
            )}

          </div>

          {/* Docked Footer Bar (Pie de Página) */}
          <div className="shrink-0 bg-[#121116]/95 backdrop-blur-xl border-t border-white/15 p-4 sm:p-5 z-30">
            
            {/* Gallery Thumbnails Row (If Multiple Media) */}
            {hasMultipleMedia && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-white/10 no-scrollbar">
                {mediaList.map((item, idx) => {
                  const isActive = idx === activeMediaIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#feba39] scale-105 shadow-[0_0_15px_rgba(254,186,57,0.6)]'
                          : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
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

            {/* Footer Main Information Grid */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left Column: Title, Description & Tags */}
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-syne font-black text-xl sm:text-2xl text-white tracking-tight">
                    {project.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#a89f9e] leading-relaxed line-clamp-2">
                  {project.fullDescription || project.description}
                </p>

                {/* Tags & Verification Badge */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#feba39]">
                      #{tag}
                    </span>
                  ))}
                  <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-sans ml-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Proyecto verificado de Jovas Motion</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Prominent "Solicitar Cotización" Button */}
              <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => {
                    setSelectedProjectForModal(null);
                    const contactEl = document.getElementById('contacto');
                    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ff5540]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Solicitar Cotización</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

