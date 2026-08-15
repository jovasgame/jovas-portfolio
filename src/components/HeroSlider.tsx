import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import { MediaViewer } from './MediaViewer';
import { getDirectThumbnailUrl } from '../utils/mediaUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Eye, 
  Flame, 
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
    <section id="hero" className="relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 flex flex-col justify-start overflow-hidden w-full max-w-full bg-transparent">
      {/* Background Animated Atmosphere & Grid */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none diagonal-stripes"></div>
      
      {/* Immersive Full Screen Hero Welcome Header */}
      <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 min-h-[50vh] sm:min-h-[65vh] flex flex-col items-center justify-center space-y-3 sm:space-y-4 z-10 py-6 sm:py-8 mb-6 sm:mb-16">
        {/* Clean Glowing Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 relative flex items-center justify-center pointer-events-auto cursor-pointer group mb-3"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5540]/40 via-[#feba39]/30 to-transparent blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {brandAssets.logoUrl || brandAssets.metallicIconUrl ? (
            <img
              src={brandAssets.logoUrl || brandAssets.metallicIconUrl}
              alt={brandAssets.brandText || "Logo"}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(255,85,64,0.5)] relative z-10 group-hover:scale-105 transition-transform duration-300 mix-blend-screen rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[2px] shadow-2xl shadow-[#ff5540]/30 relative z-10 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#1e1c21] rounded-[22px] flex items-center justify-center">
                <Flame className="w-10 h-10 sm:w-14 sm:h-14 text-[#feba39] animate-pulse" />
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

      {/* 100% FULL-WIDTH MAIN INTERACTIVE SLIDER CONTAINER */}
      <div 
        className="w-full z-10 mt-2 sm:mt-6 px-0 max-w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider Frame with 50% reduced rounded corners (rounded-2xl sm:rounded-3xl) & 100% width */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] min-h-[420px] sm:min-h-[540px] lg:min-h-[640px] flex flex-col justify-between group/slider hover:border-[#feba39]/40 transition-all duration-500 bg-black/50 backdrop-blur-md w-full max-w-full">
          
          {/* 1. Background Slide Image & Video Overlay with Smooth Cover Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
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
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover/slider:scale-105 transition-transform duration-1000 pointer-events-none"
                    controls={false}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    onEnded={handleNext}
                  />
                  {/* Muted Auto-play Indicator */}
                  <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#feba39]/30 text-[10px] font-mono text-[#feba39] shadow-xl pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#ff5540] animate-ping" />
                    <span>AUTOPLAY</span>
                  </div>
                </div>
              ) : (
                <img
                  src={getDirectThumbnailUrl(currentProject.imageUrl || currentProject.videoUrl)}
                  alt={currentProject.title}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover/slider:scale-105 transition-transform duration-1000"
                />
              )}
              
              {/* Concentrated Dark Gradient Overlay: Maintains dark contrast around bottom-left text zone, reduced by 20%+ over top/right image area */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a0c]/90 via-[#0b0a0c]/35 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a0c]/85 via-[#0b0a0c]/20 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* 2. Top-Left Corner: Button "Explorar Proyecto" (As requested in top-left corner) */}
          <div className="absolute top-4 left-4 sm:top-7 sm:left-7 z-30">
            <button
              onClick={() => setSelectedProjectForModal(currentProject)}
              className="bg-gradient-to-r from-[#ff5540] via-[#ff7034] to-[#feba39] hover:from-[#ff6b54] hover:to-[#ffc859] text-[#1a0f00] font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,85,64,0.4)] hover:shadow-[0_6px_28px_rgba(254,186,57,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 cursor-pointer font-sans tracking-wide border border-white/30 backdrop-blur-sm"
              title="Explorar Detalle del Proyecto"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a0f00]" />
              <span>Explorar Proyecto</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a0f00]" />
            </button>
          </div>

          {/* 3. Subtle & Smaller Prev/Next Arrow Navigation Buttons (Left & Right sides) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#ff5540] backdrop-blur-md border border-white/20 hover:border-[#ff5540] text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:scale-110 active:scale-90 group"
            title="Proyecto Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#ff5540] backdrop-blur-md border border-white/20 hover:border-[#ff5540] text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:scale-110 active:scale-90 group"
            title="Siguiente Proyecto"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Spacer for top area */}
          <div className="relative z-10 h-16 sm:h-20" />

          {/* 4. Main Text Info (Outstanding, Highly Responsive Title) */}
          <div className="relative z-20 p-6 sm:p-10 lg:p-14 flex flex-col justify-end space-y-3 sm:space-y-4 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id + '-content'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2 sm:space-y-4"
              >
                {/* Main Highlighted Responsive Title */}
                <h2 className="font-syne font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
                  {currentProject.title}
                </h2>

                {/* Project Description */}
                {currentProject.description && (
                  <p className="text-xs sm:text-sm md:text-base text-[#e7e1e5]/85 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl font-sans drop-shadow">
                    {currentProject.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 5. Bottom Pagination Selector (Dots Pill from Screenshot 2) */}
          <div className="relative z-30 pb-5 sm:pb-7 flex items-center justify-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2 sm:gap-2.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-2xl">
              {sliderItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 sm:w-12 bg-gradient-to-r from-[#ff5540] to-[#feba39] shadow-[0_0_15px_rgba(254,186,57,0.9)] scale-105'
                      : 'w-2.5 sm:w-3 bg-white/20 hover:bg-white/60 hover:scale-125'
                  }`}
                  title={`Diapositiva ${idx + 1}`}
                />
              ))}

              {/* Subtle Auto-play Pause/Play Toggle Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="ml-2 p-1 text-white/60 hover:text-[#feba39] transition-colors cursor-pointer"
                title={isPlaying ? "Pausar slider" : "Reproducción automática"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

