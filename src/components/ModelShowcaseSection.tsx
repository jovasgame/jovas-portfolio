import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Box, RotateCw, Sun, Sparkles, Layers, Info, CheckCircle2, Download, Code } from 'lucide-react';
import ModelViewer from './ModelViewer';

export interface Model3DItem {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
  environmentPreset?: 'forest' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
}

const STATIC_3D_MODELS: Model3DItem[] = [
  {
    id: 'toy-car',
    name: 'Cyber Vehicle 3D',
    category: 'Vehículo / Hard-Surface',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb',
    description: 'Modelo 3D interactivo con sombras en tiempo real, mapas PBR y reflejos de luz física.',
    environmentPreset: 'city'
  },
  {
    id: 'damaged-helmet',
    name: 'Casco Sci-Fi PBR',
    category: 'Personajes & Utilería',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    description: 'Texturizado PBR desgastado en Substance Painter renderizado en tiempo real con Shaders GLSL.',
    environmentPreset: 'warehouse'
  },
  {
    id: 'duck-model',
    name: 'Mascota 3D Poly',
    category: 'Orgánico / Props',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Binary/Duck.glb',
    description: 'Muestra de malla optimizada para bajo consumo de memoria y respuesta táctil fluida.',
    environmentPreset: 'sunset'
  }
];

export const ModelShowcaseSection: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<Model3DItem>(STATIC_3D_MODELS[0]);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [environmentPreset, setEnvironmentPreset] = useState<'forest' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby'>(
    STATIC_3D_MODELS[0].environmentPreset || 'city'
  );

  return (
    <section id="visores-3d" className="py-24 relative overflow-hidden bg-[#0d0c10] border-t border-white/10">
      {/* Background Decor Lights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff5540]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#feba39]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#feba39]/10 border border-[#feba39]/30 text-[#feba39] text-xs font-mono font-bold uppercase tracking-widest">
              <Box className="w-4 h-4 text-[#ff5540]" />
              Visor Interactivo 3D WebGL (Sin Base de Datos)
            </div>
            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              Laboratorio <span className="bg-gradient-to-r from-[#ff5540] to-[#feba39] bg-clip-text text-transparent">3D Real-Time</span>
            </h2>
            <p className="text-[#a89f9e] text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
              Inspecciona modelos 3D interactivos con rotación manual, zoom dinámico, iluminación de estudio y captura de capturas en alta resolución en tiempo real.
            </p>
          </div>

          {/* Controls toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setAutoRotate(prev => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-[#ff5540]/20 border-[#ff5540] text-[#ff7563]'
                  : 'bg-white/5 border-white/10 text-[#a89f9e] hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Auto-Rotación: SI' : 'Auto-Rotación: NO'}</span>
            </button>

            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10">
              <Sun className="w-3.5 h-3.5 text-[#feba39] ml-1.5" />
              <select
                value={environmentPreset}
                onChange={(e) => setEnvironmentPreset(e.target.value as any)}
                className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer pr-2"
              >
                <option value="city" className="bg-black text-white">Luz: Ciudad</option>
                <option value="studio" className="bg-black text-white">Luz: Estudio</option>
                <option value="warehouse" className="bg-black text-[#feba39]">Luz: Almacén</option>
                <option value="sunset" className="bg-black text-white">Luz: Atardecer</option>
                <option value="forest" className="bg-black text-white">Luz: Bosque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main 3D Canvas Container & Model Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Model Selection Cards Column (Left) */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-center">
            <h3 className="text-xs font-mono text-[#feba39] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5540]" />
              Selecciona Muestra 3D
            </h3>

            {STATIC_3D_MODELS.map((item) => {
              const active = selectedModel.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedModel(item);
                    if (item.environmentPreset) setEnvironmentPreset(item.environmentPreset);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#181524] border-[#feba39] shadow-lg shadow-[#feba39]/10 scale-[1.02]'
                      : 'bg-[#121017]/80 border-white/10 hover:border-white/20 hover:bg-[#181524]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-syne font-bold text-sm text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-[#feba39] border border-white/10 shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#a89f9e] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </button>
              );
            })}

            {/* Direct Model Upload Instructions Card */}
            <div className="p-4 rounded-2xl bg-[#ff5540]/10 border border-[#ff5540]/30 space-y-2 mt-4">
              <h4 className="font-syne font-bold text-xs text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#feba39]" />
                ¿Cómo agregar tus propios modelos 3D?
              </h4>
              <p className="text-[11px] text-[#a89f9e] leading-relaxed font-sans">
                Para añadir tus propios archivos 3D (<strong>.glb</strong>, <strong>.gltf</strong>, <strong>.fbx</strong> o <strong>.obj</strong>) sin usar base de datos:
              </p>
              <ol className="text-[10px] font-mono text-[#feba39] space-y-1 list-decimal pl-4">
                <li>Copia tu archivo a la carpeta <strong>public/models/</strong>.</li>
                <li>Añade la ruta <code className="text-white">"/models/mi-modelo.glb"</code> en <code className="text-white">STATIC_3D_MODELS</code>.</li>
              </ol>
            </div>
          </div>

          {/* Interactive 3D Model Viewport (Right) */}
          <div className="lg:col-span-8 bg-[#121017] rounded-3xl border border-white/15 overflow-hidden shadow-2xl relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between group">
            
            {/* Top Viewport Status Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#feba39]/40 text-[11px] font-mono text-[#feba39] font-bold shadow-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {selectedModel.name}
              </span>
            </div>

            {/* Three.js Model Canvas */}
            <ModelViewer
              key={selectedModel.id}
              url={selectedModel.url}
              height="100%"
              width="100%"
              autoRotate={autoRotate}
              autoRotateSpeed={0.4}
              environmentPreset={environmentPreset}
              showScreenshotButton={true}
              enableManualRotation={true}
              enableHoverRotation={true}
              enableMouseParallax={true}
              enableManualZoom={true}
              className="w-full h-full min-h-[460px] sm:min-h-[520px]"
            />

            {/* Bottom Interactivity Overlay Hint */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-[#a89f9e]">
              <span className="bg-black/75 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                🖱️ Arrastra para rotar 360° • Rueda del ratón para zoom
              </span>
              <span className="bg-black/75 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 hidden sm:inline-block">
                Motor: Three.js / React Three Fiber
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
