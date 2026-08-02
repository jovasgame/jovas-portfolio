import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Play, Tag, Calendar, User, Cpu, Film, Sparkles, Flame, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';
import { MagneticButton } from './MagneticButton';

export const ProjectModal: React.FC = () => {
  const { selectedProjectForModal, setSelectedProjectForModal } = usePortfolio();

  if (!selectedProjectForModal) return null;

  const project = selectedProjectForModal;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto bg-black/80 backdrop-blur-md">
        
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0"
          onClick={() => setSelectedProjectForModal(null)}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-[#1e1c21] border border-[#b18780]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-4 sm:my-8 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#1e1c21]/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#ff5540]/20 text-[#ff5540] border border-[#ff5540]/30 text-[10px] sm:text-xs font-bold uppercase">
                {project.category}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#a89f9e]">
                Año: {project.year}
              </span>
            </div>

            <button
              onClick={() => setSelectedProjectForModal(null)}
              className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-3.5 sm:p-8 space-y-5 sm:space-y-8 overflow-y-auto">
            
            {/* Media Display Section (Video or Image) */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video min-h-[200px] xs:min-h-[250px] sm:min-h-[380px] w-full flex items-center justify-center group shadow-xl">
              <MediaViewer
                src={project.videoUrl || project.imageUrl}
                alt={project.title}
                poster={project.imageUrl}
                forceVideo={!!project.videoUrl}
                className="w-full h-full object-cover"
                controls={true}
                autoPlay={true}
                loop={true}
                muted={false}
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <h2 className="font-syne font-black text-3xl sm:text-4xl text-white">
                {project.title}
              </h2>

              <p className="text-sm sm:text-base text-[#e7e1e5]/90 leading-relaxed">
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Client & Tools Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {project.client && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <User className="w-5 h-5 text-[#feba39]" />
                  <div>
                    <span className="text-[10px] font-mono text-[#a89f9e] block uppercase">Cliente / Estudio</span>
                    <span className="text-sm font-bold text-white">{project.client}</span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-[#a89f9e] block uppercase">Herramientas & Software</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#1e1c21] text-xs font-mono text-[#feba39] border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Footer inside Modal */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#a89f9e]">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Proyecto verificado del archivo de Jovas Motion
              </div>

              <MagneticButton
                link="#contacto"
                onClick={() => {
                  setSelectedProjectForModal(null);
                  const contactEl = document.getElementById('contacto');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                paddingX={22}
                paddingY={12}
                radius={14}
                magnet={8}
                fill="linear-gradient(135deg, #ff5540 0%, #feba39 100%)"
                textColor="#2c1800"
                sweepColor="#121114"
                sweepTextColor="#feba39"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solicitar Cotización Similar</span>
              </MagneticButton>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
