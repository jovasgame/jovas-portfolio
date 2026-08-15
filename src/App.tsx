import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { PortfolioGrid } from './components/PortfolioGrid';
import { VideoSection } from './components/VideoSection';
import { WorkflowSection } from './components/WorkflowSection';
import { CoverflowGallery } from './components/CoverflowGallery';
import { ModelShowcaseSection } from './components/ModelShowcaseSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import Aurora from './components/Aurora';

const AdminDashboard = React.lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const ContactPage = React.lazy(() =>
  import('./components/ContactPage').then((m) => ({ default: m.ContactPage }))
);

import { trackPageView, initGlobalClickTracker } from './utils/analyticsTracker';

const MainPortfolioContent: React.FC = () => {
  const { isAdminLoggedIn } = usePortfolio();
  const [showDashboard, setShowDashboard] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);

  React.useEffect(() => {
    trackPageView();
    initGlobalClickTracker();
  }, []);

  if (isAdminLoggedIn && showDashboard) {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#0a090c] flex items-center justify-center text-[#feba39] font-medium">
            Cargando Panel de Administración...
          </div>
        }
      >
        <AdminDashboard onCloseDashboard={() => setShowDashboard(false)} />
      </React.Suspense>
    );
  }

  if (showContactPage) {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#0a090c] flex items-center justify-center text-[#feba39] font-medium">
            Cargando Página de Contacto...
          </div>
        }
      >
        <ContactPage onBack={() => setShowContactPage(false)} />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a090c] text-[#e7e1e5] relative selection:bg-[#feba39] selection:text-[#432c00] overflow-x-hidden w-full max-w-full">
      {/* Dynamic Lightweight WebGL Aurora Background & Lava Lamp Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80 max-w-full">
        <Aurora
          colorStops={["#ff5540", "#feba39", "#ff7563"]}
          blend={0.5}
          amplitude={1.1}
          speed={0.4}
        />
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ff5540]/20 to-[#feba39]/10 blur-[130px] lava-blob-1" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#feba39]/15 to-[#ff5540]/10 blur-[150px] lava-blob-2" />
        <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#ff5540]/15 to-[#feba39]/15 blur-[140px] lava-blob-3" />
      </div>

      {/* Top Header Navigation */}
      <Navbar onOpenDashboardTab={() => setShowDashboard(true)} />

      {/* Main Sections (Scroll-Triggered) */}
      <main className="overflow-x-hidden w-full max-w-full">
        {/* 1. Interactive Eye-Catching Slider */}
        <HeroSlider />

        {/* 2. Dynamic Bento Portfolio Grid with Filter Pills */}
        <PortfolioGrid />

        {/* 2.5 Dedicated Video & Animation YouTube-Style Section */}
        <VideoSection />

        {/* 3. Technical Workflow & Performance Section */}
        <WorkflowSection />

        {/* 4. 3D Coverflow Gallery Previsualizer */}
        <CoverflowGallery />

        {/* 4.5 Visor 3D WebGL Real-Time (ModelViewer) */}
        <ModelShowcaseSection />

        {/* 5. Galería de Fotografía */}
        <PhotoGallerySection />

        {/* 6. About José Luis Vásquez (Biography) */}
        <AboutSection />

        {/* 6. Contact & Quote Generator */}
        <ContactSection onOpenContactPage={() => setShowContactPage(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProjectModal />
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <MainPortfolioContent />
    </PortfolioProvider>
  );
}
