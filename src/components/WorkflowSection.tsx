import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Flame } from 'lucide-react';
import { MagicBentoCard } from './MagicBento';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Conceptualización y Moodboard',
      description: 'Análisis de la visión del cliente, creación de paletas de color ígneas y dirección estilística antes de tocar el software.',
      tools: ['Photoshop', 'PureRef', 'Figma']
    },
    {
      number: '02',
      title: 'Topología 3D y Rigging',
      description: 'Modelado Hard Surface y esculturas orgánicas con flujo de polígonos limpio para optimizar dinamismo y velocidad.',
      tools: ['Cinema 4D', 'ZBrush', 'Blender']
    },
    {
      number: '03',
      title: 'Texturizado PBR y Render en Blender',
      description: 'Creación de materiales fidedignos con sombreadores de nodos PBR, mapas de rugosidad, emisión y volumetría realista procesados en Blender Cycles y EEVEE.',
      tools: ['Blender 3D', 'Cycles Engine', 'EEVEE']
    },
    {
      number: '04',
      title: 'Animación y Compositing Final',
      description: 'Ritmo cinematográfico a 60 FPS, simulación de partículas fluidas y corrección de color profesional para máximo impacto visual.',
      tools: ['After Effects', 'Houdini', 'Nuke']
    }
  ];

  return (
    <section id="flujo-trabajo" className="py-24 relative bg-[#0a090c]/35 backdrop-blur-md overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5540]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#feba39]/10 border border-[#feba39]/30 text-[#feba39] text-xs font-mono font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            Precisión Técnica y Flujo de Trabajo
          </div>

          <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight">
            DEL CONCEPTO AL RENDER FINAL
          </h2>

          <p className="text-sm sm:text-base text-[#a89f9e] leading-relaxed">
            Metodología estructurada para garantizar entregas en tiempo récord sin sacrificar calidad ni fluidez de fotogramas.
          </p>
        </motion.div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <MagicBentoCard
                glowColor={idx % 2 === 0 ? "255, 85, 64" : "254, 186, 57"}
                enableBorderGlow={true}
                enableStars={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                className="p-6 h-full flex flex-col justify-between"
                style={{ backgroundColor: "rgba(26, 24, 29, 0.45)", minHeight: "260px" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-black text-4xl text-[#ff5540] opacity-90">
                      {step.number}
                    </span>
                    <Flame className="w-5 h-5 text-[#feba39] opacity-70" />
                  </div>

                  <h3 className="font-syne font-bold text-lg text-white">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#a89f9e] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex flex-wrap gap-1.5 z-10 relative">
                  {step.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#feba39] border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </MagicBentoCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
