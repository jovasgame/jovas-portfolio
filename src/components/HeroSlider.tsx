import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';
import { getDirectThumbnailUrl } from '../utils/mediaUtils';
import { MagneticButton } from './MagneticButton';
import { MetallicPaint } from './MetallicPaint';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Eye, 
  Flame, 
  Clock, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { projects, setSelectedProjectForModal, brandAssets } = usePortfolio();

  // Get featured projects or top 5 projects for the main slider
  const featuredProjects = projects.filter(p => p.featured);
  const sliderItems = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentProject = sliderItems[currentIndex] || sliderItems[0];

  useEffect(() => {
    if (!isPlaying || sliderItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying, sliderItems.length]);

  const touchStartX = React.useRef<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (!currentProject) return null;

  return (
    <section id="hero" className="relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 flex flex-col justify-start overflow-hidden bg-transparent">
      {/* Background Animated Atmosphere & Grid */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none diagonal-stripes"></div>
      
      {/* Immersive Full Screen Hero Welcome Header */}
      <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 min-h-[60vh] sm:min-h-[75vh] flex flex-col items-center justify-center space-y-3 sm:space-y-4 z-10 py-6 sm:py-8 mb-10 sm:mb-28">
        {/* Clean Glowing Logo (Without square canvas box) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 relative flex items-center justify-center pointer-events-auto cursor-pointer group mb-4"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5540]/40 via-[#feba39]/30 to-transparent blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {brandAssets.logoUrl || brandAssets.metallicIconUrl ? (
            <img
              src={brandAssets.logoUrl || brandAssets.metallicIconUrl}
              alt={brandAssets.brandText || "Logo"}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(255,85,64,0.5)] relative z-10 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[2px] shadow-2xl shadow-[#ff5540]/30 relative z-10 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#1e1c21] rounded-[22px] flex items-center justify-center">
                <Flame className="w-12 h-12 sm:w-16 sm:h-16 text-[#feba39] animate-pulse" />
              </div>
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-syne font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] max-w-2xl"
        >
          ¡Un destello creativo para <span className="bg-gradient-to-r from-[#ff5540] via-[#feba39] to-[#ff5540] bg-clip-text text-transparent">iluminar tus proyectos</span>!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xs sm:text-sm text-[#e7e1e5]/80 max-w-xl mx-auto font-sans leading-relaxed drop-shadow"
        >
          Explora la colección de animación digital, arte 3D e ilustración conceptual desarrollados con máxima precisión técnica y fluidez.
        </motion.p>
      </div>

      {/* 100% FULL-WIDTH MAIN INTERACTIVE SLIDER CONTAINER (Pushed lower with smooth spacing) */}
      <div 
        className="w-full px-2 sm:px-4 lg:px-8 z-10 mt-6 sm:mt-16 pt-4 sm:pt-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative rounded-[2.5rem] overflow-hidden glass-panel border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] min-h-[380px] sm:min-h-[520px] lg:min-h-[600px] flex flex-col justify-between group/slider hover:border-[#feba39]/50 transition-all duration-500 bg-black/40 backdrop-blur-md">
          
          {/* Background Slide Image & Video Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-0"
            >
              {currentProject.videoUrl || currentProject.category === 'Animación' ? (
                <div className="w-full h-full relative overflow-hidden">
                  <MediaViewer
                    key={`slider-video-${currentProject.id}`}
                    src={currentProject.videoUrl || currentProject.imageUrl}
                    alt={currentProject.title}
                    poster={getDirectThumbnailUrl(currentProject.imageUrl || currentProject.videoUrl)}
                    forceVideo={true}
                    className="w-full h-full object-cover object-center filter brightness-90 contrast-105 group-hover/slider:scale-105 transition-transform duration-1000 pointer-events-none"
                    controls={false}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    onEnded={handleNext}
                  />
                  {/* Subtle Muted Indicator Badge */}
                  <div className="absolute top-20 left-8 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#feba39]/30 text-[11px] font-mono text-[#feba39] shadow-xl pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#ff5540] animate-ping" />
                    <span>REPRODUCCIÓN AUTOMÁTICA (SIN SONIDO)</span>
                  </div>
                </div>
              ) : (
                <img
                  src={getDirectThumbnailUrl(currentProject.imageUrl || currentProject.videoUrl)}
                  alt={currentProject.title}
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-105 group-hover/slider:scale-105 transition-transform duration-1000"
                />
              )}
              
              {/* Dark Gradients for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0e] via-[#0d0c0e]/60 to-black/30 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0e]/95 via-[#0d0c0e]/40 to-transparent pointer-events-none"></div>
            </motion.div>
          </AnimatePresence>

          {/* Top Slide Meta Header */}
          <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff5540]/30 border border-white/20">
                {currentProject.category}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-white/90 text-xs font-mono shadow-md hover:border-[#feba39]/50 hover:shadow-[0_0_15px_rgba(254,186,57,0.3)] transition-all">
                Año: {currentProject.year}
              </span>
              {currentProject.client && (
                <span className="hidden sm:inline-block px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-[#a89f9e] text-xs shadow-md hover:border-white/40 transition-all">
                  Cliente: {currentProject.client}
                </span>
              )}
            </div>

            {/* Slide Index Indicator */}
            <div className="font-mono text-sm text-white/90 bg-black/50 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-black/50 hover:border-[#feba39]/50 hover:shadow-[0_0_15px_rgba(254,186,57,0.3)] transition-all">
              <span className="text-[#feba39] font-bold">0{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">0{sliderItems.length}</span>
            </div>
          </div>

          {/* Bottom Slide Content Body */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            
            {/* Title & Description Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id + '-content'}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl space-y-4"
              >
                <h2 className="font-syne font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight drop-shadow-lg">
                  {currentProject.title}
                </h2>

                <p className="text-sm sm:text-base text-[#e7e1e5]/90 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
                  {currentProject.description}
                </p>

                {/* Tags list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[11px] font-mono text-[#feba39] border border-white/15 shadow-sm hover:border-[#feba39]/60 hover:shadow-[0_0_10px_rgba(254,186,57,0.3)] transition-all"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Action CTAs & Controls with Dynamic Glass & Glow Effects */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-4 shrink-0">
              <MagneticButton
                onClick={() => setSelectedProjectForModal(currentProject)}
                paddingX={28}
                paddingY={15}
                radius={16}
                magnet={10}
                fill="linear-gradient(135deg, #ff5540 0%, #feba39 100%)"
                textColor="#2b1800"
                sweepColor="#121114"
                sweepTextColor="#feba39"
              >
                <Eye className="w-4 h-4" />
                <span>Explorar Proyecto</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>

              {/* Slider Manual Controls Bar - Dynamic Glassmorphism & Hover Glow */}
              <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-2xl p-2 rounded-2xl border border-white/20 shadow-2xl shadow-black/80">
                <button
                  onClick={handlePrev}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-[#feba39] text-white hover:text-[#2b1800] border border-white/20 hover:border-[#feba39] hover:shadow-[0_0_20px_rgba(254,186,57,0.7)] hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
                  title="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-[#feba39] text-[#feba39] hover:text-[#2b1800] border border-white/20 hover:border-[#feba39] hover:shadow-[0_0_20px_rgba(254,186,57,0.7)] hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
                  title={isPlaying ? "Pausar Reproducción" : "Reproducción Automática"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-[#feba39] text-white hover:text-[#2b1800] border border-white/20 hover:border-[#feba39] hover:shadow-[0_0_20px_rgba(254,186,57,0.7)] hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
                  title="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Progress Bullets with Glow */}
          <div className="relative z-10 px-6 sm:px-10 pb-5 flex items-center justify-center gap-2.5">
            {sliderItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-12 bg-gradient-to-r from-[#ff5540] to-[#feba39] shadow-[0_0_20px_rgba(254,186,57,0.9)] scale-105'
                    : 'w-3 bg-white/20 hover:bg-white/60 hover:scale-125 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                }`}
                title={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Hero Title Banner ("Entendiendo el Movimiento") MOVED DOWN HERE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-12 mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#feba39]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff5540]/15 border border-[#ff5540]/30 text-[#ff5540] text-xs font-mono font-bold tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-[#feba39]" />
              Reel Showcase & Filosofía
            </div>
            <h1 className="font-syne font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-md">
              {brandAssets.heroText}
            </h1>
          </div>

          <div className="md:max-w-md relative z-10">
            <p className="text-sm text-[#e7e1e5]/80 leading-relaxed font-sans">
              {brandAssets.heroSubtext}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
