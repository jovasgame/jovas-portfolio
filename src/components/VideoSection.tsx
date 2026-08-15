import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { Film, Play, Volume2, VolumeX, Eye, Flame, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Project } from '../types';
import { ProjectThumbnail } from './ProjectThumbnail';
import { 
  getDirectThumbnailUrl, 
  isGoogleDriveUrl, 
  getDriveEmbedUrl, 
  isDirectVideoUrl, 
  parseMediaUrl 
} from '../utils/mediaUtils';

interface VideoCardProps {
  project: Project;
  index: number;
  onSelectProject: (project: Project) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ project, index, onSelectProject }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = project.videoUrl?.trim() || '';
  const isDriveVideo = isGoogleDriveUrl(videoUrl);
  const isDirectMp4 = isDirectVideoUrl(videoUrl);
  const parsedMedia = parseMediaUrl(videoUrl);

  // Poster / thumbnail image (prioritizes custom thumbnailUrl if uploaded)
  const posterSrc = project.thumbnailUrl?.trim() 
    || getDirectThumbnailUrl(project.imageUrl || project.videoUrl, project.category);

  // Duration or spec badge
  const durationSpec = project.specs?.find(s => s.label.toLowerCase().includes('durac') || s.label.toLowerCase().includes('fps'))?.value || '4K • 60 FPS';

  // Handle native MP4 playback on hover
  useEffect(() => {
    if (!isDirectMp4 || !videoRef.current) return;
    const el = videoRef.current;

    if (isHovered) {
      el.currentTime = 0;
      el.muted = isMuted;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to muted playback if autoplay policy blocks sound
          el.muted = true;
          setIsMuted(true);
          el.play().catch(() => {});
        });
      }
    } else {
      el.pause();
    }
  }, [isHovered, isDirectMp4]);

  // Sync mute state when toggled
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col rounded-2xl overflow-hidden bg-[#18161c]/45 backdrop-blur-md border border-white/10 hover:border-[#ff5540]/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#ff5540]/15 hover:-translate-y-1.5 cursor-pointer"
      onClick={() => onSelectProject(project)}
    >
      {/* 16:9 Video / Thumbnail Container */}
      <div className="relative w-full aspect-video bg-black overflow-hidden select-none">
        
        {/* Static Custom Thumbnail Image */}
        <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <ProjectThumbnail
            project={{
              thumbnailUrl: project.thumbnailUrl,
              imageUrl: project.imageUrl,
              videoUrl: project.videoUrl,
              category: project.category,
              title: project.title
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
          />

          {/* Clean thumbnail overlay without play icon or spec badge */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* Video Hover Preview Layer */}
        {isHovered && (
          <div className="absolute inset-0 z-20 bg-black animate-in fade-in duration-300">
            {/* Direct MP4 Video */}
            {isDirectMp4 && (
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterSrc}
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            )}

            {/* Google Drive Video Embed */}
            {isDriveVideo && (
              <iframe
                src={getDriveEmbedUrl(videoUrl)}
                className="w-full h-full border-0 pointer-events-none"
                allow="autoplay; encrypted-media"
                title={`Preview ${project.title}`}
              />
            )}

            {/* Youtube or Vimeo Embed Preview */}
            {!isDirectMp4 && !isDriveVideo && parsedMedia.embedUrl && (
              <iframe
                src={`${parsedMedia.embedUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                className="w-full h-full border-0 pointer-events-none"
                allow="autoplay; encrypted-media"
                title={`Preview ${project.title}`}
              />
            )}

            {/* Top Bar Controls during Hover */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
              <span className="px-2.5 py-1 rounded-md bg-[#ff5540] text-white text-[10px] font-bold font-mono tracking-wider shadow-lg flex items-center gap-1 uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                PREVISUALIZANDO
              </span>

              {isDirectMp4 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-lg bg-black/80 hover:bg-[#ff5540] text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                  title={isMuted ? "Activar Sonido" : "Silenciar"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#feba39]" />}
                </button>
              )}
            </div>

            {/* Animated Bottom Red Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff5540] shadow-sm shadow-[#ff5540] animate-pulse" />
          </div>
        )}
      </div>

      {/* Meta Content below video (YouTube Style) */}
      <div className="p-5 flex gap-3.5 items-start bg-gradient-to-b from-[#18161c] to-[#121115] flex-1 justify-between">
        
        {/* Title & Info */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <h3 className="font-syne font-bold text-base text-white group-hover:text-[#feba39] transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#a89f9e]">
            <span className="font-semibold text-white/90 flex items-center gap-1">
              Jovas Motion
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5540] fill-[#ff5540]/20 inline" />
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] text-[#feba39]">{project.year}</span>
          </div>

          <p className="text-xs text-[#a89f9e]/80 line-clamp-2 leading-relaxed pt-0.5">
            {project.description}
          </p>

          {/* Tags & Tech Specs */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="px-2 py-0.5 rounded bg-[#ff5540]/15 text-[#ff7563] text-[10px] font-mono font-bold border border-[#ff5540]/30">
              {project.category}
            </span>
            {project.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#a89f9e]">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Watch Button */}
        <div className="shrink-0 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(project);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#ff5540] text-[#a89f9e] hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Ver Vídeo Completo"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const VideoSection: React.FC = () => {
  const { projects, setSelectedProjectForModal } = usePortfolio();

  // Filter strictly Animación category projects for the video reel
  const videoProjects = projects.filter(p => p.category === 'Animación');

  return (
    <section id="video-section" className="py-24 relative bg-[#0a090c]/35 backdrop-blur-md overflow-hidden w-full max-w-full">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[400px] bg-gradient-to-r from-[#ff5540]/10 via-[#feba39]/10 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="inline-flex items-center justify-center gap-2 text-xs font-mono text-[#ff5540] tracking-widest uppercase px-4 py-1.5 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 font-bold">
            <Film className="w-4 h-4 text-[#feba39] animate-pulse" />
            Sección Exclusiva de Vídeo y Render 3D
          </div>
          <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight flex flex-wrap items-center justify-center gap-3">
            REEL DE ANIMACIÓN
            <span className="px-3 py-1 rounded-full bg-[#ff5540]/20 text-[#ff5540] text-sm font-mono font-bold border border-[#ff5540]/40">
              {videoProjects.length} VÍDEOS
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#a89f9e] max-w-2xl mx-auto leading-relaxed">
            Pasa el ratón sobre cualquier vídeo para activar la previsualización en directo con sonido.
          </p>
        </motion.div>

        {/* Video Grid (YouTube Aesthetic Layout: 1 Col Mobile, 2 Col Small, 3 Col Tablet/11", 4 Col PC) */}
        {videoProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {videoProjects.map((project, index) => (
              <VideoCard
                key={project.id}
                project={project}
                index={index}
                onSelectProject={setSelectedProjectForModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#18161c] rounded-3xl border border-white/10">
            <Film className="w-12 h-12 text-[#a89f9e] mx-auto mb-3" />
            <p className="text-lg text-[#a89f9e]">No hay vídeos o animaciones disponibles actualmente.</p>
          </div>
        )}

      </div>
    </section>
  );
};
