import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { PortfolioGrid } from './components/PortfolioGrid';
import { WorkflowSection } from './components/WorkflowSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

const MainPortfolioContent: React.FC = () => {
  const { isAdminLoggedIn } = usePortfolio();
  const [showDashboard, setShowDashboard] = useState(false);

  if (isAdminLoggedIn && showDashboard) {
    return <AdminDashboard onCloseDashboard={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen mesh-bg text-[#e7e1e5] relative selection:bg-[#feba39] selection:text-[#432c00]">
      {/* Floating Animated Lava Lamp Orbs Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ff5540]/30 to-[#feba39]/20 blur-[130px] lava-blob-1" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#feba39]/25 to-[#ff5540]/15 blur-[150px] lava-blob-2" />
        <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#ff5540]/25 to-[#feba39]/20 blur-[140px] lava-blob-3" />
      </div>

      {/* Top Header Navigation */}
      <Navbar onOpenDashboardTab={() => setShowDashboard(true)} />

      {/* Main Sections (Scroll-Triggered) */}
      <main>
        {/* 1. Interactive Eye-Catching Slider */}
        <HeroSlider />

        {/* 2. Dynamic Bento Portfolio Grid with Filter Pills */}
        <PortfolioGrid />

        {/* 3. Technical Workflow & Performance Section */}
        <WorkflowSection />

        {/* 4. About José Luis Vasquez */}
        <AboutSection />

        {/* 5. Contact & Quote Generator */}
        <ContactSection />
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
