export interface MediaEmbedInfo {
  type: 'iframe' | 'video' | 'image';
  embedUrl: string;
  originalUrl: string;
  provider?: 'drive' | 'youtube' | 'vimeo' | 'direct';
}

export const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

export function getDirectHoverVideoUrl(videoUrl?: string, projectId: string = 'proj-1'): string {
  if (videoUrl && videoUrl.trim().length > 0) {
    const trimmed = videoUrl.trim();
    
    // Check if Google Drive
    const driveParsed = parseGoogleDriveUrl(trimmed);
    if (driveParsed) {
      return `https://drive.google.com/file/d/${driveParsed.id}/preview`;
    }

    if (
      trimmed.endsWith('.mp4') ||
      trimmed.endsWith('.webm') ||
      trimmed.endsWith('.mov') ||
      trimmed.includes('commondatastorage.googleapis.com') ||
      trimmed.includes('assets.mixkit.co') ||
      trimmed.startsWith('data:video/') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }
  }
  
  // Pick a stable sample video based on project ID hash
  const hash = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % SAMPLE_VIDEOS.length;
  return SAMPLE_VIDEOS[index];
}

// Utility to parse Google Drive URLs
export function parseGoogleDriveUrl(url: string): { id: string; rawUrl: string } | null {
  if (!url) return null;
  const cleaned = url.trim();
  const idMatch = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) || 
                  cleaned.match(/id=([a-zA-Z0-9_-]+)/) ||
                  cleaned.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
                  
  if (idMatch && idMatch[1]) {
    return { id: idMatch[1], rawUrl: cleaned };
  }
  return null;
}

// Simple boolean check: is this a Google Drive URL?
export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return parseGoogleDriveUrl(url) !== null;
}

// Get the Drive embed preview URL for iframe playback
export function getDriveEmbedUrl(url: string): string {
  const parsed = parseGoogleDriveUrl(url);
  if (!parsed) return url;
  return `https://drive.google.com/file/d/${parsed.id}/preview`;
}

// Check if URL is a direct MP4/WebM video that works in <video> tag
export function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.mov') ||
    trimmed.endsWith('.ogg') ||
    trimmed.includes('commondatastorage.googleapis.com') ||
    trimmed.includes('assets.mixkit.co') ||
    trimmed.startsWith('data:video/') ||
    trimmed.startsWith('blob:')
  );
}

// Convert Google Drive or expired links to direct thumbnail URL
export function getDirectThumbnailUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';
  const trimmed = url.trim();
  const driveParsed = parseGoogleDriveUrl(trimmed);
  if (driveParsed) {
    return `https://drive.google.com/thumbnail?id=${driveParsed.id}&sz=w1200`;
  }
  if (trimmed.includes('lh3.googleusercontent.com/aida-public')) {
    return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';
  }
  return trimmed;
}

// Convert Google Drive to Direct Stream or Embed URL
export function convertGoogleDriveToDirectUrl(url: string, isVideo: boolean = false): string {
  const parsed = parseGoogleDriveUrl(url);
  if (!parsed) return url.trim();

  if (isVideo) {
    return `https://drive.google.com/file/d/${parsed.id}/preview`;
  }
  
  return `https://drive.google.com/thumbnail?id=${parsed.id}&sz=w1200`;
}

// Main parser function for any media URL
export function parseMediaUrl(
  url: string, 
  forceVideo: boolean = false,
  options: { autoPlay?: boolean; muted?: boolean } = {}
): MediaEmbedInfo {
  if (!url) return { type: 'image', embedUrl: '', originalUrl: '' };
  const cleaned = url.trim();

  const { autoPlay = false, muted = false } = options;

  // 1. Google Drive
  const driveParsed = parseGoogleDriveUrl(cleaned);
  if (driveParsed) {
    // Standard Google Drive file view/sharing link or forceVideo
    if (forceVideo || cleaned.includes('/file/d/') || cleaned.includes('preview') || cleaned.includes('sharing')) {
      return {
        type: 'iframe',
        embedUrl: `https://drive.google.com/file/d/${driveParsed.id}/preview`,
        originalUrl: cleaned,
        provider: 'drive'
      };
    }
    return {
      type: 'image',
      embedUrl: `https://drive.google.com/thumbnail?id=${driveParsed.id}&sz=w1200`,
      originalUrl: cleaned,
      provider: 'drive'
    };
  }

  // 2. YouTube (Supports watch?, embed/, shorts/, youtu.be/)
  const youtubeMatch = cleaned.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    const ytId = youtubeMatch[1];
    const params = new URLSearchParams({
      rel: '0',
      enablejsapi: '1',
      playsinline: '1',
      ...(autoPlay ? { autoplay: '1' } : { autoplay: '0' }),
      ...(muted ? { mute: '1' } : {}),
      playlist: ytId,
      loop: '1'
    });
    return {
      type: 'iframe',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`,
      originalUrl: cleaned,
      provider: 'youtube'
    };
  }

  // 3. Vimeo
  const vimeoMatch = cleaned.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    const params = new URLSearchParams({
      title: '0',
      byline: '0',
      portrait: '0',
      autopause: '0',
      dnt: '1',
      ...(autoPlay ? { autoplay: '1' } : {}),
      ...(muted ? { muted: '1', background: '1' } : {})
    });
    return {
      type: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`,
      originalUrl: cleaned,
      provider: 'vimeo'
    };
  }

  // 4. Direct Video
  const isDirectVideo = 
    forceVideo ||
    cleaned.startsWith('data:video/') || 
    cleaned.startsWith('blob:') ||
    cleaned.includes('commondatastorage.googleapis.com') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleaned);

  if (isDirectVideo && !driveParsed && !youtubeMatch && !vimeoMatch) {
    return {
      type: 'video',
      embedUrl: cleaned,
      originalUrl: cleaned,
      provider: 'direct'
    };
  }

  // 5. Generic iframe preview URL
  if (cleaned.endsWith('/preview') || cleaned.includes('embed')) {
    return {
      type: 'iframe',
      embedUrl: cleaned,
      originalUrl: cleaned
    };
  }

  // 6. Default to Image
  return {
    type: 'image',
    embedUrl: cleaned,
    originalUrl: cleaned
  };
}
