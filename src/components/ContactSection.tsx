import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, QrCode, Sparkles, ExternalLink, Check, Copy, ArrowRight, Flame } from 'lucide-react';
import { MagicBentoCard } from './MagicBento';

interface ContactSectionProps {
  onOpenContactPage?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenContactPage }) => {
  const { profile } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const primaryEmail = profile.email || "jovas.motion@design.com";
  const whatsappNumber = "+503 7255 4916";
  const whatsappLink = "https://wa.me/50372554916";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(whatsappLink)}&color=ffffff&bgcolor=141316`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 3000);
  };

  return (
    <section id="contacto" className="py-24 relative bg-[#18161b]/75 backdrop-blur-sm overflow-hidden w-full max-w-full">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[400px] bg-gradient-to-r from-[#ff5540]/10 via-[#feba39]/10 to-transparent blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 text-[#feba39] text-xs font-mono font-bold tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff5540]" />
            Canales Directos de Comunicación
          </div>

          <h2 className="font-syne font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            ¿TIENES UNA IDEA EN MENTE? <span className="bg-gradient-to-r from-[#ff5540] to-[#feba39] bg-clip-text text-transparent">CONÉCTATE CON JOVAS</span>
          </h2>

          <p className="text-sm sm:text-base text-[#a89f9e] leading-relaxed max-w-xl mx-auto">
            Escanea el código QR de WhatsApp para hablar directamente o utiliza nuestros correos y formulario oficial.
          </p>
        </div>

        {/* TWO CARDS GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CUADRO 1: WHATSAPP QR BOX */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <MagicBentoCard
              glowColor="37, 211, 102"
              enableBorderGlow={true}
              enableStars={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              className="p-8 sm:p-10 w-full flex flex-col justify-between items-center text-center space-y-6"
              style={{ backgroundColor: "rgba(20, 18, 24, 0.9)" }}
            >
              <div className="space-y-3 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold uppercase">
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp Instantáneo
                </div>
                <h3 className="font-syne font-black text-2xl sm:text-3xl text-white">
                  WHATSAPP DIRECTO
                </h3>
                <p className="text-xs text-[#a89f9e] max-w-xs mx-auto">
                  Escanea con la cámara de tu teléfono para iniciar un chat directo:
                </p>
              </div>

              {/* QR Code Container with Glowing Frame */}
              <div className="relative p-4 rounded-3xl bg-[#141316] border border-[#25D366]/30 shadow-[0_0_30px_rgba(37,211,102,0.15)] group hover:scale-105 transition-transform duration-300">
                <img
                  src={qrCodeUrl}
                  alt="WhatsApp QR Code +503 7255 4916"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl filter brightness-110"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#25D366]/10 to-transparent pointer-events-none" />
              </div>

              {/* Phone Number Display & Action Button */}
              <div className="w-full space-y-3 pt-2">
                <div className="font-mono text-base font-bold text-white tracking-widest">
                  {whatsappNumber}
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#083015] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Abrir Chat de WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </MagicBentoCard>
          </motion.div>

          {/* CUADRO 2: EMAIL ICONS & DIRECT MESSAGE FORM BUTTON */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <MagicBentoCard
              glowColor="254, 186, 57"
              enableBorderGlow={true}
              enableStars={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              className="p-8 sm:p-10 w-full flex flex-col justify-between space-y-6"
              style={{ backgroundColor: "rgba(20, 18, 24, 0.9)" }}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#feba39]/15 border border-[#feba39]/30 text-[#feba39] text-xs font-mono font-bold uppercase">
                  <Mail className="w-3.5 h-3.5" />
                  Canales de Mensajería
                </div>
                <h3 className="font-syne font-black text-2xl sm:text-3xl text-white">
                  CORREO Y FORMULARIO
                </h3>
                <p className="text-xs text-[#a89f9e]">
                  Elige el método de contacto de tu preferencia:
                </p>
              </div>

              {/* 2 Email Buttons & 1 Direct Message Button */}
              <div className="space-y-4 w-full my-auto">
                
                {/* Email Icon Button 1 */}
                <div className="p-4 rounded-2xl bg-[#1a181e] border border-white/10 hover:border-[#ff5540]/40 transition-colors flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5540]/20 text-[#ff5540] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#a89f9e] uppercase block">Correo Principal</span>
                      <span className="text-xs sm:text-sm font-bold text-white truncate block">{primaryEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(primaryEmail)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-[#a89f9e] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                      title="Copiar Correo"
                    >
                      {copiedEmail === primaryEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="px-3 py-1.5 rounded-lg bg-[#ff5540]/20 hover:bg-[#ff5540] text-[#ff7563] hover:text-[#2c1800] text-xs font-bold transition-all"
                    >
                      Escribir
                    </a>
                  </div>
                </div>

                {/* Direct Message Icon Button 3 */}
                <div 
                  onClick={onOpenContactPage}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#ff5540]/10 to-[#feba39]/10 border border-[#feba39]/30 flex items-center justify-between gap-3 cursor-pointer hover:border-[#ff5540]/60 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5540] to-[#feba39] text-[#2c1800] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#feba39] uppercase block font-bold">Mensaje Directo al Sistema</span>
                      <span className="text-xs text-[#e7e1e5] group-hover:text-white transition-colors">Formulario de Consulta Oficial</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#feba39] group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>

              </div>

              {/* Main Button to Open Centered Contact Page */}
              <div className="pt-2">
                <button
                  onClick={onOpenContactPage}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ff5540]/25 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Contáctame y Deja Tu Mensaje (Formulario)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

            </MagicBentoCard>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
