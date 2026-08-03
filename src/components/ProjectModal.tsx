import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Sparkles, CheckCircle, Flame, Calendar, Tag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';

export const ProjectModal: React.FC = () => {
  const { selectedProjectForModal, setSelectedProjectForModal } = usePortfolio();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectForModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProjectForModal]);

  if (!selectedProjectForModal) return null;

  const project = selectedProjectForModal;
  const isVideoProject = Boolean(project.videoUrl?.trim()) || project.category === 'Animación';

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
            
            {/* Dominant 16:9 Large Video Frame */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black aspect-video w-full max-h-[68vh] shadow-2xl flex items-center justify-center border border-white/10 group">
              <MediaViewer
                src={project.videoUrl || project.imageUrl}
                alt={project.title}
                poster={project.imageUrl}
                forceVideo={isVideoProject}
                className="w-full h-full object-contain"
                controls={true}
                autoPlay={true}
                loop={true}
                muted={false}
              />
            </div>

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
