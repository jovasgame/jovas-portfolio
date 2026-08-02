import React, { useState } from 'react';
import { getDirectThumbnailUrl, getCategoryFallbackImage, isDirectVideoUrl } from '../utils/mediaUtils';

interface ProjectThumbnailProps {
  project: {
    imageUrl?: string;
    videoUrl?: string;
    category?: string;
    title?: string;
  };
  className?: string;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({
  project,
  className = 'w-full h-full object-cover'
}) => {
  const [hasError, setHasError] = useState(false);

  const rawSrc = (project.imageUrl && project.imageUrl.trim()) || (project.videoUrl && project.videoUrl.trim()) || '';
  const isVideo = isDirectVideoUrl(rawSrc) && (!project.imageUrl || !project.imageUrl.trim());
  const thumbSrc = getDirectThumbnailUrl(rawSrc, project.category);

  if (hasError || !rawSrc) {
    return (
      <img
        src={getCategoryFallbackImage(project.category)}
        alt={project.title || 'Portada de proyecto'}
        className={className}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={`${rawSrc}#t=0.5`}
        muted
        playsInline
        preload="metadata"
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <img
      src={thumbSrc}
      alt={project.title || 'Portada de proyecto'}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
