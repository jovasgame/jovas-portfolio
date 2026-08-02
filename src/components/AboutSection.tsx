import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { User, Award, CheckCircle, Flame, Sparkles, ExternalLink, Mail } from 'lucide-react';
import { MagicBentoCard } from './MagicBento';

export const AboutSection: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <section id="sobre-mi" className="py-24 relative bg-[#141316]/75 backdrop-blur-sm overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#feba39]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Portrait & Live Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative flex"
          >
            <MagicBentoCard
              glowColor="255, 85, 64"
              enableBorderGlow={true}
              enableStars={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              className="w-full flex flex-col justify-between"
              style={{ borderRadius: "24px", overflow: "hidden" }}
            >
              <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] flex flex-col justify-end">
                <img
                  src={profile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA"}
                  alt={profile.name}
                  className="absolute inset-0 w-full h-full object-cover object-top filter brightness-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141316] via-[#141316]/30 to-transparent"></div>

                {/* Stat Overlay Badge Pinned at the Very Foot of the Photo */}
                <div className="relative z-10 p-4 sm:p-5 m-4 sm:m-6 mt-auto rounded-2xl bg-[#1e1c21]/90 backdrop-blur-md border border-white/10 flex items-center justify-around shadow-2xl">
                  <div className="text-center">
                    <span className="font-syne font-black text-2xl text-[#feba39] block">
                      {profile.experienceYears}
                    </span>
                    <span className="text-[10px] font-mono text-[#a89f9e] uppercase">
                      Experiencia
                    </span>
                  </div>

                  <div className="h-8 w-[1px] bg-white/10"></div>

                  <div className="text-center">
                    <span className="font-syne font-black text-2xl text-[#ff5540] block">
                      {profile.projectsCompletedCount}
                    </span>
                    <span className="text-[10px] font-mono text-[#a89f9e] uppercase">
                      Proyectos
                    </span>
                  </div>
                </div>
              </div>
            </MagicBentoCard>
          </motion.div>

          {/* Right Column: Bio Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex"
          >
            <MagicBentoCard
              glowColor="254, 186, 57"
              enableBorderGlow={true}
              enableStars={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              className="p-8 sm:p-10 w-full flex flex-col justify-between space-y-6"
              style={{ backgroundColor: "rgba(26, 24, 29, 0.85)" }}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 text-[#ff5540] text-xs font-mono font-bold tracking-widest uppercase">
                  <User className="w-3.5 h-3.5" />
                  Biografía & Manifiesto Creativo
                </div>

                <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight">
                  {profile.name}
                </h2>

                <p className="font-mono text-sm text-[#feba39] font-bold">
                  {profile.title}
                </p>

                <div className="space-y-4 text-sm sm:text-base text-[#e7e1e5]/85 leading-relaxed">
                  {profile.bioParagraphs.map((para, idx) => (
                    <p key={idx} className="border-l-2 border-[#ff5540]/40 pl-4 py-1">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Social Links Bar */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 z-10 relative">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-mono border border-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#feba39]" />
                  {profile.email}
                </a>

                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#a89f9e] hover:text-white text-xs font-mono border border-white/10 transition-colors"
                >
                  Instagram
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={profile.socialLinks.artstation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#a89f9e] hover:text-white text-xs font-mono border border-white/10 transition-colors"
                >
                  ArtStation
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={profile.socialLinks.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#a89f9e] hover:text-white text-xs font-mono border border-white/10 transition-colors"
                >
                  Vimeo
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </MagicBentoCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
