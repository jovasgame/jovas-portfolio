import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, Sparkles, Menu, X, Flame, LogOut, LayoutDashboard } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { GooeyNav, GooeyNavItem } from './GooeyNav';

interface NavbarProps {
  onOpenDashboardTab?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDashboardTab }) => {
  const { 
    isAdminLoggedIn, 
    setIsLoginModalOpen, 
    logoutAdmin, 
    selectedCategory, 
    setSelectedCategory,
    profile,
    brandAssets
  } = usePortfolio();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Animación', value: 'Animación' },
    { label: 'Ilustración', value: 'Ilustración' },
    { label: 'Modelado 3D', value: 'Modelado 3D' },
    { label: 'Arte Conceptual', value: 'Arte Conceptual' }
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catValue: string) => {
    setSelectedCategory(catValue);
    if (catValue === 'Animación') {
      scrollToSection('video-section');
    } else {
      scrollToSection('portfolio-grid');
    }
  };

  const gooeyItems: GooeyNavItem[] = categories.map((cat) => ({
    label: cat.label,
    value: cat.value,
    href: cat.value === 'Animación' ? '#video-section' : '#portfolio-grid',
    onClick: () => handleCategoryClick(cat.value),
  }));

  const activeCategoryIndex = categories.findIndex(
    (c) => c.value === selectedCategory
  );

  return (
    <header className={`fixed top-0 left-0 right-0 w-full max-w-full z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#141316]/85 backdrop-blur-md border-b border-[#b18780]/20 py-2.5 sm:py-3 shadow-md shadow-black/30' 
        : 'bg-transparent py-3 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full min-w-0">
        
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer min-w-0 shrink max-w-[70%] sm:max-w-none"
        >
          {(brandAssets.logoUrl || brandAssets.metallicIconUrl) ? (
            <img
              src={brandAssets.logoUrl || brandAssets.metallicIconUrl}
              alt={brandAssets.brandText || "Logo"}
              className="h-7 sm:h-9 w-auto max-w-[100px] sm:max-w-[160px] object-contain filter drop-shadow group-hover:scale-105 transition-all cursor-pointer mix-blend-screen rounded-lg shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px] shadow-lg shadow-[#ff5540]/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full bg-[#1e1c21] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#feba39] group-hover:text-[#ff5540] transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5540]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          
          <div className="flex flex-col min-w-0 shrink">
            <span className="font-syne font-extrabold text-base sm:text-2xl tracking-wider text-white flex items-center gap-1 uppercase truncate">
              {brandAssets.brandText || 'JOVAS'}
              <span className="text-[#ff5540] inline-block w-1.5 h-1.5 rounded-full bg-[#ff5540] animate-pulse shrink-0"></span>
            </span>
            <span className="font-jetbrains text-[8px] sm:text-[10px] tracking-widest text-[#a89f9e] uppercase -mt-0.5 sm:-mt-1 truncate">
              {brandAssets.brandSubtext || 'Motion Design'}
            </span>
          </div>
        </a>

        {/* Desktop Gooey Category Navigation */}
        <div className="hidden md:block">
          <GooeyNav
            items={gooeyItems}
            activeIndex={activeCategoryIndex >= 0 ? activeCategoryIndex : 0}
            particleCount={18}
            particleDistances={[80, 15]}
            particleR={90}
            animationTime={500}
            colors={[1, 2, 3, 1, 2, 4]}
          />
        </div>

        {/* Actions & Hidden Admin Lock */}
        <div className="hidden md:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboardTab}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#feba39]/10 border border-[#feba39]/30 text-[#feba39] hover:bg-[#feba39]/20 transition-all text-xs font-bold cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Panel Admin
              </button>
              <button
                onClick={logoutAdmin}
                title="Cerrar Sesión Admin"
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#a89f9e] hover:text-red-400 transition-colors border border-white/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              title="Acceso Administrador (JovasMotion)"
              className="p-2 rounded-full bg-white/5 hover:bg-[#feba39]/20 text-[#a89f9e] hover:text-[#feba39] transition-all border border-white/10 hover:border-[#feba39]/30 cursor-pointer group"
            >
              <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          )}

          <MagneticButton
            link="#contacto"
            onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}
            paddingX={18}
            paddingY={9}
            radius={12}
            magnet={6}
            fill="linear-gradient(135deg, #ff5540 0%, #feba39 100%)"
            textColor="#2c1800"
            sweepColor="#141316"
            sweepTextColor="#feba39"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contrátame</span>
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2 shrink-0 ml-auto">
          {isAdminLoggedIn && (
            <button
              onClick={onOpenDashboardTab}
              className="p-2 rounded-lg bg-[#feba39]/20 text-[#feba39] text-xs font-bold shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#232026] text-white border border-[#b18780]/30 shadow-md shrink-0 cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a181d] border-b border-[#b18780]/20 px-6 py-6 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#a89f9e] uppercase">Categorías</span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-[#ff5540]/20 text-[#ff5540] font-bold border-l-2 border-[#ff5540]'
                    : 'text-[#e7e1e5]/80 hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('sobre-mi');
              }}
              className="text-left text-sm text-[#e7e1e5] hover:text-[#feba39]"
            >
              Sobre Mí
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('flujo-trabajo');
              }}
              className="text-left text-sm text-[#e7e1e5] hover:text-[#feba39]"
            >
              Proceso Técnico
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center gap-2 text-xs text-[#a89f9e] hover:text-[#feba39]"
              >
                <Shield className="w-4 h-4 text-[#feba39]" />
                {isAdminLoggedIn ? 'Modo Administrador Activo' : 'Acceso Administrador'}
              </button>

              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  scrollToSection('contacto');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
