import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { Send, CheckCircle2, MessageSquare, Flame, Mail, ArrowLeft, Phone, QrCode } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const { addContactMessage, brandAssets } = usePortfolio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Animación');
  const [budget, setBudget] = useState('$2,000 - $5,000');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addContactMessage({
      name,
      email,
      projectType,
      budget,
      message
    });

    setSubmitted(true);
  };

  const whatsappMessageUrl = `https://wa.me/50372554916?text=${encodeURIComponent(
    `Hola Jovas, mi nombre es ${name || 'Cliente'} (${email}). Me interesa un proyecto de ${projectType} con un presupuesto de ${budget}. Detalles: ${message}`
  )}`;

  return (
    <div className="min-h-screen bg-[#0a090c] text-[#e7e1e5] relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[500px] bg-gradient-to-tr from-[#ff5540]/15 via-[#feba39]/15 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Top Bar with Back Button */}
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between relative z-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-xs font-bold uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Portafolio</span>
        </button>

        <a href="#hero" onClick={onBack} className="flex items-center gap-2">
          {(brandAssets.logoUrl || brandAssets.metallicIconUrl) ? (
            <img
              src={brandAssets.logoUrl || brandAssets.metallicIconUrl}
              alt="Jovas Logo"
              className="h-8 w-auto mix-blend-screen rounded-lg"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px]">
              <div className="w-full h-full bg-[#1e1c21] rounded-[7px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#feba39]" />
              </div>
            </div>
          )}
          <span className="font-syne font-black text-lg text-white">JOVAS</span>
        </a>
      </div>

      {/* Main Centered Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-[#141218]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative z-10 space-y-8"
      >
        {/* Header Header */}
        <div className="text-center space-y-3 border-b border-white/10 pb-6">
          {(brandAssets.logoUrl || brandAssets.metallicIconUrl) && (
            <img
              src={brandAssets.logoUrl || brandAssets.metallicIconUrl}
              alt="Logo"
              className="w-20 h-20 mx-auto object-contain mix-blend-screen rounded-full filter drop-shadow-[0_0_20px_rgba(255,85,64,0.4)]"
            />
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 text-[#feba39] text-xs font-mono font-bold uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff5540]" />
            Formulario de Contacto Oficial
          </div>

          <h1 className="font-syne font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            CONTÁCTAME Y DEJA TU MENSAJE
          </h1>

          <p className="text-xs sm:text-sm text-[#a89f9e] max-w-xl mx-auto font-sans leading-relaxed">
            Completa tus requerimientos y objetivos visuales. Tu consulta se registrará directamente en nuestro panel privado de control.
          </p>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="py-10 text-center space-y-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-syne font-black text-3xl text-white">¡Mensaje Recibido!</h3>
              <p className="text-sm text-[#a89f9e] max-w-md mx-auto leading-relaxed">
                Tu proyecto ha sido guardado exitosamente en la base de datos privada de Jovas Motion. Te responderemos muy pronto.
              </p>
            </div>

            {/* Extra WhatsApp instant button option */}
            <div className="pt-4 border-t border-white/10 max-w-md mx-auto space-y-3">
              <span className="text-xs font-mono text-[#feba39] uppercase block">¿Deseas atención inmediata?</span>
              <a
                href={whatsappMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] text-[#0b3818] font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <span>Enviar también por WhatsApp (+503 7255 4916)</span>
              </a>
              <button
                onClick={onBack}
                className="text-xs text-[#a89f9e] hover:text-white underline block mx-auto pt-2"
              >
                Volver a la página principal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#a89f9e] uppercase block">Tu Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sofía Ramírez"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-base sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#a89f9e] uppercase block">Tu Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sofia@estudio.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a89f9e] uppercase block">Tipo de Servicio</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Animación', 'Ilustración', 'Modelado 3D', 'Arte Conceptual'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      projectType === type
                        ? 'bg-[#ff5540] text-[#2c1800] border-[#ff5540] shadow-md'
                        : 'bg-black/30 text-[#a89f9e] border-white/10 hover:border-white/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a89f9e] uppercase block">Presupuesto Estimado</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#ff5540] transition-colors text-base sm:text-sm cursor-pointer"
              >
                <option value="< $2,000">&lt; $2,000 USD</option>
                <option value="$2,000 - $5,000">$2,000 - $5,000 USD</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000 USD</option>
                <option value="$10,000+">$10,000+ USD</option>
              </select>
            </div>

            {/* Message Details */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a89f9e] uppercase block">Detalles del Proyecto</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntame sobre tus objetivos, plazos y requerimientos visuales..."
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-base sm:text-sm resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ff5540]/25 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Consulta a Jovas</span>
              </button>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
};
