import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { Send, CheckCircle2, MessageSquare, Sparkles, Mail, User, DollarSign, Flame } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addContactMessage } = usePortfolio();

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
    setName('');
    setEmail('');
    setMessage('');

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contacto" className="py-24 relative bg-[#18161b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Text Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 text-[#ff5540] text-xs font-mono font-bold tracking-widest uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              Inicia Tu Proyecto
            </div>

            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight">
              ¿TIENES UNA IDEA EN MENTE?
            </h2>

            <p className="text-sm sm:text-base text-[#a89f9e] leading-relaxed">
              Transformemos tus visiones en secuencias en movimiento inolvidables. Escríbeme directamente y te responderé en menos de 24 horas.
            </p>

            <div className="p-6 rounded-2xl bg-[#141316] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff5540]/20 text-[#ff5540] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#a89f9e] uppercase block">Correo Directo</span>
                  <span className="text-sm font-bold text-white">jovas.motion@design.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#feba39]/20 text-[#feba39] flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#a89f9e] uppercase block">Disponibilidad</span>
                  <span className="text-sm font-bold text-emerald-400">Abierto para Proyectos Q3/Q4</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl glass-card border border-[#b18780]/30 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-syne font-bold text-2xl text-white">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-sm text-[#a89f9e] max-w-md mx-auto">
                    Gracias por ponerte en contacto. Tu mensaje ha sido enviado directamente al panel de Jovas Motion. Nos comunicaremos contigo en breve.
                  </p>
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
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-sm"
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
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[#a89f9e] uppercase block">Tipo de Servicio</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Animación', 'Ilustración', 'Modelado 3D', 'Arte Conceptual'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(type)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            projectType === type
                              ? 'bg-[#ff5540] text-[#2c1800] border-[#ff5540]'
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
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#ff5540] transition-colors text-sm cursor-pointer"
                    >
                      <option value="< $2,000">&lt; $2,000 USD</option>
                      <option value="$2,000 - $5,000">$2,000 - $5,000 USD</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000 USD</option>
                      <option value="$10,000+">$10,000+ USD</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[#a89f9e] uppercase block">Detalles del Proyecto</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntame sobre tus objetivos, plazos y requerimientos visuales..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#ff5540] transition-colors text-sm resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#ff5540]/20 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Consulta a Jovas
                  </button>

                </form>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
