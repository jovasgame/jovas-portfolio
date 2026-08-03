import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PhotoItem } from '../types';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === 0 ? filteredPhotos.length - 1 : selectedPhotoIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === filteredPhotos.length - 1 ? 0 : selectedPhotoIndex + 1);
  };

  return (
    <section id="galeria-fotografia" className="py-24 relative overflow-hidden w-full max-w-full bg-[#0c0b0e] border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[350px] bg-gradient-to-tr from-[#ff5540]/10 via-[#feba39]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 text-[#feba39] text-xs font-mono tracking-wider uppercase">
              <Camera className="w-3.5 h-3.5 text-[#ff5540]" />
              Galería de Fotografía & Arte Visual
            </div>
            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              Capturas de <span className="bg-gradient-to-r from-[#ff5540] via-[#feba39] to-white bg-clip-text text-transparent">Luz & Arte</span>
            </h2>
            <p className="text-[#a89f9e] text-sm max-w-xl font-sans">
              Explora una selección curated de fotografía urbana, claroscuros cinemáticos y composiciones conceptuales capturadas por José Luis Vasquez.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#141316] font-bold shadow-lg shadow-[#ff5540]/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-[#a89f9e] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-16 text-center text-[#a89f9e] font-mono text-xs bg-white/5 rounded-3xl border border-white/10">
            No hay fotografías disponibles en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative rounded-3xl overflow-hidden bg-[#18161d] border border-white/10 cursor-pointer aspect-[3/4] shadow-xl hover:border-[#feba39]/50 transition-all duration-500"
              >
                {/* Photo Image */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover filter brightness-95 group-hover:brightness-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d11] via-[#0e0d11]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#feba39] uppercase font-bold">
                    {photo.category}
                  </span>
                </div>

                {/* Expand Icon Top Right */}
                <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 group-hover:text-white group-hover:bg-[#ff5540] transition-all scale-95 group-hover:scale-110">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Title & Info Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 space-y-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#feba39] transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.cameraSpecs && (
                    <p className="text-[11px] font-mono text-[#a89f9e] truncate flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#ff5540] shrink-0" />
                      {photo.cameraSpecs}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-[#ff5540] text-white border border-white/20 transition-all cursor-pointer z-50 shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-[#ff5540] text-white border border-white/20 transition-all cursor-pointer z-50 shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Card Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full max-h-[90vh] bg-[#141218] border border-white/15 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            >
              {/* Photo Display */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px] relative overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[75vh] object-contain p-2"
                />
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80 p-6 sm:p-8 bg-[#18161d] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5540]/15 text-[#feba39] text-[10px] font-mono font-bold uppercase">
                    {selectedPhoto.category}
                  </div>

                  <h3 className="font-syne font-black text-2xl text-white">
                    {selectedPhoto.title}
                  </h3>

                  {selectedPhoto.description && (
                    <p className="text-xs text-[#a89f9e] leading-relaxed">
                      {selectedPhoto.description}
                    </p>
                  )}

                  {selectedPhoto.cameraSpecs && (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono text-[#a89f9e] uppercase block flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#feba39]" />
                        Especificaciones de Fotografía:
                      </span>
                      <p className="text-xs font-mono text-white font-bold">
                        {selectedPhoto.cameraSpecs}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#a89f9e] flex items-center justify-between">
                  <span>Captura N° {selectedPhotoIndex! + 1} de {filteredPhotos.length}</span>
                  <a
                    href={selectedPhoto.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#feba39] hover:underline flex items-center gap-1"
                  >
                    Ver original ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
