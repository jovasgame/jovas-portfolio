import { createClient } from '@supabase/supabase-js';
import { Project, UserProfile, BrandAssets, Stats } from '../types';

// Default Supabase project endpoints for Jovas Portfolio CMS
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jovas-portfolio-cms.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFzLXBvcnRmb2xpby1jbXMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4MDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.placeholderKey';

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
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice (using cache or fallback):', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data as Project[];
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
    const { error } = await supabase
      .from('projects')
      .upsert(project, { onConflict: 'id' });

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
