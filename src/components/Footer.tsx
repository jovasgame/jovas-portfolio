import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Flame, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsLoginModalOpen, isAdminLoggedIn, profile, brandAssets } = usePortfolio();

  return (
    <footer className="bg-[#100f12] border-t border-[#b18780]/20 py-12 text-[#a89f9e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            {brandAssets.logoUrl ? (
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 border border-white/10 p-1 flex items-center justify-center">
                <img
                  src={brandAssets.logoUrl}
                  alt={brandAssets.brandText || "Logo"}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px]">
                <div className="w-full h-full bg-[#1e1c21] rounded-[7px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#feba39]" />
                </div>
              </div>
            )}
            <span className="font-syne font-extrabold text-xl text-white uppercase">
              {brandAssets.brandText || 'JOVAS'} {brandAssets.brandSubtext ? ` - ${brandAssets.brandSubtext}` : ''}
            </span>
          </div>

          {/* Social Nav */}
          <div className="flex items-center gap-6 text-xs font-mono">
            <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href={profile.socialLinks.artstation} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              ArtStation
            </a>
            <a href={profile.socialLinks.vimeo} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Vimeo
            </a>
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>

          {/* Hidden Admin Access Link */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#feba39]/20 text-xs font-mono text-[#a89f9e] hover:text-[#feba39] border border-white/10 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            {isAdminLoggedIn ? 'Panel de Control Activo' : 'Acceso Dashboard (JovasMotion)'}
          </button>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JOVAS Motion Design. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-[11px] text-[#a89f9e]">
            Desarrollado con pasión para José Luis Vasquez
          </p>
        </div>

      </div>
    </footer>
  );
};
