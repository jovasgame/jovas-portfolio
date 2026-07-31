import React, { useState, useRef, useEffect } from 'react';
import { parseMediaUrl } from '../utils/mediaUtils';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface MediaViewerProps {
  src: string;
  alt?: string;
  className?: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  forceVideo?: boolean;
  onEnded?: () => void;
}

const FALLBACK_SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export const MediaViewer: React.FC<MediaViewerProps> = ({
  src,
  alt = 'Media display',
  className = 'w-full h-full object-cover',
  poster,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = true,
  forceVideo = false,
  onEnded,
}) => {
  const [hasError, setHasError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const mediaInfo = parseMediaUrl(src, forceVideo, { autoPlay, muted });
  const activeVideoUrl = videoSrc || mediaInfo.embedUrl;

  // Reset states when src changes
  useEffect(() => {
    setHasError(false);
    setVideoSrc(null);
  }, [src, forceVideo]);

  useEffect(() => {
    if (videoRef.current && mediaInfo.type === 'video') {
      videoRef.current.muted = muted;
      videoRef.current.defaultMuted = muted;
      if (muted) {
        videoRef.current.volume = 0;
      }
      if (autoPlay) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silence autoplay restrictions
          });
        }
      }
    }

    return () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [autoPlay, muted, activeVideoUrl, mediaInfo.type]);

  if (!src) {
    if (poster) {
      return <img src={poster} alt={alt} className={className} />;
    }
    return (
      <div className={`bg-[#18161d] flex flex-col items-center justify-center p-6 text-[#a89f9e] ${className}`}>
        <ImageIcon className="w-8 h-8 text-[#ff5540] mb-2 opacity-60" />
        <span className="text-xs font-mono">Sin recurso asignado</span>
      </div>
    );
  }

  if (hasError) {
    if (poster) {
      return <img src={poster} alt={alt} className={className} />;
    }
    if (!controls) {
      return null;
    }
    return (
      <div className={`bg-[#18161d] flex flex-col items-center justify-center p-6 text-[#a89f9e] text-center border border-white/10 ${className}`}>
        <AlertCircle className="w-8 h-8 text-[#feba39] mb-2" />
        <span className="text-xs font-mono font-bold text-white mb-1">Error de reproducción</span>
        <p className="text-[11px] max-w-xs text-[#a89f9e]">
          No se pudo cargar el recurso. Asegúrate de que el archivo sea accesible públicamente.
        </p>
      </div>
    );
  }

  if (mediaInfo.type === 'iframe') {
    return (
      <div className={`relative w-full h-full min-h-[220px] xs:min-h-[250px] bg-black overflow-hidden group/iframe ${!controls ? 'pointer-events-none' : ''}`}>
        <iframe
          src={mediaInfo.embedUrl}
          className="absolute inset-0 w-full h-full border-0 rounded-lg sm:rounded-xl pointer-events-auto"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          title={alt}
        />
      </div>
    );
  }

  if (mediaInfo.type === 'video') {
    return (
      <video
        ref={(el) => {
          videoRef.current = el;
          if (el) {
            el.muted = muted;
            el.defaultMuted = muted;
            if (muted) el.volume = 0;
            if (autoPlay) {
              const p = el.play();
              if (p !== undefined) p.catch(() => {});
            }
          }
        }}
        src={activeVideoUrl}
        poster={poster}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={(e) => {
          if (muted) {
            e.currentTarget.muted = true;
            e.currentTarget.volume = 0;
          }
        }}
        onCanPlay={(e) => {
          if (muted) {
            e.currentTarget.muted = true;
            e.currentTarget.volume = 0;
          }
          if (autoPlay) {
            e.currentTarget.play().catch(() => {});
          }
        }}
        onEnded={onEnded}
        onError={() => {
          const driveMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
          if (driveMatch && driveMatch[1] && activeVideoUrl.includes('googleusercontent.com')) {
            // Try Drive preview iframe if direct CDN fails
            setVideoSrc(`https://drive.google.com/file/d/${driveMatch[1]}/preview`);
          } else if (activeVideoUrl !== FALLBACK_SAMPLE_VIDEO) {
            setVideoSrc(FALLBACK_SAMPLE_VIDEO);
          } else {
            setHasError(true);
          }
        }}
      />
    );
  }

  return (
    <img
      src={mediaInfo.embedUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        const driveMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
          const target = e.target as HTMLImageElement;
          const fallback = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
          if (target.src !== fallback) {
            target.src = fallback;
            return;
          }
        }
        setHasError(true);
      }}
    />
  );
};
