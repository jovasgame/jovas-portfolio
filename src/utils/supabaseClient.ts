import { createClient } from '@supabase/supabase-js';
import { Project, UserProfile, BrandAssets, Stats } from '../types';

// Supabase project endpoint & key for Jovas Portfolio
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qilojiufolykawjmuwg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbG9qaXVmb2x5a2F3amptdXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODQ0NzksImV4cCI6MjEwMTA2MDQ3OX0.V-7N2T-WvufJXAu-DZ0VKRWpWLvoDpGVCaWCLWse3i8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface CMSData {
  projects: Project[];
  profile?: UserProfile;
  brandAssets?: BrandAssets;
  stats?: Stats;
}

/**
 * Fetch projects directly from Supabase Cloud Database (CMS)
 */
export async function fetchProjectsFromCMS(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category || 'Animación',
        year: item.year || '2024',
        description: item.description || '',
        fullDescription: item.fullDescription || item.fulldescription || item.description || '',
        imageUrl: item.imageUrl || item.imageurl || '',
        videoUrl: item.videoUrl || item.videourl || '',
        tags: item.tags || [],
        featured: Boolean(item.featured),
        client: item.client || '',
        createdAt: item.createdAt || item.createdat || new Date().toISOString().split('T')[0]
      })) as Project[];
    }
  } catch (e) {
    console.warn('Supabase offline or unconfigured:', e);
  }
  return null;
}

/**
 * Save or update project in Supabase CMS
 */
export async function saveProjectToCMS(project: Project): Promise<boolean> {
  try {
    const payload = {
      id: project.id,
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      fullDescription: project.fullDescription || project.description,
      imageUrl: project.imageUrl,
      videoUrl: project.videoUrl,
      tags: project.tags,
      featured: project.featured,
      client: project.client,
      createdAt: project.createdAt
    };

    const { error } = await supabase
      .from('projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to save to Supabase CMS:', e);
    return false;
  }
}

/**
 * Delete project from Supabase CMS
 */
export async function deleteProjectFromCMS(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to delete from Supabase CMS:', e);
    return false;
  }
}
