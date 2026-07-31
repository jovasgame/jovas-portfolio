import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Check, 
  Copy, 
  HardDrive, 
  Video, 
  Play, 
  ExternalLink, 
  HelpCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { parseGoogleDriveUrl, convertGoogleDriveToDirectUrl, parseMediaUrl } from '../utils/mediaUtils';
import { MediaViewer } from './MediaViewer';

export { parseGoogleDriveUrl, convertGoogleDriveToDirectUrl };

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  presetImages?: { label: string; url: string }[];
  allowVideo?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Imagen / Archivo Multimedia',
  helperText = 'Sube un archivo, conecta tu Google Drive o pega un enlace',
  presetImages,
  allowVideo = true
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'drive' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [driveInput, setDriveInput] = useState('');
  const [isDriveVideo, setIsDriveVideo] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDriveHelp, setShowDriveHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultPresets = [
    {
      label: 'Neon Motion 3D',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4bKeEYh9XdWGAQ2CFSL_4E8WmLHh3cRdkJIQx9_dZ6j0gzz5B3g7p9FBloAN57RRNvtj8H00FBq_5Mp8yPg7qLKnvkU-C2eoR9UIvrNPGiKaXC2Jo7H-iDXW9ZURk9qt51-4deAZ8LmfMGkAsgO2FEZPZtLH1Y9QcxFt9hH9M9JAIWjoAZA6RCHrYIaf8IH_rOJuzhxZeuz0UGzfHM7KyWiLIy-GcLa_V4euK8k2TzNsN7I7aA1RJVQ'
    },
    {
      label: 'Ignis Character',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA'
    },
    {
      label: 'Cyber Sanctuary',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOYQYUw06Ny1XAHTsDwOFbOSTOo3zDdl8MjM3Yd580-WEo0Q0wlbioj3kdyrcVXGY7bKcyS7r-ZkOYXdlJd_94nRk2lEBeoFIX3F_7XHRL2rRdtlg0emtyL0TDi2kjJACUkITellHpdqtXTqrK6VJO-un3WSnHeEyA5XsJXDuWTA7oo2uDNY_CU_U1jB_vs1A1omWU_kRcLePwLpOBemevbYS63w7MH_ZGeV2MOCK1d6z9J6cVqzu6w'
    },
    {
      label: 'Santuario Espada',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB89Bjx9EZKKcWk1gJGr4hm4lXaOxr9fOAeieKeqkApqv5-6_Ru6BjYsQCYwBaYvjFHSU0ycOUHRTREVYhafcOnL5flTOeEU8q8CFrYRewcacOGjkQBuKrMZpC2N_Re1bUQEowtvwFFnik6Gc-ixIG3ZKOyHKplkOJrUHnIsi06eLxQlFfuJpszqegsjbBf3hwXW2WGIOFj0tf_sj3sbZNGe6M32WFuEDzPRLar3mibhsihdC6vhYUnMQ'
    }
  ];

  const presetsToUse = presetImages || defaultPresets;

  const handleFileProcess = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVid = file.type.startsWith('video/');

    if (!isImage && !isVid) {
      alert('Por favor selecciona un archivo multimedia válido (PNG, JPG, WEBP, GIF, SVG, MP4, WEBM).');
      return;
    }

    // Heavy file warning
    if (file.size > 8 * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      alert(`⚠️ El archivo seleccionado pesa ${sizeMb} MB.\n\nLos navegadores limitan el almacenamiento local a ~5MB. Para videos HD/4K de gran tamaño, te recomendamos subirlos a tu Google Drive, YouTube o Vimeo y pegar el enlace. La app lo convertirá automáticamente en un reproductor HD fluido.`);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    const cleaned = urlInput.trim();

    // Check if it's a google drive URL typed in URL tab
    const driveParsed = parseGoogleDriveUrl(cleaned);
    if (driveParsed) {
      const converted = convertGoogleDriveToDirectUrl(cleaned, isDriveVideo);
      onChange(converted);
    } else {
      onChange(cleaned);
    }
  };

  const handleApplyGoogleDrive = () => {
    if (!driveInput.trim()) return;

    const parsed = parseGoogleDriveUrl(driveInput.trim());
    if (!parsed) {
      alert('No pudimos detectar el ID de Google Drive. Por favor pega un enlace público como: https://drive.google.com/file/d/12345/view?usp=sharing');
      return;
    }

    const convertedUrl = convertGoogleDriveToDirectUrl(driveInput.trim(), isDriveVideo);
    onChange(convertedUrl);
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const currentMediaInfo = parseMediaUrl(value, isDriveVideo);

  return (
    <div className="space-y-3 bg-[#131116] p-4 rounded-2xl border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-mono font-bold text-[#feba39] uppercase flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#ff5540]" />
            {label}
          </label>
          <p className="text-[11px] text-[#a89f9e] font-sans">{helperText}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-[11px] font-mono flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold'
                : 'text-[#a89f9e] hover:text-white'
            }`}
          >
            Subir Archivo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'drive'
                ? 'bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] text-white font-bold shadow-sm'
                : 'text-[#a89f9e] hover:text-white'
            }`}
          >
            <HardDrive className="w-3 h-3 text-[#4285F4]" />
            Google Drive
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold'
                : 'text-[#a89f9e] hover:text-white'
            }`}
          >
            Enlace URL / YT / Vimeo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold'
                : 'text-[#a89f9e] hover:text-white'
            }`}
          >
            Muestras 3D
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload Dropzone */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#feba39] bg-[#feba39]/10 scale-[0.99]'
                : 'border-white/15 bg-black/40 hover:border-[#feba39]/50 hover:bg-black/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={allowVideo ? "image/*,video/*" : "image/*"}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#ff5540]/10 border border-[#ff5540]/30 flex items-center justify-center text-[#feba39]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Haz clic para seleccionar o arrastra tu archivo aquí</p>
                <p className="text-[10px] font-mono text-[#a89f9e] mt-0.5">
                  Soporta PNG, JPG, WEBP, GIF, SVG {allowVideo && 'y MP4/WEBM'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-2 bg-[#ff5540]/10 rounded-lg border border-[#ff5540]/20 text-[11px] text-[#ff7563]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong>¿Video muy pesado (4K/HD)?</strong> Súbelo a <strong>Google Drive</strong>, <strong>YouTube</strong> o <strong>Vimeo</strong> y usa la pestaña correspondiente para un streaming rápido sin sobrecargar memoria.
            </span>
          </div>
        </div>
      )}

      {/* Mode 2: Google Drive Integration */}
      {activeTab === 'drive' && (
        <div className="space-y-3 bg-[#18161c] p-4 rounded-xl border border-[#4285F4]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <div className="w-6 h-6 rounded-lg bg-[#4285F4]/20 border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4]">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <span>Conectar Enlace de Google Drive</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#4285F4] hover:underline flex items-center gap-1 bg-[#4285F4]/10 px-2.5 py-1 rounded-lg border border-[#4285F4]/20"
              >
                Abrir mi Google Drive <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setShowDriveHelp(!showDriveHelp)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#a89f9e] hover:text-white"
                title="¿Cómo obtener el enlace?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showDriveHelp && (
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] text-[#a89f9e] space-y-1.5 font-sans">
              <p className="font-bold text-[#feba39] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Pasos para reproducir videos de Google Drive en tu portafolio:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-white/90">
                <li>Sube tu video o imagen a tu cuenta de <strong>Google Drive</strong>.</li>
                <li>Haz clic derecho en el archivo &rarr; <strong>Compartir &rarr; Copiar enlace</strong>.</li>
                <li>Cambia el acceso a: <strong>"Cualquier persona con el enlace"</strong> (Lector).</li>
                <li>Pega el enlace abajo, selecciona si es <strong>Video</strong> o <strong>Imagen</strong> y presiona <strong>"Convertir & Usar"</strong>.</li>
              </ol>
            </div>
          )}

          {/* Drive Type Selector (Video vs Imagen) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-mono text-[#a89f9e]">Tipo de contenido en Drive:</span>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              {allowVideo && (
                <label className="flex items-center gap-1.5 text-white cursor-pointer bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                  <input
                    type="radio"
                    name="driveType"
                    checked={isDriveVideo}
                    onChange={() => setIsDriveVideo(true)}
                    className="accent-[#4285F4]"
                  />
                  <Video className="w-3 h-3 text-[#ff5540]" /> Video / Reel (Recomendado)
                </label>
              )}

              <label className="flex items-center gap-1.5 text-white cursor-pointer bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                <input
                  type="radio"
                  name="driveType"
                  checked={!isDriveVideo}
                  onChange={() => setIsDriveVideo(false)}
                  className="accent-[#4285F4]"
                />
                <ImageIcon className="w-3 h-3 text-[#feba39]" /> Imagen Fija
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={driveInput}
                onChange={(e) => setDriveInput(e.target.value)}
                placeholder="https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/80 border border-[#4285F4]/40 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-[#4285F4]"
              />
              <HardDrive className="w-4 h-4 text-[#4285F4] absolute left-3 top-3" />
            </div>

            <button
              type="button"
              onClick={handleApplyGoogleDrive}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-md shadow-[#4285F4]/20 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Convertir & Usar
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Direct URL Input (Supports YouTube, Vimeo, Direct MP4, Web URLs) */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="YouTube, Vimeo, Google Drive o URL directa (.mp4 / .jpg)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-[#feba39]"
              />
              <LinkIcon className="w-4 h-4 text-[#a89f9e] absolute left-3 top-3" />
            </div>

            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2.5 rounded-xl bg-[#feba39] text-[#2c1800] font-bold text-xs hover:bg-[#ffc65c] transition-colors cursor-pointer"
            >
              Aplicar URL
            </button>
          </div>
          <p className="text-[10px] text-[#a89f9e] font-mono">
            Soporta: <strong>YouTube</strong> (youtube.com/watch?v=...), <strong>Vimeo</strong>, <strong>Google Drive</strong> y URLs de video <strong>.mp4</strong> o imágenes <strong>.jpg / .png</strong>.
          </p>
        </div>
      )}

      {/* Mode 4: Preset Stock Images */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presetsToUse.map((preset, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => onChange(preset.url)}
              className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#feba39] h-20 text-left transition-all cursor-pointer"
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                <span className="text-[10px] font-bold text-white truncate">{preset.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Live Selected Image / Video Preview using MediaViewer */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#feba39]/40 bg-black/80 p-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-16 h-16 rounded-lg bg-black border border-white/15 overflow-hidden shrink-0 relative">
              <MediaViewer
                src={value}
                alt="Vista previa"
                className="w-full h-full object-cover"
                controls={false}
                autoPlay={false}
              />
            </div>

            <div className="min-w-0 text-left space-y-0.5">
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {currentMediaInfo.provider === 'drive'
                  ? 'Recurso Google Drive asignado'
                  : currentMediaInfo.provider === 'youtube'
                  ? 'Video de YouTube listo'
                  : currentMediaInfo.provider === 'vimeo'
                  ? 'Video de Vimeo listo'
                  : currentMediaInfo.type === 'video'
                  ? 'Video MP4 listo'
                  : 'Imagen seleccionada'}
              </span>

              <p className="text-[10px] font-mono text-[#a89f9e] truncate max-w-xs">
                {value.startsWith('data:') ? 'Archivo local en base64' : value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
              title="Copiar datos/URL de recurso"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>

            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
              title="Quitar recurso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-[#ff5540] font-mono italic">
          * Ningún recurso asignado aún. Sube un archivo, conecta Google Drive o pega un enlace arriba.
        </p>
      )}
    </div>
  );
};


