import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, ExternalLink, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AccordionGallery, { AccordionGalleryItem } from './AccordionGallery';

export const PhotoGallerySection: React.FC = () => {
  const { photos } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Dynamic Categories from available photo items
  const categories = ['Todos', ...Array.from(new Set(photos.map(p => p.category)))];

  const filteredPhotos = activeFilter === 'Todos'
    ? photos
    : photos.filter(p => p.category === activeFilter);

  const selectedPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  // Transform photos into AccordionGallery items
  const accordionItems: AccordionGalleryItem[] = filteredPhotos.map((photo) => ({
    id: photo.id,
    image: photo.imageUrl,
    label: photo.title,
    category: photo.category,
    specs: photo.cameraSpecs || photo.description || photo.category,
    alt: photo.title
  }));

  // Keyboard navigation for Lightbox Preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex(prev => (prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex(prev => (prev === null || prev === filteredPhotos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === 0 ? filteredPhotos.length - 1 : selectedPhotoIndex - 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === filteredPhotos.length - 1 ? 0 : selectedPhotoIndex + 1);
  };

  return (
    <section id="galeria-fotografia" className="py-24 relative overflow-hidden w-full max-w-full bg-[#0a090c]/35 backdrop-blur-md border-t border-white/5">
      {/* Dynamic Background Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[400px] bg-gradient-to-tr from-[#ff5540]/12 via-[#feba39]/12 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Editorial Centered Section Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#feba39] text-xs font-mono tracking-wider uppercase shadow-inner">
            <Camera className="w-3.5 h-3.5 text-[#ff5540]" />
            Nuestras Historias y Galería Visual
          </div>

          <h2 className="font-syne font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
            Galería <span className="bg-gradient-to-r from-[#ff5540] via-[#feba39] to-white bg-clip-text text-transparent">Fotográfica</span>
          </h2>

          <p className="text-[#a89f9e] text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
            Momentos capturados, encuadres cinemáticos y composiciones de luz curated por José Luis Vásquez. Explora la experiencia interactiva Accordion Gallery o amplía en resolución original.
          </p>

          {/* Centered Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#0a090c] font-bold shadow-lg shadow-[#ff5540]/25 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-[#a89f9e] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* AccordionGallery Interactive Component */}
        {filteredPhotos.length === 0 ? (
          <div className="py-20 text-center text-[#a89f9e] font-mono text-sm bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
            <Layers className="w-8 h-8 text-[#ff5540]/60" />
            <span>No hay fotografías disponibles en esta categoría.</span>
          </div>
        ) : (
          <div className="w-full relative">
            <AccordionGallery
              items={accordionItems}
              defaultIndex={Math.min(2, Math.max(0, Math.floor((accordionItems.length - 1) / 2)))}
              accentColor="#feba39"
              overlayColor="rgba(0,0,0,0.15)"
              textColor="#ffffff"
              height={520}
              gap={12}
              radius={20}
              expandRatio={0.52}
              orientation="horizontal"
              duration={0.6}
              ease="power3.out"
              parallax={0.3}
              tilt={4}
              stagger={0.06}
              trigger="hover"
              showLabels={true}
              grayscale={false}
              onItemClick={(_item, index) => {
                setSelectedPhotoIndex(index);
              }}
            />

            {/* Helper Hint */}
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#a89f9e]">
              <span className="flex items-center gap-1.5 text-[#feba39]">
                <Sparkles className="w-3.5 h-3.5 text-[#ff5540]" />
                Pasa el ratón para desplegar paneles • Haz clic para ampliar en resolución original
              </span>
              <span className="hidden sm:inline-block">
                {filteredPhotos.length} {filteredPhotos.length === 1 ? 'fotografía' : 'fotografías'} en exhibición
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox High Quality Preview Modal (Darkened Background) */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between z-50">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#ff5540]/20 border border-[#ff5540]/40 text-[#feba39] text-xs font-mono font-bold uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs font-mono text-white/60">
                  {selectedPhotoIndex! + 1} / {filteredPhotos.length}
                </span>
              </div>

              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-3 rounded-full bg-white/10 hover:bg-[#ff5540] text-white border border-white/20 hover:border-[#ff5540] transition-all cursor-pointer shadow-xl scale-95 hover:scale-105"
                title="Cerrar vista previa (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Preview Container with Image & Navigation */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-50 p-4 rounded-full bg-black/60 hover:bg-[#ff5540] text-white border border-white/20 transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Fotografía anterior (Flecha izquierda)"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-50 p-4 rounded-full bg-black/60 hover:bg-[#ff5540] text-white border border-white/20 transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Fotografía siguiente (Flecha derecha)"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* High Resolution Image Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhoto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full flex items-center justify-center p-2"
                >
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-h-[72vh] max-w-[88vw] object-contain rounded-2xl shadow-2xl drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Modal Bottom Footer Info Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl mx-auto w-full bg-[#141219]/90 border border-white/15 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl z-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <h3 className="font-syne font-black text-xl sm:text-2xl text-white">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.description && (
                  <p className="text-xs text-[#a89f9e] max-w-2xl leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}
                {selectedPhoto.cameraSpecs && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#feba39] pt-1">
                    <Camera className="w-3.5 h-3.5 text-[#ff5540]" />
                    <span>{selectedPhoto.cameraSpecs}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <a
                  href={selectedPhoto.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 border border-white/15"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#feba39]" />
                  <span>Ver resolución original</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

