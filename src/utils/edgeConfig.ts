import { createClient } from '@vercel/edge-config';
import { Project } from '../types';

// Vercel Edge Config Connection String
const EDGE_CONFIG_URL = import.meta.env.VITE_EDGE_CONFIG;

export async function fetchProjectsFromEdgeConfig(): Promise<Project[] | null> {
  if (!EDGE_CONFIG_URL) return null;

  try {
    const edgeConfig = createClient(EDGE_CONFIG_URL);
    const data = await edgeConfig.get<Project[]>('projects');
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Vercel Edge Config read notice:', e);
  }
  return null;
}
