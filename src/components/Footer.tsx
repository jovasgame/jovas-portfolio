import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Flame, 
  Shield, 
  Instagram, 
  Linkedin, 
  Video, 
  Palette, 
  Youtube, 
  Twitter, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { Strands } from './Strands';
import { SocialLinkItem } from '../types';

export const Footer: React.FC = () => {
  const { setIsLoginModalOpen, isAdminLoggedIn, profile, brandAssets } = usePortfolio();

  const getSocialIcon = (name: string, iconKey?: string) => {
    const key = (iconKey || name).toLowerCase();
    if (key.includes('instagram')) return <Instagram className="w-4 h-4 text-[#e1306c]" />;
    if (key.includes('artstation')) return <Palette className="w-4 h-4 text-[#13aff0]" />;
    if (key.includes('vimeo')) return <Video className="w-4 h-4 text-[#1ab7ea]" />;
    if (key.includes('linkedin')) return <Linkedin className="w-4 h-4 text-[#0a66c2]" />;
    if (key.includes('youtube')) return <Youtube className="w-4 h-4 text-[#ff0000]" />;
    if (key.includes('twitter') || key.includes('x')) return <Twitter className="w-4 h-4 text-[#1da1f2]" />;
    return <Globe className="w-4 h-4 text-[#feba39]" />;
  };

  const socialItems: SocialLinkItem[] = profile.customSocialLinks && profile.customSocialLinks.length > 0
    ? profile.customSocialLinks
    : [
        { id: '1', name: 'Instagram', url: profile.socialLinks?.instagram || 'https://instagram.com', icon: 'instagram' },
        { id: '2', name: 'ArtStation', url: profile.socialLinks?.artstation || 'https://artstation.com', icon: 'artstation' },
        { id: '3', name: 'Vimeo', url: profile.socialLinks?.vimeo || 'https://vimeo.com', icon: 'vimeo' },
        { id: '4', name: 'LinkedIn', url: profile.socialLinks?.linkedin || 'https://linkedin.com', icon: 'linkedin' }
      ];

  return (
    <footer className="relative bg-[#0d0c0e] border-t border-[#b18780]/20 pt-12 pb-16 text-[#a89f9e] overflow-hidden">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            {brandAssets.logoUrl ? (
              <img
                src={brandAssets.logoUrl}
                alt={brandAssets.brandText || "Logo"}
                className="h-8 w-auto max-w-[140px] object-contain filter drop-shadow hover:scale-105 transition-transform cursor-pointer"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px]">
                <div className="w-full h-full bg-[#1e1c21] rounded-[7px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#feba39]" />
                </div>
              </div>
            )}
            <span className="font-syne font-extrabold text-xl text-white uppercase tracking-tight">
              {brandAssets.brandText || 'JOVAS'} {brandAssets.brandSubtext ? ` - ${brandAssets.brandSubtext}` : ''}
            </span>
          </div>

          {/* Social Links with Icons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center text-xs font-mono">
            {socialItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white hover:border-[#feba39]/50 transition-all hover:scale-105 group shadow-sm"
              >
                {getSocialIcon(item.name, item.icon)}
                <span className="font-bold tracking-wide">{item.name}</span>
                <ExternalLink className="w-3 h-3 text-[#a89f9e] group-hover:text-[#feba39] transition-colors" />
              </a>
            ))}
          </div>

          {/* Hidden Admin Access Link */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#feba39]/20 text-xs font-mono text-[#a89f9e] hover:text-[#feba39] border border-white/10 hover:border-[#feba39]/40 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            {isAdminLoggedIn ? 'Panel de Control Activo' : 'Acceso Dashboard (JovasMotion)'}
          </button>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10">
          <p>© {new Date().getFullYear()} JOVAS Motion Design. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-[11px] text-[#a89f9e]">
            Desarrollado con pasión para {profile.name}
          </p>
        </div>

      </div>

      {/* Single Subtle Strands Ambient Wave Effect at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 w-full pointer-events-none z-0 opacity-60">
        <Strands
          colors={["#ff5540", "#feba39", "#ff5540"]}
          count={1}
          speed={0.25}
          amplitude={0.2}
          waviness={0.6}
          thickness={0.4}
          glow={0.9}
          taper={0.5}
          spread={0}
          intensity={0.4}
          saturation={1.0}
          opacity={0.6}
          scale={1.0}
          glass={false}
        />
      </div>
    </footer>
  );
};
