import { Project, UserProfile, BrandAssets, Stats } from '../types';

/**
 * Generates valid TypeScript code content for src/data/initialData.ts
 * based on current state in the Admin Panel.
 */
export function generateInitialDataTS(data: {
  projects: Project[];
  profile: UserProfile;
  brandAssets: BrandAssets;
  stats: Stats;
}): string {
  const { projects, profile, brandAssets, stats } = data;

  return `import { Project, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';

export const initialProjects: Project[] = ${JSON.stringify(projects, null, 2)};

export const initialProfile: UserProfile = ${JSON.stringify(profile, null, 2)};

export const initialBrandAssets: BrandAssets = ${JSON.stringify(brandAssets, null, 2)};

export const initialMessages: ContactMessage[] = [];

export const initialStats: Stats = ${JSON.stringify(stats, null, 2)};
`;
}

/**
 * Trigger browser file download of initialData.ts
 */
export function downloadInitialDataTS(fileContent: string) {
  const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'initialData.ts');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
