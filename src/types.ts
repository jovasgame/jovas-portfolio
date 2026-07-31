export type ProjectCategory = 'Animación' | 'Ilustración' | 'Modelado 3D' | 'Arte Conceptual';

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
  featured: boolean;
  client?: string;
  specs?: ProjectSpec[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  tagline: string;
  bioParagraphs: string[];
  experienceYears: string;
  projectsCompletedCount: string;
  email: string;
  avatarUrl?: string;
  socialLinks: {
    instagram: string;
    artstation: string;
    linkedin: string;
    behance: string;
    vimeo: string;
  };
}

export interface BrandAssets {
  logoUrl?: string;
  brandText?: string;
  brandSubtext?: string;
  heroText: string;
  heroSubtext: string;
  heroBgUrl?: string;
}

export interface Stats {
  totalViews: string;
  newLeadsCount: number;
  activeProjectsCount: number;
  retentionRate: string;
}
