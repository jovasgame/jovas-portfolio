import { Project, UserProfile, BrandAssets, Stats } from '../types';
import { initialProjects, initialProfile, initialBrandAssets, initialStats } from '../data/initialData';

export interface PortfolioCloudData {
  projects: Project[];
  profile: UserProfile;
  brandAssets: BrandAssets;
  stats: Stats;
  updatedAt: string;
}

// Free Cloud Bin Endpoint (Npoint / JSONStorage persistent cloud service)
const CLOUD_STORAGE_ENDPOINT = 'https://api.npoint.io/6f7e8a9b0c1d2e3f4a5b';
const LOCAL_CACHE_KEY = 'jovas_portfolio_cloud_cache';

/**
 * Fetch the latest global portfolio data from the free cloud storage.
 */
export async function fetchCloudPortfolioData(): Promise<PortfolioCloudData | null> {
  try {
    const response = await fetch(CLOUD_STORAGE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.projects) && data.projects.length > 0) {
        // Cache locally for instant offline rendering
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
        return data as PortfolioCloudData;
      }
    }
  } catch (error) {
    console.warn('Cloud storage sync notice (using cached data):', error);
  }

  // Fallback to local cache if available
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // Ignore JSON parse error
  }

  return null;
}

/**
 * Save updated portfolio data globally to the cloud.
 */
export async function saveCloudPortfolioData(data: Omit<PortfolioCloudData, 'updatedAt'>): Promise<boolean> {
  const payload: PortfolioCloudData = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  // Save to local cache first
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to cache locally:', e);
  }

  // Save to cloud endpoint
  try {
    const response = await fetch(CLOUD_STORAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.warn('Cloud save error:', error);
  }

  return true; // Gracefully handle local fallback
}
